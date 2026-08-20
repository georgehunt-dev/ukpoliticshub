import Link from "next/link";
import ElectionCountdown from "@/components/ElectionCountdown";
import { type BandState, bandState, candidateCount } from "@/lib/byelections";

/**
 * The by-election band on the front page.
 *
 * It appears only when there is something live: a poll still to close, or one
 * that closed inside the last few days. The rest of the time it renders
 * nothing at all rather than leaving a dead strip on the page.
 *
 * Server-rendered apart from the clock, so the councils, the wards and the
 * candidate counts are all in the HTML.
 */

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function Flag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-oxblood px-2 py-1 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[color:var(--paper)]">
      {children}
    </span>
  );
}

/** "Voting Thursday" while it is this week, otherwise the date. */
function flagFor(state: Extract<BandState, { kind: "counting-down" }>, now: Date): string {
  const days = Math.ceil(
    (new Date(state.closesAt).getTime() - now.getTime()) / 86_400_000
  );
  if (days <= 1) return "Voting today";
  if (days <= 7) {
    return `Voting ${new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(`${state.day.date}T12:00:00Z`))}`;
  }
  return "Polls open soon";
}

export default function ByElectionBand() {
  const now = new Date();
  const state = bandState(now);
  if (state.kind === "none") return null;

  const day = state.day;
  const date = new Date(`${day.date}T12:00:00Z`);
  const seats = day.ballots.reduce((sum, ballot) => sum + ballot.seats, 0);
  const candidates = candidateCount(day);
  const index = `/elections/by-elections`;

  return (
    <section className="border-y border-rule bg-ink text-[color:var(--paper)]">
      <div className="shell py-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Flag>
                {state.kind === "counting-down"
                  ? flagFor(state, now)
                  : state.kind === "counting"
                    ? "Counting under way"
                    : "Results"}
              </Flag>
              <h2 className="font-display text-[1.7rem] leading-none sm:text-[2rem]">
                Election countdown
              </h2>
            </div>

            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[color:var(--paper)]/85">
              {seats === 1 ? "One council seat is" : `${seats} council seats are`} being contested
              on {DAY.format(date)}, with {candidates} candidates standing across{" "}
              {day.ballots.length === 1 ? "one ward" : `${day.ballots.length} wards`}.
            </p>

            <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {day.ballots.map((ballot) => (
                <li key={ballot.slug} className="border-t border-white/20 pt-2">
                  <Link
                    href={`/elections/${ballot.slug}`}
                    className="group flex items-baseline justify-between gap-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[1.35rem] leading-tight underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-[color:var(--paper)]/60 sm:text-[1.5rem]">
                        {ballot.ward}
                      </span>
                      <span className="block truncate text-[0.78rem] text-[color:var(--paper)]/60">
                        {ballot.council}
                        {ballot.result ? ` · ${ballot.result.party} hold or gain` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.78rem] tabular text-[color:var(--paper)]/60">
                      {ballot.candidates.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-5">
              <Link
                href={index}
                className="inline-flex items-center gap-2 border border-[color:var(--paper)]/45 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-[color:var(--paper)] hover:text-ink"
              >
                Every candidate, ward by ward <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>

          <div className="lg:pt-1">
            {state.kind === "counting-down" ? (
              <ElectionCountdown closesAt={state.closesAt} href={index} />
            ) : state.kind === "counting" ? (
              <p className="max-w-xs font-display text-xl leading-snug">
                Polls closed at 10pm. We will publish each result here once the councils declare
                them.
              </p>
            ) : (
              <p className="max-w-xs font-display text-xl leading-snug">
                Results are in. Every ward, with the full candidate list, is on the by-elections
                page.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
