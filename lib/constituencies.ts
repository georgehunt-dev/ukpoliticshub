import detail from "@/data/generated/constituency-detail.json";
import type { PhotoSlug } from "@/lib/photos";

/** When the seat dataset was last pulled. Drives sitemap lastmod. */
export const CONSTITUENCIES_FETCHED_AT = detail.fetchedAt as string;

/**
 * The 650 Westminster seats, with the sitting MP and the full 2024 result.
 *
 * Everything here comes from Parliament's own API. Nothing is modelled: there
 * is no constituency-level polling in this country outside occasional MRP
 * work, so the page shows what happened in 2024 and how safe that made the
 * seat, and stops there.
 */

export type Candidate = {
  name: string;
  party: string;
  colour: string | null;
  votes: number;
};

export type ElectionResult = {
  title: string | null;
  /** ISO date of the poll, so page copy never hard-codes a year. */
  date: string | null;
  isGeneralElection: boolean;
  electorate: number | null;
  turnout: number | null;
  turnoutPct: number | null;
  majority: number | null;
  majorityPct: number | null;
  totalVotes: number;
  candidates: Candidate[];
};

export type Constituency = {
  id: number;
  name: string;
  slug: string;
  nation: "England" | "Scotland" | "Wales" | "Northern Ireland";
  mp: {
    name: string;
    party: string | null;
    partyColour: string | null;
    memberId: number | null;
  } | null;
  /** Always the 2024 general election, so all 650 seats compare like with like. */
  election: ElectionResult | null;
  /** A by-election held since 2024, where one has been. Six seats as of now. */
  byElection: ElectionResult | null;
};

export const CONSTITUENCIES = detail.constituencies as Constituency[];

/** The first letter of a seat name, which is how the A to Z pages are keyed. */
export function letterOf(seat: Constituency): string {
  return seat.name[0].toUpperCase();
}

/**
 * Every letter that actually starts a constituency name, with its count.
 *
 * Derived rather than hard-coded: X and Z start none today, and a boundary
 * review that changed that should not need this list edited by hand.
 */
export function seatLetters(): { letter: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const seat of CONSTITUENCIES) {
    const letter = letterOf(seat);
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => a.letter.localeCompare(b.letter));
}

/** The seats under one letter, in name order. */
export function seatsByLetter(letter: string): Constituency[] {
  const wanted = letter.toUpperCase();
  return CONSTITUENCIES.filter((seat) => letterOf(seat) === wanted).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export const CONSTITUENCY_SOURCE = {
  label: "UK Parliament Members API",
  url: "https://members-api.parliament.uk/",
};

/** Names only: the search page ships this, not the megabyte of detail. */
export const CONSTITUENCY_NAMES: { name: string; slug: string }[] = CONSTITUENCIES.map(
  ({ name, slug }) => ({ name, slug })
);

const bySlug = new Map(CONSTITUENCIES.map((c) => [c.slug, c]));

export function getConstituency(slug: string): Constituency | undefined {
  return bySlug.get(slug);
}

const NATION_PHOTO: Record<Constituency["nation"], PhotoSlug> = {
  England: "england",
  Scotland: "scotland",
  Wales: "wales",
  "Northern Ireland": "northern-ireland",
};

/**
 * A photograph of the nation, not of the seat.
 *
 * There is no free, reliable source of 650 representative constituency
 * photographs: a constituency is not a town, and guessing which settlement
 * stands for a seat would put the wrong place on hundreds of pages. So the
 * image is captioned as what it actually is.
 */
export function photoForNation(nation: Constituency["nation"]): PhotoSlug {
  return NATION_PHOTO[nation];
}

/**
 * How safe the seat is, from the winning margin as a share of votes cast.
 * Arithmetic on a published result, not a projection.
 */
export function safetyOf(majorityPct: number | null): {
  label: string;
  note: string;
} {
  if (majorityPct == null) return { label: "Unknown", note: "No published margin." };
  if (majorityPct >= 30)
    return { label: "Very safe", note: "Won by more than thirty points." };
  if (majorityPct >= 15) return { label: "Safe", note: "A comfortable margin." };
  if (majorityPct >= 5)
    return { label: "Competitive", note: "Close enough that a modest swing would change hands." };
  return { label: "Marginal", note: "Decided by under five points." };
}

/** "2024 general election" / "by-election of 18 June 2026", always from the data. */
export function electionLabel(result: ElectionResult): string {
  if (result.isGeneralElection) {
    const year = result.date?.slice(0, 4);
    return year ? `${year} general election` : "general election";
  }
  if (!result.date) return "by-election";
  /* UTC for the same reason as components/ui.tsx: result.date is a calendar
     date, and formatting it in the running zone would date the by-election a
     day early west of Greenwich. */
  const when = new Date(result.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return `by-election of ${when}`;
}

/** Alphabetically neighbouring seats, purely as a way onward. */
export function nearbyByName(slug: string, count = 6): Constituency[] {
  const index = CONSTITUENCIES.findIndex((c) => c.slug === slug);
  if (index < 0) return [];
  const start = Math.max(0, index - count / 2);
  return CONSTITUENCIES.slice(start, start + count + 1).filter((c) => c.slug !== slug);
}
