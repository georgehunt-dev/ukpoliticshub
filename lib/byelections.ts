import data from "@/data/generated/byelections.json";

/**
 * Upcoming by-elections, and the rules for when the front page carries them.
 *
 * The countdown band is only worth its place while something is actually
 * happening, so this file owns the decision about when it appears and when it
 * takes itself down. Nothing on the front page should ever be counting towards
 * a date that has passed.
 */

export type Candidate = {
  name: string;
  party: string;
  /** Our own page for that party, where we publish one. */
  partySlug: string | null;
};

export type BallotResult = {
  winner: string;
  party: string;
  partySlug: string | null;
  majority: number | null;
  turnoutPct: number | null;
  source: { label: string; url: string };
};

export type Ballot = {
  id: string;
  slug: string;
  council: string;
  ward: string;
  seats: number;
  candidates: Candidate[];
  /** Null until a human enters it. Never scraped, never estimated. */
  result: BallotResult | null;
  source: { label: string; url: string };
};

export type PollingDay = { date: string; ballots: Ballot[] };

export const POLLING_DAYS = data.days as PollingDay[];
export const BYELECTIONS_FETCHED_AT = data.fetchedAt as string;

export const BYELECTION_SOURCE = {
  label: "Democracy Club, candidates and elections database",
  url: "https://democracyclub.org.uk/",
};

/**
 * Polls close at 22:00 on polling day. British Summer Time runs from late
 * March to late October, which covers every date this data will hold in
 * practice, so 21:00 UTC is the close.
 */
export function pollsCloseAt(date: string): Date {
  return new Date(`${date}T21:00:00Z`);
}

/** How long a finished contest stays on the front page before it comes down. */
const RESULTS_WINDOW_DAYS = 5;

export type BandState =
  | { kind: "none" }
  /** Polls are still to close: show the clock. */
  | { kind: "counting-down"; day: PollingDay; closesAt: string }
  /** Polls have closed and no result has been entered yet. */
  | { kind: "counting"; day: PollingDay }
  /** At least one result is in. */
  | { kind: "results"; day: PollingDay };

/**
 * Which polling day, if any, the front page should carry.
 *
 * Takes the time as an argument rather than reading the clock, so a page can
 * decide this on the server and a component can re-decide it in the browser
 * without the two disagreeing.
 */
export function bandState(now: Date = new Date()): BandState {
  const upcoming = POLLING_DAYS.filter((day) => pollsCloseAt(day.date) > now).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  if (upcoming.length) {
    const day = upcoming[0];
    return { kind: "counting-down", day, closesAt: pollsCloseAt(day.date).toISOString() };
  }

  // Nothing ahead: look back for a poll still inside its results window.
  const recent = POLLING_DAYS.filter((day) => {
    const closed = pollsCloseAt(day.date).getTime();
    return closed <= now.getTime() && now.getTime() - closed < RESULTS_WINDOW_DAYS * 86_400_000;
  }).sort((a, b) => b.date.localeCompare(a.date));

  if (!recent.length) return { kind: "none" };

  const day = recent[0];
  const hasResult = day.ballots.some((ballot) => ballot.result);
  return hasResult ? { kind: "results", day } : { kind: "counting", day };
}

const bySlug = new Map<string, { ballot: Ballot; date: string }>();
for (const day of POLLING_DAYS) {
  for (const ballot of day.ballots) bySlug.set(ballot.slug, { ballot, date: day.date });
}

export function getBallot(slug: string): { ballot: Ballot; date: string } | undefined {
  return bySlug.get(slug);
}

export function allBallots(): { ballot: Ballot; date: string }[] {
  return [...bySlug.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.ballot.council.localeCompare(b.ballot.council)
  );
}

/** Contests still to be held, soonest first. */
export function upcomingBallots(now: Date = new Date()): { ballot: Ballot; date: string }[] {
  return allBallots().filter((entry) => pollsCloseAt(entry.date) > now);
}

/** How many distinct parties are standing across a polling day. */
export function partiesStanding(day: PollingDay): string[] {
  const seen = new Set<string>();
  for (const ballot of day.ballots) {
    for (const candidate of ballot.candidates) seen.add(candidate.party);
  }
  return [...seen].sort();
}

export function candidateCount(day: PollingDay): number {
  return day.ballots.reduce((sum, ballot) => sum + ballot.candidates.length, 0);
}
