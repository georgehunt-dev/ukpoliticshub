# Launch runbook: ukpoliticshub.com

Everything in the repo is production-ready: build is clean, lint is clean, no secrets, no `.env`, 11 MB of source and images. The steps below are the ones that need your accounts, so they need you at the keyboard.

---

## 1. Push to GitHub

The repo is committed on `main` with no remote set. Add yours and push:

```bash
git -C ~/ukpolitics-hub remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
```

```bash
git -C ~/ukpolitics-hub push -u origin main
```

If the GitHub repo was created with a README or licence, the push will be rejected as non-fast-forward. Rebase onto it rather than force-pushing:

```bash
git -C ~/ukpolitics-hub pull --rebase origin main && git -C ~/ukpolitics-hub push -u origin main
```

**Public or private?** Either works with Vercel, unlike GitHub Pages, which requires public on a free account. Public invites scrutiny of the editorial rules, which for a site claiming neutrality is a feature; it also exposes the curated figures in `data/` to anyone wanting to argue with them. Your call.

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Framework preset: **Next.js** (auto-detected). Build command, output directory and install command all stay at their defaults.
3. No environment variables are needed, nothing in the app reads one yet.
4. Deploy. First build takes 1–2 minutes.

You will get a `*.vercel.app` URL. Check it before pointing DNS.

## 3. Point the domain (GoDaddy)

In the Vercel project: **Settings → Domains → Add**, enter `ukpoliticshub.com`. Add `www.ukpoliticshub.com` as well and let Vercel redirect it to the apex.

