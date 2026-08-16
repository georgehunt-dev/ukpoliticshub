import Link from "next/link";
import type { Metadata } from "next";
import PartyEmblem from "@/components/PartyEmblem";
import Portrait from "@/components/Portrait";
import SpectrumBar from "@/components/SpectrumBar";
import { SectionHeading } from "@/components/ui";
import { parties } from "@/data/parties";
import { pollAverage } from "@/data/polls";

export const metadata: Metadata = {
  title: "The parties",
  description:
    "The six major parties in British politics: policies, leadership, position on the left–right spectrum, credibility and concerns — every claim sourced.",
};

export default function PartiesPage() {
  const pollBySlug = Object.fromEntries(pollAverage.map((entry) => [entry.party, entry.pct]));
  const ordered = [...parties].sort(
    (a, b) => (pollBySlug[b.slug] ?? 0) - (pollBySlug[a.slug] ?? 0)
  );

  return (
    <div className="shell py-11">
      <SectionHeading
        eyebrow="Who they are"
        title="The six parties"
        standfirst="Ordered by current polling average. Each dossier covers leadership, stated policy, where the party sits on the spectrum, what it can credibly claim, and what is fairly held against it."
      />

      {/* All six on one axis */}
      <div className="panel mt-7 px-5 py-7 sm:px-8">
        <p className="eyebrow mb-4">The spectrum at a glance</p>
        <SpectrumBar />
      </div>

      <ul className="mt-8 space-y-4">
        {ordered.map((party) => (
          <li key={party.slug}>
            <Link
              href={`/parties/${party.slug}`}
              className="panel group flex flex-col gap-5 p-5 transition-colors hover:bg-[color:var(--paper-sunk)]/55 sm:flex-row sm:p-6"
              style={{ borderLeft: `5px solid ${party.colour}` }}
            >
              <Portrait
                slug={party.leader.slug}
                name={party.leader.name}
                size="lg"
                accent={party.colour}
                className="self-start"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <PartyEmblem slug={party.slug} colour={party.colour} size={26} />
                  <h2 className="font-display text-2xl leading-tight group-hover:text-oxblood sm:text-3xl">
                    {party.name}
                  </h2>
                </div>

                <p className="mt-1.5 text-sm text-ink-soft">
                  <strong className="font-semibold text-ink">{party.leader.name}</strong> ·{" "}
                  {party.leader.role}
                </p>

                <p className="mt-3 max-w-3xl text-[0.9rem] leading-relaxed text-ink-soft">
                  {party.summary}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1 text-[0.75rem] text-ink-faint">
                  <span>{party.mps}</span>
                  {party.membership ? <span>{party.membership} members</span> : null}
                  <span>Founded {party.founded}</span>
                </div>
              </div>

              <div className="shrink-0 self-start border border-rule bg-[color:var(--paper-sunk)]/60 px-4 py-3 text-center">
                <p className="eyebrow">Polling</p>
                <p
                  className="mt-0.5 font-display text-3xl font-bold leading-none tabular"
                  style={{ color: party.colour }}
                >
                  {(pollBySlug[party.slug] ?? 0).toFixed(1)}%
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
