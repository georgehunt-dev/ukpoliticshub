import { CONSTITUENCIES, type Constituency, type ElectionResult } from "@/lib/constituencies";

/**
 * What makes one seat page different from the other 649.
 *
 * Everything here is arithmetic over results we already hold: no new source,
 * no modelling, no projection. The national baselines are summed from all 650
 * constituency results rather than quoted from anywhere, which means they are
 * checkable against the pages themselves and cannot drift out of step with
 * them. Summed this way they reproduce the published 2024 figures exactly.
 */

function generalElections(): { seat: Constituency; result: ElectionResult }[] {
  return CONSTITUENCIES.flatMap((seat) =>
    seat.election ? [{ seat, result: seat.election }] : []
  );
}

export type National = {
  /** Seats included: 650 when the data is complete. */
  seats: number;
  electorate: number;
  votes: number;
  turnoutPct: number;
  /** Party name to national vote share, as a percentage. */
  share: Record<string, number>;
  medianMajorityPct: number;
};

function computeNational(): National {
  const all = generalElections();
  const electorate = all.reduce((sum, { result }) => sum + (result.electorate ?? 0), 0);
  const votes = all.reduce((sum, { result }) => sum + result.totalVotes, 0);

  const totals = new Map<string, number>();
  for (const { result } of all) {
    for (const candidate of result.candidates) {
      totals.set(candidate.party, (totals.get(candidate.party) ?? 0) + candidate.votes);
    }
  }

  const share: Record<string, number> = {};
  for (const [party, total] of totals) share[party] = (total / votes) * 100;

  const majorities = all
    .map(({ result }) => result.majorityPct)
    .filter((value): value is number => value != null)
    .sort((a, b) => a - b);

  return {
    seats: all.length,
    electorate,
    votes,
    turnoutPct: (votes / electorate) * 100,
    share,
    medianMajorityPct: majorities[Math.floor(majorities.length / 2)] ?? 0,
  };
}

export const NATIONAL: National = computeNational();

/** Majorities across all seats, ascending: used to rank one seat against the rest. */
const MAJORITIES: number[] = generalElections()
  .map(({ result }) => result.majorityPct)
  .filter((value): value is number => value != null)
  .sort((a, b) => a - b);

export type SeatContext = {
  majorityPct: number;
  majority: number;
  winner: string;
  challenger: string | null;
  /** Uniform swing that would erase the majority: half of it, by definition. */
  swingToLose: number;
  /** How many of the 650 have a smaller majority than this one. */
  saferThan: number;
  totalRanked: number;
  turnoutPct: number | null;
  turnoutDelta: number | null;
  /** 0 = knife-edge, 100 = the safest seats. Capped so one outlier cannot flatten the scale. */
  meterPct: number;
  shares: {
    party: string;
    colour: string | null;
    votes: number;
    sharePct: number;
    nationalPct: number | null;
    deltaPct: number | null;
  }[];
};

const METER_CEILING = 40;

export function seatContext(result: ElectionResult): SeatContext | null {
  if (result.majorityPct == null || result.majority == null || !result.candidates.length) {
    return null;
  }

  const [winner, runnerUp] = result.candidates;
  const saferThan = MAJORITIES.filter((value) => value < result.majorityPct!).length;

  return {
    majorityPct: result.majorityPct,
    majority: result.majority,
    winner: winner.party,
    challenger: runnerUp?.party ?? null,
    swingToLose: result.majorityPct / 2,
    saferThan,
    totalRanked: MAJORITIES.length,
    turnoutPct: result.turnoutPct,
    turnoutDelta: result.turnoutPct == null ? null : result.turnoutPct - NATIONAL.turnoutPct,
    meterPct: Math.min(result.majorityPct / METER_CEILING, 1) * 100,
    shares: result.candidates.map((candidate) => {
      const sharePct = (candidate.votes / result.totalVotes) * 100;
      const nationalPct = NATIONAL.share[candidate.party] ?? null;
      return {
        party: candidate.party,
        colour: candidate.colour,
        votes: candidate.votes,
        sharePct,
        nationalPct,
        deltaPct: nationalPct == null ? null : sharePct - nationalPct,
      };
    }),
  };
}

/** Where the median seat sits on the meter, so the scale has a labelled middle. */
export const MEDIAN_METER_PCT =
  Math.min(NATIONAL.medianMajorityPct / METER_CEILING, 1) * 100;
