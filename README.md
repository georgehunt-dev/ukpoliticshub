# ukpoliticshub.com

> "Stop scanning social media & news sites for hours. Get up to date information from both sides of the political spectrum about the United Kingdom."

A UK politics hub: polling, threat levels, elections, party dossiers and cross-spectrum news — every figure carrying its source. Not endorsed by or affiliated with any political party.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · deploys to Vercel as-is.

---

## Running it

```bash
npm run dev
```

Then <http://localhost:3000>. `npm run build` produces the production build; 20 routes.

The front page opens on a full-bleed photograph of the No.10 door with the standings over it, followed by a key-indicator band (terrorism level, Russia score, PM approval, Labour lead) — no masthead, dateline or slogan.

## How the data works

Two tiers, deliberately:

| Tier | What | Refresh |
| --- | --- | --- |
| **Live** | The news table — 13 politics RSS feeds fetched server-side, deduplicated, filtered to the last 21 days | Automatic, every 15 min (`revalidate = 900`) |
| **Curated** | Polls, approval ratings, threat scores, party dossiers, election calendar | Edited in `data/*.ts` when the picture moves |

The live tier needs no human. The curated tier is where you (or a scheduled agent) update figures — each file is plain TypeScript with a `Source` attached to every claim.

### Files to edit when refreshing

- `data/polls.ts` — the rolling average, the individual polls behind it, and any movement worth noting
- `data/government.ts` — PM approval, best-PM head-to-head, government standing
- `data/threat.ts` — official terrorism level, and the six-factor Russia model
- `data/parties.ts` — the six party dossiers, frontbenches, credibility and concerns
- `data/elections.ts` — upcoming contests and recent results
- `data/briefing.ts` — the dated daily briefing and its suggested questions
- `data/news.ts` — outlet list and their fixed left–right ratings
- `data/immigration.ts` — the Channel crossings tracker: year-to-date, by year, asylum system

`TODAY` is a constant at the top of `app/page.tsx` and `app/elections/page.tsx`; the election countdowns key off it.

### Portraits

```bash
node scripts/fetch-images.mjs
```

Downloads every leader and frontbencher's Wikipedia lead image from Wikimedia Commons into `public/img/people/`, and records the licence and photographer in `data/generated/portraits.json` — which drives the credits at `/colophon`. The script is resumable and backs off on Wikimedia's rate limits.

It requests the thumbnail URL rather than the full-resolution master; grabbing originals produced 117 MB of images, versus about 4 MB now. If you add people to `PEOPLE` in that script, re-run it and check the reported misses — anyone without a freely licensed portrait falls back to a typographic monogram rather than an unlicensed photo.

### Photography

```bash
node scripts/find-photos.mjs        # list free Commons candidates per subject
node scripts/preview-candidates.mjs <dir>   # download a few to actually look at
node scripts/fetch-photos.mjs       # download the chosen set + credits
```

Free licences only — `fetch-photos.mjs` refuses anything marked fair use or non-free. Credits land in `data/generated/photos.json` and drive `/colophon`.

Pick images by looking at them, not by resolution. The first pass chose the largest free file per search and produced a holiday snapshot of a flag on a Scottish shoreline for the national-security band; it was replaced by HMS Kent under the Open Government Licence. After downloading, resize to 2000px and re-encode (`sips -Z 2000 -s formatOptions 70`) — the raw set was 17 MB, the shipped set is 4 MB.

## Editorial rules baked into the code

These are the guarantees the site makes, and the code enforces them:

1. **Every figure carries a source.** The `Source` type is required across the data layer.
2. **Our judgements are flagged.** Anything we assess ourselves — the Russia score, spectrum positions, outlet ratings — renders behind an `OurAssessment` badge. The terrorism threat level renders behind `OfficialFigure` and is never adjusted.
3. **Disputed characterisations print the dispute.** See Restore Britain's page.
4. **No invented numbers.** Where a clean published figure does not exist, the site prints a sourced sentence or an em dash — never an estimate dressed as data.
5. **The polling average is reported, not computed**, so the headline number is checkable in one click.

`/how-we-work` states all of this publicly, including what each method *cannot* tell you.

6. **Contested terminology is handled explicitly.** The immigration tracker uses the government's own statistical term ("irregular migration"), explains in plain English why claiming asylum is not itself illegal, and notes that much of the press and several parties say "illegal immigration". The wording note ships with the section rather than being buried.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Front page: No.10 hero, five key indicators, spectrum primer, ask box, polls, crossings tracker, threat, PM, news digest, parties, elections |
| `/news` | Every story today, grouped by topic, each topic with a photograph; masthead ratings table |
| `/briefing` | The daily briefing; accepts `?q=` and answers from a prepared set, honestly flagged |
| `/parties`, `/parties/[slug]` | The six dossiers |
| `/elections`, `/how-we-work`, `/colophon` | Calendar, methodology, credits |

## Trademark and licensing

- **Outlet logos are not reproduced either.** Broadcaster and newspaper logos are trademarks and mostly non-free. `components/OutletMark.tsx` sets each masthead's name in the site's own display face on a bar in a colour associated with it — identification without reproduction.
- **Party logos are not reproduced.** Checked in August 2026: the Labour, Liberal Democrat, Green and Restore Britain logos are all held on Wikipedia as non-free "fair use" artwork, Reform UK's current logo is not on Wikimedia at all, and only the Conservative logo is public domain. None are usable on a commercial site. The crests in `components/PartyEmblem.tsx` are therefore original engravings using generic symbols long associated with each party (rose, oak, ascending rule, bird of liberty, leaf, shield), drawn in one house style in each party's own colour from Wikipedia's `{{party color}}` template.
- **Portraits** stay under their original Commons licences (mostly OGL 3 and CC BY), credited at `/colophon`.
- **Headlines and links** belong to their publishers; nothing is rehosted.

## Not yet wired

- **Email signup** is presentational: the field is `disabled`, there is no handler and no endpoint, and the form says so. Wire it to a provider before launch, and add a privacy notice — you will be collecting personal data under UK GDPR.
- **The AI ask box works, but has no model behind it.** Typing a question opens `/briefing?q=…`, which matches it against a prepared answer set written from this site's data and says plainly when nothing fits. Live free-text answers need a server route and an API key (env var — never commit it).
- **The Times and The Spectator** publish no open RSS feed, so they are rated at `/how-we-work` but absent from the news table. This is stated on the page rather than hidden.

## Deploying

See `DEPLOY.md` for the full launch runbook — remote, Vercel import, DNS records and post-launch checks.

The production domain (`https://ukpoliticshub.com`) is already set in `app/layout.tsx` (`metadataBase`), `app/robots.ts` and `app/sitemap.ts`. If you register a different domain, change it in those three files.
