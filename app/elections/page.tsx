import type { Metadata } from "next";
import SectionImage from "@/components/SectionImage";
import { Cite, SectionHeading, formatDate } from "@/components/ui";
import { recentResults, upcomingElections } from "@/data/elections";

export const metadata: Metadata = {
  title: "Elections",
  description:
    "The UK election calendar: the next general election deadline, scheduled local and devolved contests, and the by-elections that have already reshaped this Parliament.",
};

/** Real date, so the countdowns stay correct without a redeploy. */
const TODAY = new Date().toISOString().slice(0, 10);

function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00Z`).getTime();
  const now = new Date(`${TODAY}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((target - now) / 86_400_000));
}

const CERTAINTY_LABEL: Record<string, string> = {
  scheduled: "Fixed date",
  deadline: "Latest possible date",
  expected: "Expected",
};

export default function ElectionsPage() {
  return (
    <div className="shell py-11">
      <SectionImage
        as="h1"
        photo="polling-station"
        eyebrow="The calendar"
        title="Upcoming elections"
        standfirst="What is scheduled, what is only a deadline, and what is merely expected — the difference matters, so it is stated on every entry."
        alt="A polling station sign outside a British polling place"
        height="h-52 sm:h-72"
      />

      <ul className="mt-7 space-y-4">
        {upcomingElections.map((election) => (
          <li key={election.name + election.date} className="panel p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl leading-tight sm:text-3xl">
                    {election.name}
                  </h2>
                  <span className="border border-rule bg-[color:var(--paper-sunk)] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
                    {CERTAINTY_LABEL[election.certainty]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-ink-soft">
                  {formatDate(election.date)}
                </p>
                <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-ink-soft">
                  {election.detail}
                </p>
                <p className="mt-3 text-[0.75rem]">
                  <Cite source={election.source} />
                </p>
              </div>

              <div className="shrink-0 border border-rule bg-[color:var(--paper-sunk)]/60 px-5 py-4 text-center">
                <p className="font-display text-4xl font-bold leading-none tabular">
                  {daysUntil(election.date).toLocaleString("en-GB")}
                </p>
                <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                  days
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-14">
        <SectionHeading
          eyebrow="Already decided"
          title="Contests that shaped this Parliament"
          standfirst="By-elections and scheduled contests since 2024 — the only real-world tests of the polling picture."
        />

        <ol className="panel mt-6 divide-y divide-[color:var(--rule)]">
          {recentResults.map((result) => (
            <li key={result.name} className="px-5 py-5 sm:px-7">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                  {formatDate(result.date)}
                </span>
                <h3 className="font-display text-xl leading-snug sm:text-2xl">{result.headline}</h3>
              </div>
              <p className="mt-0.5 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-ink-soft">
                {result.name}
              </p>
              <p className="mt-2.5 max-w-3xl text-[0.9rem] leading-relaxed text-ink-soft">
                {result.detail}
              </p>
              <p className="mt-2.5 text-[0.75rem]">
                <Cite source={result.source} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
