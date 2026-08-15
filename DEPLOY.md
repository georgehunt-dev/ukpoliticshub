# Launch runbook — ukpoliticshub.com

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

**Public or private?** Either works with Vercel — unlike GitHub Pages, which requires public on a free account. Public invites scrutiny of the editorial rules, which for a site claiming neutrality is a feature; it also exposes the curated figures in `data/` to anyone wanting to argue with them. Your call.

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Framework preset: **Next.js** (auto-detected). Build command, output directory and install command all stay at their defaults.
3. No environment variables are needed — nothing in the app reads one yet.
4. Deploy. First build takes 1–2 minutes.

You will get a `*.vercel.app` URL. Check it before pointing DNS.

## 3. Point the domain (GoDaddy)

In the Vercel project: **Settings → Domains → Add**, enter `ukpoliticshub.com`. Add `www.ukpoliticshub.com` as well and let Vercel redirect it to the apex.

Vercel then shows you the exact records to create. **Use the values on that screen, not the ones below** — Vercel now issues project-specific CNAME hostnames (something like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so a generic value copied from a blog post will not verify.

Typical shape:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `216.198.79.1` — Vercel's current apex IP (the older `76.76.21.21` still works but is legacy) |
| `CNAME` | `www` | the project-specific hostname Vercel shows you |

`@` is not a placeholder — it is DNS shorthand for the root domain itself, and you type that literal character into GoDaddy's Name field.

In GoDaddy: **My Products → your domain → DNS → Manage Zones**.

1. **Delete GoDaddy's parking records first.** A fresh domain ships with **two** `A` records on `@` (seen here: `76.223.105.230` and `13.248.243.5`) plus a `CNAME` on `www`. Every one of the `@` records must go, or they will round-robin against the new one and the domain will intermittently serve GoDaddy's parking page.
2. Add the `A` record on `@` with the value Vercel gave you.
3. Edit or add the `CNAME` on `www` pointing to Vercel's project-specific hostname. No `https://`, no trailing dot needed in GoDaddy.
4. Leave TTL at default (1 hour).

> If you were given four `A` records pointing at `185.199.108–111.153`, those are **GitHub Pages** addresses. They will not work here — this site needs a server, which GitHub Pages does not provide.

Vercel verifies within a few minutes and issues TLS automatically. You do not need to tick anything to enforce HTTPS; Vercel redirects to it by default.

Check propagation with:

```bash
dig +short ukpoliticshub.com A && dig +short www.ukpoliticshub.com CNAME
```

## 4. Turn on the refresh schedule

The news already refreshes itself: pages carry a 10-minute ISR window, so a visitor arriving after that triggers a background rebuild. The gap is that **regeneration only happens on a request** — with no traffic at 4am, nothing refreshes, and the first visitor (or crawler) of the morning can be served a stale page while the rebuild runs behind them.

The scheduler closes that gap by invalidating *and* warming the cache on a fixed interval, whether or not anyone is visiting.

### a. Create the secret

```bash
openssl rand -hex 32
```

Add it in **two** places, with the same value:

1. **Vercel → Settings → Environment Variables**: name `REVALIDATE_SECRET`, scope Production.
2. **GitHub → repo Settings → Secrets and variables → Actions → New repository secret**: name `REVALIDATE_SECRET`.

Redeploy after adding the Vercel variable — environment changes don't apply to existing deployments.

### b. Confirm the endpoint

```bash
curl -i -X POST https://ukpoliticshub.com/api/revalidate -H "Authorization: Bearer YOUR_SECRET"
```

Expect `200` and a JSON body listing the revalidated paths and a `warmed` array of `{path, status: 200}`. Without the header it must return `401` — check that too, since an open endpoint is a free way for anyone to hammer your rebuilds.

### c. The schedule itself

`.github/workflows/refresh.yml` runs **every 15 minutes** and pings the endpoint. It is already in the repo — it starts running once the repo is on GitHub and the secret is set. Trigger it by hand first from **Actions → Refresh live news → Run workflow** to confirm it's green.

If your domain is not `ukpoliticshub.com`, set a repository **variable** (not secret) called `SITE_URL`.

**Why GitHub Actions and not Vercel Cron?** Vercel's Hobby plan caps cron at **once per day**, and a more frequent expression *fails the deployment* rather than warning you. GitHub Actions is free at any interval and works on every plan. `vercel.json` therefore holds only a daily 06:00 job as a backstop — safe on Hobby. If you move to Pro, you can change that schedule to `*/15 * * * *` and drop the Actions workflow.

> GitHub's scheduled runs are best-effort and can be delayed by a few minutes under load. That's fine here: the 10-minute ISR window is the floor, and the cron is what keeps the cache warm on top of it.

### Deployment Protection

New Vercel projects ship with Deployment Protection on, which sends visitors to a Vercel SSO login. It normally covers preview builds and the `*.vercel.app` URL while leaving custom production domains public — but confirm it, because if it covers production the site is invisible to both the public and Googlebot.

**Settings → Deployment Protection.** Vercel Authentication should be off for production, or set so the custom domain is exempt. Verify from a logged-out browser or:

```bash
curl -sI https://ukpoliticshub.com/ | head -1
```

`200` is right. A `302` to `vercel.com/sso-api` means production is still protected.

## 5. After it's live

- [ ] Visit `/` and confirm the news table is populating — it pulls 13 live RSS feeds server-side. If it shows "Live feeds unavailable", the feeds are being blocked from Vercel's egress IPs rather than broken.
- [ ] Check `/robots.txt` and `/sitemap.xml` resolve on the real domain.
- [ ] Paste the URL into a Slack/WhatsApp message to confirm the social card renders.
- [ ] Submit the sitemap in [Google Search Console](https://search.google.com/search-console).
- [ ] Check the Actions tab shows the refresh job running green every 15 minutes.
- [ ] Run the [Rich Results Test](https://search.google.com/test/rich-results) on `/` and `/news` to confirm the structured data parses.

## Known gaps to close before promoting the site widely

**Email capture is decorative.** The field is `disabled` and collects nothing — deliberately, so nobody believes they subscribed. Before turning it on you need a provider (Buttondown, Resend, Mailchimp) *and* a privacy notice: you would be collecting personal data under UK GDPR, which requires saying who you are, what you will do with it, and how to unsubscribe.

**The daily briefing is dated.** `data/briefing.ts` is stamped 14 August 2026 and does not move on its own — the refresh schedule rebuilds the *page*, but the prose on it stays put. It will drift out of step with the live news within a day or two. Either rewrite it on a cadence or label it visibly as a dated edition.

**The curated tier is a snapshot.** Polls, threat scores, crossings and party dossiers are hand-updated in `data/*.ts`. Only the news table refreshes itself. See the table in `README.md` for which file holds what.

**Analytics are installed, but Vercel Analytics needs enabling.** Two layers:

- **Vercel Analytics** — cookieless, runs for every visitor, no consent needed. The code is in place; switch it on at **Vercel → your project → Analytics → Enable**. Until you do, it collects nothing.
- **Google Analytics 4** (`G-BY5YWVF0PR`) — loads *only* after a visitor accepts the banner. Verified: before a choice and after declining, zero Google scripts are fetched and zero GA cookies are set. Override the ID per-environment with `NEXT_PUBLIC_GA_ID` if you ever swap properties.

`/privacy` explains both and is linked from the footer and the banner. Revisit it the moment the site starts collecting anything new — an email list being the obvious candidate.

## Rolling back

Vercel keeps every deployment. **Deployments → ⋯ → Promote to Production** on any earlier build reverts instantly; no git action needed.
