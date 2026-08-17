import history from "@/data/generated/outlet-history.json";
import { subjectBySlug } from "@/data/subjects";

/**
 * What each masthead chose to write about, measured against the press.
 *
 * The figure is an index: the share of an outlet's stories touching a subject,
 * divided by the share across every outlet. 2.0 means twice the attention the
 * press as a whole gave it. It is arithmetic on the outlets' own published
 * output, not an opinion about them — which is the point, because our
 * left-right placement *is* an opinion and this sits beside it.
 *
 * Everything here is windowed over recorded days rather than the live feed.
 * A single day gives each outlet about a dozen stories, where one story moves
 * a share by eight points; published as a finding that would be noise wearing
 * a decimal point. The pages therefore state how many days they are standing
 * on, and say plainly when that is too few.
 */

type Day = {
  date: string;
  stories: number;
  outlets: Record<string, { total: number; subjects: Record<string, number> }>;
};

const DAYS: Day[] = (history.days ?? []) as Day[];

/** Below this the numbers are reported as provisional rather than as findings. */
export const ENOUGH_DAYS = 14;

export type CoverageRow = {
  slug: string;
  name: string;
  stories: number;
  /** Share of this outlet's output. */
  share: number;
  /** Share across every outlet. */
  pressShare: number;
  /** share ÷ pressShare. */
  index: number;
};

export type OutletCoverage = {
  days: number;
  from?: string;
  to?: string;
  stories: number;
  provisional: boolean;
  /** Covered far more than the press average. */
  more: CoverageRow[];
  /** Covered far less — a subject the paper is quiet on. */
  less: CoverageRow[];
};

function window(days: number): Day[] {
  return DAYS.slice(-days);
}

export function coverageOf(outletId: string, days = 30): OutletCoverage {
  const recent = window(days);

  let total = 0;
  let pressTotal = 0;
  const mine: Record<string, number> = {};
  const press: Record<string, number> = {};

  for (const day of recent) {
    pressTotal += day.stories;
    for (const [id, record] of Object.entries(day.outlets)) {
      for (const [slug, n] of Object.entries(record.subjects)) {
        press[slug] = (press[slug] ?? 0) + n;
        if (id === outletId) mine[slug] = (mine[slug] ?? 0) + n;
      }
      if (id === outletId) total += record.total;
    }
  }

  const rows: CoverageRow[] = Object.keys(press)
    .map((slug) => {
      const subject = subjectBySlug[slug];
      const stories = mine[slug] ?? 0;
      const share = total ? stories / total : 0;
      const pressShare = pressTotal ? (press[slug] ?? 0) / pressTotal : 0;
      return {
        slug,
        name: subject?.name ?? slug,
        stories,
        share,
        pressShare,
        index: pressShare ? share / pressShare : 0,
      };
    })
    // A subject the press barely touched cannot show a meaningful ratio.
    .filter((row) => row.pressShare > 0.02);

  const dated = recent.map((d) => d.date);

  return {
    days: recent.length,
    from: dated[0],
    to: dated[dated.length - 1],
    stories: total,
    provisional: recent.length < ENOUGH_DAYS,
    more: rows
      .filter((row) => row.stories >= 2 && row.index > 1.15)
      .sort((a, b) => b.index - a.index)
      .slice(0, 6),
    less: rows
      .filter((row) => row.index < 0.6)
      .sort((a, b) => a.index - b.index)
      .slice(0, 4),
  };
}

export const HISTORY_DAYS = DAYS.length;

/**
 * "Is Daily Mail biased" is not English. Some mastheads carry their article in
 * the name and some don't, so it is added where it is missing.
 */
export function withArticle(name: string): string {
  if (name.startsWith("The ")) return name;
  if (/^Daily |^Financial Times$/.test(name)) return `the ${name}`;
  return name;
}
