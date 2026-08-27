@AGENTS.md

# Working on this site

This is a live public site at **ukpoliticshub.com**, not a demo. `main` auto-deploys to
production via Vercel, so anything merged is published within minutes. Build and lint must
be clean before pushing.

## Read these before editing

- **`README.md` → "Editorial rules baked into the code"**: the seven guarantees the site
  makes. They are the product, not decoration. In particular: every figure carries a
  `Source`; our own judgements render behind `OurAssessment`; official figures render behind
  `OfficialFigure` and are never adjusted; disputed characterisations print the dispute.
- **`README.md` → "Files to edit when refreshing"**, which `data/*.ts` file holds what.
- **`DEPLOY.md`**: deployment, the refresh schedule, and the gaps still open.

## Never invent a number

Where a clean published figure does not exist, print a sourced sentence or the em dash
placeholder described under "No em dashes in prose" below. An
estimate dressed as data is the one failure this site cannot absorb. Every figure is
meant to be checkable in one click. The same applies to sources: do not attach a
plausible-looking URL to a claim you have not verified supports it. A blank is honest; a
wrong citation is worse than none.

Where a position genuinely could not be sourced, the row still renders and says so,
worded to admit it may be our gap rather than the party's.

## No em dashes in prose

Non-negotiable, and it applies to everything: page copy, metadata and OG descriptions,
alt text, source labels, code comments and these markdown files. Use a comma, a colon, a
semicolon, a full stop or brackets, whichever the sentence actually wants. A comma
dropped in where the dash joined two independent clauses makes a splice, and a pair of
dashes around an aside that already contains commas needs brackets, not more commas.

The one exception is the bare `"—"` standing in a table cell for a figure we do not hold.
That is a glyph meaning "no published figure", not punctuation, and it is the convention
"Never invent a number" above depends on. There are ten of them and they stay.

En dashes (`–`) are untouched and correct in ranges and pairings: `−10 to +10`,
`left–right`, `2025–26`.

## The aesthetic is fixed

Parchment / navy / oxblood broadsheet. Times New Roman for headings, Source Sans for body.
No masthead or dateline on the front page. Do not drift toward generic SaaS styling:
rounded cards, gradient hero, purple accent, sans-serif headings are all wrong here. When
adding a component, match the surrounding pages rather than introducing a new visual idiom.

The front page carries one line saying what the site is: "All In One Hub For British
Politics, From Both Sides.", and it is the page's `h1`. That is a deliberate exception to
the no-slogan rule this file used to state: reader feedback was that the value was obvious
once you used the site and invisible before. It is one line, it makes a claim about
coverage rather than a promise about quality, and it stays that way.

That opening block is sized to end at the fold on a wide screen
(`lg:min-h-[calc(100dvh-9rem)]`), so the indicator tiles below start below it rather than
showing as a strip of half-visible boxes. It is a minimum, not a maximum: a short window
scrolls normally and nothing is ever clipped. If the header's height changes, that `9rem`
has to change with it.

## Neutrality

The site is not endorsed by or affiliated with any party and is read from across the
spectrum. Copy should be reportable rather than persuasive: state the figure and the
source, print the dispute where one exists, and let the comparison do the arguing. Party
logos are trademarks and are not reproduced; portraits are Wikimedia-licensed and carry
attribution at `/colophon`.
