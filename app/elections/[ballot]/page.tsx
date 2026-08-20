import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreLink, SectionHeading, formatDate } from "@/components/ui";
import {
  allBallots,
  BYELECTION_SOURCE,
  getBallot,
  pollsCloseAt,
} from "@/lib/byelections";
import { getParty } from "@/data/parties";

export function generateStaticParams() {
  return allBallots().map(({ ballot }) => ({ ballot: ballot.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/elections/[ballot]">): Promise<Metadata> {
  const { ballot: slug } = await params;
  const entry = getBallot(slug);
  if (!entry) return { title: "By-election not found" };

  const { ballot, date } = entry;
  return {
    title: `${ballot.ward} by-election, ${ballot.council} — ${formatDate(date)}`,
    description: `Who is standing in the ${ballot.ward} by-election in ${ballot.council} on ${formatDate(date)}: all ${ballot.candidates.length} candidates and their parties, from the council's published nominations.`,
    alternates: { canonical: `/elections/${ballot.slug}` },
  };
}

export default async function BallotPage({ params }: PageProps<"/elections/[ballot]">) {
  const { ballot: slug } = await params;
  const entry = getBallot(slug);
  if (!entry) notFound();

  const { ballot, date } = entry;
  const closed = pollsCloseAt(date) <= new Date();

  return (
    <div className="shell py-11">
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
        <Link href="/elections/by-elections" className="link-underline">
          Council by-elections
        </Link>{" "}
        · {ballot.council}
      </p>

      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-5xl">
        {ballot.ward} by-election
      </h1>

      <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
        {closed ? "Polls closed" : "Polls are open"} on {formatDate(date)} from 7am to 10pm.{" "}
        {ballot.seats === 1 ? "One seat" : `${ballot.seats} seats`} on {ballot.council}, contested
        by {ballot.candidates.length} candidates.
      </p>

      {ballot.result ? (
        <section className="mt-7 border border-rule bg-[color:var(--paper-raised)] p-5 sm:p-6">
          <p className="eyebrow">Result</p>
          <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-3xl">
            {ballot.result.winner} ({ballot.result.party})
          </h2>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
            {ballot.result.majority != null
              ? `Majority ${ballot.result.majority.toLocaleString("en-GB")}. `
              : ""}
            {ballot.result.turnoutPct != null ? `Turnout ${ballot.result.turnoutPct}%.` : ""}
          </p>
          <p className="mt-2.5 text-[0.75rem]">
            <a
              href={ballot.result.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium text-ink-soft"
            >
              Source: {ballot.result.source.label}
            </a>
          </p>
        </section>
      ) : closed ? (
        <p className="mt-7 border border-dashed border-rule p-5 text-[0.92rem] leading-relaxed text-ink-soft">
          Polls have closed and the count is under way. We will publish the result here once the
          council declares it — we would rather leave this blank than print a projection.
        </p>
      ) : null}

      <section className="mt-10">
        <SectionHeading
          title="Who is standing"
          standfirst="Every candidate on the ballot paper, in alphabetical order, exactly as the council published them."
        />

        <ul className="mt-5 divide-y divide-[color:var(--rule)] border-y border-rule">
          {ballot.candidates.map((candidate) => {
            const party = candidate.partySlug ? getParty(candidate.partySlug) : undefined;
            return (
              <li
                key={`${candidate.name}-${candidate.party}`}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
              >
                <span className="font-display text-lg leading-tight sm:text-xl">
                  {candidate.name}
                </span>
                <span className="flex items-center gap-2.5 text-[0.88rem] text-ink-soft">
                  {party ? (
                    <span
                      aria-hidden="true"
                      className="inline-block h-3 w-3 shrink-0 border border-ink/20"
                      style={{ background: party.colour }}
                    />
                  ) : null}
                  {candidate.partySlug ? (
                    <Link href={`/parties/${candidate.partySlug}`} className="link-underline">
                      {candidate.party}
                    </Link>
                  ) : (
                    candidate.party
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-[0.78rem] leading-snug text-ink-faint">
          Party names link to our own page on where that party stands. Candidates standing as
          independents, or for parties we do not cover, are listed without a link rather than
          pointed somewhere that does not describe them.
        </p>
      </section>

      <div className="mt-10 border-t border-rule pt-5">
        <MoreLink href="/elections/by-elections">Every by-election, ward by ward</MoreLink>
      </div>

      <footer className="mt-8 border-t border-rule pt-4">
        <p className="eyebrow mb-2">Source</p>
        <p className="text-[0.86rem] leading-relaxed text-ink-soft">
          The date and the candidate list come from{" "}
          <a
            href={ballot.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium"
          >
            {BYELECTION_SOURCE.label}
          </a>
          , recorded against {ballot.council}&rsquo;s published statement of persons nominated.
        </p>
      </footer>
    </div>
  );
}
