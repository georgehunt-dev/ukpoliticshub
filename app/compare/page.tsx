import Link from "next/link";
import type { Metadata } from "next";
import PartyEmblem from "@/components/PartyEmblem";
import { SectionHeading } from "@/components/ui";
import { POLICY_AREAS } from "@/data/policy-areas";
import { allPairs, coverageFor, partiesBySpectrum } from "@/lib/compare";

export const metadata: Metadata = {
  title: "Compare the parties",
  description:
    "Every major UK party on the same ten questions, side by side and sourced, or any two parties compared across all of them.",
};

export default function CompareIndex() {
  const pairs = allPairs();

  return (
    <div className="mx-auto max-w-5xl px-5 py-11">
      <SectionHeading
        as="h1"
        eyebrow="Side by side"
        title="Compare the parties"
        standfirst="All six answer the same ten questions, so their answers can be read against each other rather than one at a time. Pick an issue, or put two parties head to head."
      />

      {/* By issue */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">By issue</h2>
        <p className="mt-1.5 text-[0.9rem] text-ink-soft">
          Every party on one question, ordered left to right by where we place them.
        </p>

        <ul className="mt-5 grid gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-2">
          {POLICY_AREAS.map((area) => {
            const { stated, total } = coverageFor(area.id);
            return (
              <li key={area.id} className="bg-[color:var(--paper-raised)]">
                <Link
                  href={`/compare/${area.id}`}
                  className="group flex h-full flex-col px-4 py-3.5 transition-colors hover:bg-[color:var(--paper-sunk)]/60"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg leading-tight group-hover:text-oxblood">
                      {area.name}
                    </h3>
                    <span className="shrink-0 text-[0.72rem] text-ink-faint tabular">
                      {stated}/{total}
                    </span>
                  </div>
                  <p className="measure mt-1 line-clamp-2 text-[0.8rem] leading-snug text-ink-faint">
                    {area.question}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-2.5 text-[0.78rem] text-ink-faint">
          The fraction is how many of the six have a position we could source on that subject.
        </p>
      </section>

      {/* Head to head */}
      <section className="mt-12">
        <h2 className="font-display text-2xl">Head to head</h2>
        <p className="mt-1.5 text-[0.9rem] text-ink-soft">
          Two parties across all ten areas. Fifteen pairings.
        </p>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((pair) => (
            <li key={pair.slug}>
              <Link
                href={`/compare/${pair.slug}`}
                className="group flex items-center gap-2.5 border border-rule bg-[color:var(--paper-raised)] px-3.5 py-2.5 transition-colors hover:border-oxblood"
              >
                <PartyEmblem slug={pair.left.slug} colour={pair.left.colour} size={20} />
                <span className="min-w-0 flex-1 truncate font-display text-[0.98rem] group-hover:text-oxblood">
                  {pair.left.shortName} <span className="text-ink-faint">vs</span>{" "}
                  {pair.right.shortName}
                </span>
                <PartyEmblem slug={pair.right.slug} colour={pair.right.colour} size={20} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* The spectrum, as a legend */}
      <section className="mt-12 border-t border-rule pt-6">
        <p className="eyebrow mb-3">The order used throughout</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {partiesBySpectrum.map((party) => (
            <li key={party.slug}>
              <Link
                href={`/parties/${party.slug}`}
                className="flex items-center gap-2 text-[0.85rem] transition-colors hover:text-oxblood"
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5"
                  style={{ backgroundColor: party.colour }}
                />
                {party.shortName}
                <span className="text-ink-faint tabular">
                  {party.spectrum > 0 ? "+" : ""}
                  {party.spectrum}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
          Spectrum positions are editorial judgements, not measurements.{" "}
          <Link href="/how-we-work#spectrum" className="link-underline">
            How we place parties
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