Vercel then shows you the exact records to create. **Use the values on that screen, not the ones below**. Vercel now issues project-specific CNAME hostnames (something like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so a generic value copied from a blog post will not verify.

Typical shape:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `216.198.79.1`. Vercel's current apex IP (the older `76.76.21.21` still works but is legacy) |
| `CNAME` | `www` | the project-specific hostname Vercel shows you |

`@` is not a placeholder. It is DNS shorthand for the root domain itself, and you type that literal character into GoDaddy's Name field.

In GoDaddy: **My Products → your domain → DNS → Manage Zones**.

1. **Delete GoDaddy's parking records first.** A fresh domain ships with **two** `A` records on `@` (seen here: `76.223.105.230` and `13.248.243.5`) plus a `CNAME` on `www`. Every one of the `@` records must go, or they will round-robin against the new one and the domain will intermittently serve GoDaddy's parking page.
2. Add the `A` record on `@` with the value Vercel gave you.
3. Edit or add the `CNAME` on `www` pointing to Vercel's project-specific hostname. No `https://`, no trailing dot needed in GoDaddy.
4. Leave TTL at default (1 hour).

> If you were given four `A` records pointing at `185.199.108–111.153`, those are **GitHub Pages** addresses. They will not work here. This site needs a server, which GitHub Pages does not provide.

Vercel verifies within a few minutes and issues TLS automatically. You do not need to tick anything to enforce HTTPS; Vercel redirects to it by default.

Check propagation with:

```bash
dig +short ukpoliticshub.com A && dig +short www.ukpoliticshub.com CNAME
```

## 4. Turn on the refresh schedule

The news already refreshes itself: pages carry a 10-minute ISR window, so a visitor arriving after that triggers a background rebuild. The gap is that **regeneration only happens on a request**, with no traffic at 4am, nothing refreshes, and the first visitor (or crawler) of the morning can be served a stale page while the rebuild runs behind them.

The scheduler closes that gap by invalidating *and* warming the cache on a fixed interval, whether or not anyone is visiting.

### a. Create the secret

```bash
openssl rand -hex 32
```

Add it in **two** places, with the same value:

1. **Vercel → Settings → Environment Variables**: name `REVALIDATE_SECRET`, scope Production.
2. **GitHub → repo Settings → Secrets and variables → Actions → New repository secret**: name `REVALIDATE_SECRET`.

Redeploy after adding the Vercel variable: environment changes don't apply to existing deployments.

### b. Confirm the endpoint

```bash
curl -i -X POST https://ukpoliticshub.com/api/revalidate -H "Authorization: Bearer YOUR_SECRET"
```

Expect `200` and a JSON body listing the revalidated paths and a `warmed` array of `{path, status: 200}`. Without the header it must return `401`: check that too, since an open endpoint is a free way for anyone to hammer your rebuilds.

### c. The schedule itself

`.github/workflows/refresh.yml` runs **every 15 minutes** and pings the endpoint. It is already in the repo. It starts running once the repo is on GitHub and the secret is set. Trigger it by hand first from **Actions → Refresh live news → Run workflow** to confirm it's green.

If your domain is not `ukpoliticshub.com`, set a repository **variable** (not secret) called `SITE_URL`.

**Why GitHub Actions and not Vercel Cron?** Vercel's Hobby plan caps cron at **once per day**, and a more frequent expression *fails the deployment* rather than warning you. GitHub Actions is free at any interval and works on every plan. `vercel.json` therefore holds only a daily 06:00 job as a backstop, safe on Hobby. If you move to Pro, you can change that schedule to `*/15 * * * *` and drop the Actions workflow.

> GitHub's scheduled runs are best-effort and can be delayed by a few minutes under load. That's fine here: the 10-minute ISR window is the floor, and the cron is what keeps the cache warm on top of it.

### Deployment Protection

New Vercel projects ship with Deployment Protection on, which sends visitors to a Vercel SSO login. It normally covers preview builds and the `*.vercel.app` URL while leaving custom production domains public, but confirm it, because if it covers production the site is invisible to both the public and Googlebot.

**Settings → Deployment Protection.** Vercel Authentication should be off for production, or set so the custom domain is exempt. Verify from a logged-out browser or:

```bash
curl -sI https://ukpoliticshub.com/ | head -1
```

`200` is right. A `302` to `vercel.com/sso-api` means production is still protected.

## 5. After it's live

- [ ] Visit `/` and confirm the news table is populating. It pulls 13 live RSS feeds server-side. If it shows "Live feeds unavailable", the feeds are being blocked from Vercel's egress IPs rather than broken.
- [ ] Check `/robots.txt` and `/sitemap.xml` resolve on the real domain.
- [ ] Paste the URL into a Slack/WhatsApp message to confirm the social card renders.
- [ ] Submit the sitemap in [Google Search Console](https://search.google.com/search-console).
- [ ] Check the Actions tab shows the refresh job running green every 15 minutes.
- [ ] Run the [Rich Results Test](https://search.google.com/test/rich-results) on `/` and `/news` to confirm the structured data parses.

## 6. The index audit (optional, needs a service account)

`.github/workflows/audit-index.yml` asks Google every Monday whether each of
the ~750 URLs in the sitemap is actually indexed, and commits the answer to
`data/generated/index-status.json`. Without credentials it logs that fact and
writes nothing, so the repo is fine as it stands; this is what to do when you
want the data.

It reports rather than pushes. Google's Indexing API is documented as being
for `JobPosting` and `BroadcastEvent` only, so anything claiming to
"auto-index" ordinary pages is using it outside its terms, and that is not a
trade this site should make. What moves indexing here is an honest sitemap and
pages reachable in few clicks. This measures whether that is working.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a
   project and a **service account**. Give it no roles: it needs none.
2. On that service account, **Keys → Add key → JSON**. Download it once.
3. Enable the **Google Search Console API** for the project.
4. In Search Console → **Settings → Users and permissions → Add user**, add the
   service account's email as a **Full** user.

   Try Full first. Google's API reference does not state a permission level for
   URL Inspection, and the widespread "it must be an Owner" advice appears to
   come from the Indexing API, which is a different endpoint with different
   rules. Full is the smaller grant: an owner of a property can remove other
   users and delete the property, which is more than a reporting script needs.

   If the run returns 403, escalate: **Users and permissions**, the three dots
   beside an existing owner, **Manage property owners**, **Add an owner**. The
   script names this case explicitly so you are not left guessing at a bare
   status code.
5. Add two repository secrets under **Settings → Secrets and variables →
   Actions**:

   - `GSC_CLIENT_EMAIL`, the `client_email` from the JSON
   - `GSC_PRIVATE_KEY`, the `private_key` from the JSON, `\n` escapes left
     exactly as they appear in the file

   Optionally `GSC_SITE_URL` if the property is not `sc-domain:ukpoliticshub.com`.
6. Run it by hand once from **Actions → Audit index coverage → Run workflow**.

Quota is 2,000 URLs per day and 600 per minute per property, on a rolling
window shared with anything else inspecting the site. A full sweep of ~750
uses well under half a day's allowance, which is why it is weekly rather than
nightly: coverage state moves over weeks, not hours.

## Known gaps to close before promoting the site widely

**Email capture is built and needs one key to go live.** The form validates, rate-limits, carries a honeypot and shows proper states; `/privacy` covers the newsletter under UK GDPR. Until a provider is configured the endpoint returns 503 and the form says sign-ups aren't open. It never accepts an address and drops it.

To switch it on, add to **Vercel → Environment Variables** and redeploy:

| Key | Value |
| --- | --- |
| `NEWSLETTER_PROVIDER` | `buttondown` or `resend` |
| `NEWSLETTER_API_KEY` | the provider's API key |
| `NEWSLETTER_LIST_ID` | Resend audience id (Resend only) |

Buttondown is the lighter option and has a free tier. Addresses go straight to the provider and are **never stored on this site**, so there is no subscriber list here to lose.

**The briefing is now half live.** The top of `/briefing` is composed from the site's own sourced figures and regenerates with the feeds, so it cannot go stale. The editorial underneath is still hand-written, is labelled with its edition date, and shows a notice from the day after publication. Rewrite it when you have something to say; it will not mislead in the meantime.

**Poll history records itself.** `.github/workflows/record-polls.yml` runs daily at 07:15 UTC, appends the day's average to `data/generated/poll-history.json` and commits it. A snapshot cannot be backfilled, so this matters more the longer it runs. It is the spine of any trend chart.

**The curated tier is a snapshot.** Polls, threat scores, crossings and party dossiers are hand-updated in `data/*.ts`. Only the news table refreshes itself. See the table in `README.md` for which file holds what.

**Analytics are installed, but Vercel Analytics needs enabling.** Two layers:

- **Vercel Analytics**: cookieless, runs for every visitor, no consent needed. The code is in place; switch it on at **Vercel → your project → Analytics → Enable**. Until you do, it collects nothing.
- **Google Analytics 4** (`G-BY5YWVF0PR`): loads *only* after a visitor accepts the banner. Verified: before a choice and after declining, zero Google scripts are fetched and zero GA cookies are set. Override the ID per-environment with `NEXT_PUBLIC_GA_ID` if you ever swap properties.

`/privacy` explains both and is linked from the footer and the banner. Revisit it the moment the site starts collecting anything new: an email list being the obvious candidate.

## Rolling back

Vercel keeps every deployment. **Deployments → ⋯ → Promote to Production** on any earlier build reverts instantly; no git action needed.
