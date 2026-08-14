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

**Public or private?** Either works with Vercel. Public invites scrutiny of the editorial rules, which for a site claiming neutrality is a feature — but it also exposes the curated figures in `data/` to anyone wanting to argue with them. Your call.

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Framework preset: **Next.js** (auto-detected). Build command, output directory and install command all stay at their defaults.
3. No environment variables are needed — nothing in the app reads one yet.
4. Deploy. First build takes 1–2 minutes.

You will get a `*.vercel.app` URL. Check it before pointing DNS.

## 3. Point the domain

In the Vercel project: **Settings → Domains → Add**, enter `ukpoliticshub.com`. Vercel will ask for one of these at your registrar:

| Record | Name | Value |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Vercel shows the exact values for your project — use those over the table above if they differ. Add `www.ukpoliticshub.com` as a domain too and let Vercel redirect it to the apex.

DNS usually propagates in minutes; TLS is issued automatically once it resolves.

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

**No analytics.** If you want them, Vercel Analytics is one toggle in the dashboard and needs no code change.

## Rolling back

Vercel keeps every deployment. **Deployments → ⋯ → Promote to Production** on any earlier build reverts instantly; no git action needed.
