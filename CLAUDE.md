@AGENTS.md

# Working on this site

This is a live public site at **ukpoliticshub.com**, not a demo. `main` auto-deploys to
production via Vercel, so anything merged is published within minutes. Build and lint must
be clean before pushing.

## Read these before editing

- **`README.md` → "Editorial rules baked into the code"** — the seven guarantees the site
  makes. They are the product, not decoration. In particular: every figure carries a
  `Source`; our own judgements render behind `OurAssessment`; official figures render behind
  `OfficialFigure` and are never adjusted; disputed characterisations print the dispute.
- **`README.md` → "Files to edit when refreshing"** — which `data/*.ts` file holds what.
- **`DEPLOY.md`** — deployment, the refresh schedule, and the gaps still open.

## Never invent a number

Where a clean published figure does not exist, print a sourced sentence or an em dash. An
estimate dressed as data is the one failure this site cannot absorb — every figure is
meant to be checkable in one click. The same applies to sources: do not attach a
plausible-looking URL to a claim you have not verified supports it. A blank is honest; a
wrong citation is worse than none.

Where a position genuinely could not be sourced, the row still renders and says so —
worded to admit it may be our gap rather than the party's.

## The aesthetic is fixed

Parchment / navy / oxblood broadsheet. Times New Roman for headings, Source Sans for body.
No masthead, dateline or slogan on the front page. Do not drift toward generic SaaS
styling — rounded cards, gradient hero, purple accent, sans-serif headings are all wrong
here. When adding a component, match the surrounding pages rather than introducing a new
visual idiom.

## Neutrality

The site is not endorsed by or affiliated with any party and is read from across the
spectrum. Copy should be reportable rather than persuasive: state the figure and the
source, print the dispute where one exists, and let the comparison do the arguing. Party
logos are trademarks and are not reproduced; portraits are Wikimedia-licensed and carry
attribution at `/colophon`.
