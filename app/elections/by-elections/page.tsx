import type { Metadata } from "next";
import Link from "next/link";
import SectionImage from "@/components/SectionImage";
import { SectionHeading, formatDate } from "@/components/ui";
import {
  allBallots,
  BYELECTION_SOURCE,
  candidateCount,
  POLLING_DAYS,
  pollsCloseAt,
} from "@/lib/byelections";

export const metadata: Metadata = {
  title: "UK council by-elections — dates and candidates",
  description:
    "Every upcoming UK council by-election with the full list of candidates standing, their parties, and where each party stands. Sourced from the councils' own published nominations.",
  alternates: { canonical: "/elections/by-elections" },
};

/** Kept fresh without a redeploy — nominations and dates both move. */
export const revalidate = 3600;

export default function ByElectionsPage() {
  const now = new Date();
  const days = [...POLLING_DAYS].sort((a, b) => a.date.localeCompare(b.date));
  const total = allBallots().length;
  const candidates = days.reduce((sum, day) => sum + candidateCount(day), 0);

  return (
    <div className="shell py-11">
      <SectionImage
        as="h1"
        photo="election-count"
        title="Council by-elections"
        titleClassName="text-4xl sm:text-5xl"
        standfirst={`${total} seats are being contested, with ${candidates} candidates standing. Every name below comes from the council's own published nominations.`}
        alt="Sealed ballot boxes waiting to be opened at a count"
        height="h-52 sm:h-64"
      />

      {days.length === 0 ? (
        <p className="mt-8 text-[0.95rem] leading-relaxed text-ink-soft">
          No by-elections are scheduled in the next two months. This page fills again as soon as
          councils publish their notices.
        </p>
      ) : null}

      {days.map((day) => {
        const closed = pollsCloseAt(day.date) <= now;
        return (
          <section key={day.date} className="mt-10">
            <SectionHeading
              eyebrow={closed ? "Polls closed" : "Polling day"}
              title={formatDate(day.date)}
              standfirst={`${day.ballots.length === 1 ? "One ward" : `${day.ballots.length} wards`}, ${candidateCount(day)} candidates.`}
            />

            <ul className="mt-5 grid gap-px bg-[color:var(--rule)] sm:grid-cols-2">
              {day.ballots.map((ballot) => (
                <li key={ballot.slug} className="bg-[color:var(--paper)]">
                  <Link
                    href={`/elections/${ballot.slug}`}
                    className="block h-full p-4 transition-colors hover:bg-[color:var(--paper-sunk)] sm:p-5"
                  >
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                      {ballot.council}
                    </p>
                    <h3 className="mt-1 font-display text-xl leading-tight sm:text-2xl">
                      {ballot.ward}
                    </h3>
                    <p className="mt-1.5 text-[0.85rem] text-ink-soft">
                      {ballot.candidates.length} candidates
                      {ballot.result ? ` · won by ${ballot.result.party}` : ""}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.75rem] text-ink-faint">
                      {ballot.candidates.map((candidate) => (
                        <span key={candidate.name}>{candidate.party}</span>
                      ))}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <footer className="mt-12 border-t border-rule pt-4">
        <p className="eyebrow mb-2">Source</p>
        <p className="text-[0.86rem] leading-relaxed text-ink-soft">
          Dates and candidate lists come from{" "}
          <a
            href={BYELECTION_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium"
          >
            {BYELECTION_SOURCE.label}
          </a>
          , which records them against each council&rsquo;s published statement of persons
          nominated. A ward only appears here once nominations have closed and that statement has
          been published — before then the list can still change, and a provisional list of
          candidates is not something we will print.
        </p>
      </footer>
    </div>
  );
}
