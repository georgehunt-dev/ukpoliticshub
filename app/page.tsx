import { Suspense } from "react";
import Link from "next/link";
import AskBox from "@/components/AskBox";
import ElectionsStrip from "@/components/ElectionsStrip";
import EmailSignup from "@/components/EmailSignup";
import HeroRace from "@/components/HeroRace";
import ImmigrationTracker from "@/components/ImmigrationTracker";
import KeyIndicators from "@/components/KeyIndicators";
import NewsDigest from "@/components/NewsDigest";
import PartyEmblem from "@/components/PartyEmblem";
import PollDetail from "@/components/PollDetail";
import Portrait from "@/components/Portrait";
import PrimeMinisterPanel from "@/components/PrimeMinisterPanel";
import SectionImage from "@/components/SectionImage";
import StartHere from "@/components/StartHere";
import ThreatPanel from "@/components/ThreatPanel";
import { MoreLink } from "@/components/ui";
import { parties } from "@/data/parties";
import { pollAverage } from "@/data/polls";

/** The front page is rebuilt at most every 15 minutes, in step with the feeds. */
export const revalidate = 900;

const TODAY = "2026-08-14";

export default function Home() {
  return (
    <>
      <HeroRace />
      <KeyIndicators today={TODAY} />
      <StartHere />

      <div className="mx-auto max-w-6xl space-y-14 px-5 py-12">
        <AskBox />
        <PollDetail />
        <ImmigrationTracker />
        <ThreatPanel />
        <PrimeMinisterPanel />

        <Suspense fallback={<NewsSkeleton />}>
          <NewsDigest />
        </Suspense>

        <PartyStrip />
      </div>

      <ElectionsStrip today={TODAY} />

      <div className="mx-auto max-w-6xl px-5 py-12">
        <EmailSignup />
      </div>
    </>
  );
}

/** Six doorways into the party dossiers, under a photograph. */
function PartyStrip() {
  const pollBySlug = Object.fromEntries(pollAverage.map((entry) => [entry.party, entry.pct]));
  const ordered = [...parties].sort(
    (a, b) => (pollBySlug[b.slug] ?? 0) - (pollBySlug[a.slug] ?? 0)
  );

  return (
    <section id="parties" className="scroll-mt-24">
      <SectionImage
        photo="buckingham-palace"
        eyebrow="Who they are"
        title="The six parties"
        standfirst="Policies, leadership, where each sits on the spectrum, what they can credibly claim, and what is fairly held against them."
        alt="Buckingham Palace seen from the gardens"
        action={<MoreLink href="/parties">All parties</MoreLink>}
      />

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((party) => (
          <li key={party.slug}>
            <Link
              href={`/parties/${party.slug}`}
              className="panel group flex h-full flex-col p-5 transition-colors hover:bg-[color:var(--paper-sunk)]/55"
              style={{ borderTop: `4px solid ${party.colour}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <PartyEmblem slug={party.slug} colour={party.colour} size={46} />
                <span className="font-display text-3xl font-bold leading-none tabular">
                  {(pollBySlug[party.slug] ?? 0).toFixed(1)}
                  <span className="text-base text-ink-faint">%</span>
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl leading-tight group-hover:text-oxblood">
                {party.shortName}
              </h3>

              <div className="mt-3 flex items-center gap-2.5">
                <Portrait
                  slug={party.leader.slug}
                  name={party.leader.name}
                  size="sm"
                  accent={party.colour}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{party.leader.name}</p>
                  <p className="truncate text-[0.78rem] text-ink-faint">{party.leader.role}</p>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-[0.85rem] leading-relaxed text-ink-soft">
                {party.summary}
              </p>

              <p className="mt-auto pt-4 text-[0.75rem] text-ink-faint">{party.mps}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NewsSkeleton() {
  return (
    <section className="panel p-8">
      <p className="eyebrow">The papers</p>
      <p className="mt-2 font-display text-2xl text-ink-faint">Fetching the front pages…</p>
    </section>
  );
}
