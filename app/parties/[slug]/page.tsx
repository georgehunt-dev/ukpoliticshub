import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import PartyHeader from "@/components/PartyHeader";
import PolicyGrid from "@/components/PolicyGrid";
import Portrait from "@/components/Portrait";
import SpectrumBar from "@/components/SpectrumBar";
import { Cite, SectionHeading, SourceList, formatDate } from "@/components/ui";
import { getParty, parties } from "@/data/parties";
import { pollAverage } from "@/data/polls";

export function generateStaticParams() {
  return parties.map((party) => ({ slug: party.slug }));
}

export async function generateMetadata(
  props: PageProps<"/parties/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const party = getParty(slug);
  if (!party) return {};
  return {
    title: party.name,
    description: party.summary.slice(0, 180),
  };
}

export default async function PartyPage(props: PageProps<"/parties/[slug]">) {
  const { slug } = await props.params;
  const party = getParty(slug);
  if (!party) notFound();

  const polling = pollAverage.find((entry) => entry.party === party.slug);

  return (
    <article>
      <PartyHeader party={party} polling={polling?.pct} />

      <div className="shell space-y-12 py-11">
        {/* ── Spectrum ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            eyebrow="Where they sit"
            title="Position on the spectrum"
            standfirst={party.spectrumNote}
          />
          <div className="panel mt-5 px-5 py-7 sm:px-8">
            <SpectrumBar value={party.spectrum} colour={party.colour} label={party.shortName} />
          </div>
          <p className="mt-3 text-[0.78rem] text-ink-faint">
            Spectrum positions are editorial judgements, not measurements.{" "}
            <Link href="/how-we-work#spectrum" className="link-underline">
              How we place parties
            </Link>
            .
          </p>
        </section>

        {/* ── The leader ───────────────────────────────────────────────── */}
        <section id="leader" className="scroll-mt-24">
          <SectionHeading eyebrow="Leadership" title="The leader" />

          <div className="panel mt-5">
            <div className="flex flex-col gap-6 px-5 py-7 sm:flex-row sm:px-8">
              <Portrait
                slug={party.leader.slug}
                name={party.leader.name}
                size="xl"
                accent={party.colour}
                className="self-start"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-3xl leading-tight sm:text-4xl">
                  {party.leader.name}
                </h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-ink-soft">
                  {party.leader.role}
                  {party.leader.seat ? ` · ${party.leader.seat}` : ""}
                </p>

                {party.leader.background ? (
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                    {party.leader.background}
                  </p>
                ) : null}

                <div className="mt-5 grid gap-px bg-[color:var(--rule)] sm:grid-cols-2">
                  {party.leader.credibility ? (
                    <div className="bg-[color:var(--paper-raised)] py-3 pr-4 sm:pl-4">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        Track record
                      </p>
                      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft">
                        {party.leader.credibility}
                      </p>
                    </div>
                  ) : null}
                  {party.leader.concerns ? (
                    <div className="bg-[color:var(--paper-raised)] py-3 pr-4 sm:pl-4">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-oxblood">
                        Questions raised
                      </p>
                      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft">
                        {party.leader.concerns}
                      </p>
                    </div>
                  ) : null}
                </div>

                {party.leader.sources?.length ? (
                  <SourceList sources={party.leader.sources} />
                ) : null}
              </div>
            </div>

            {party.deputy ? (
              <div className="flex items-center gap-4 border-t border-rule px-5 py-4 sm:px-8">
                <Portrait
                  slug={party.deputy.slug}
                  name={party.deputy.name}
                  size="md"
                  accent={party.colour}
                />
                <div className="min-w-0">
                  <p className="eyebrow">Second in command</p>
                  <p className="mt-0.5 font-display text-xl">{party.deputy.name}</p>
                  <p className="text-sm text-ink-soft">
                    {party.deputy.role}
                    {party.deputy.seat ? ` · ${party.deputy.seat}` : ""}
                  </p>
                  {party.deputy.background ? (
                    <p className="mt-1 text-[0.82rem] leading-snug text-ink-faint">
                      {party.deputy.background}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <PolicyGrid party={party} />

        {/* ── Credibility and concerns, side by side ───────────────────── */}
        <section>
          <SectionHeading
            eyebrow="The case each way"
            title="Credibility and concerns"
            standfirst="What the party can point to, and what is fairly put against it. Both columns are drawn from documented, attributable material, never from our own opinion of the party."
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="panel p-5 sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#1d4f91]">
                What they can credibly claim
              </p>
              <ul className="mt-3 space-y-3">
                {party.credibility.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#1d4f91]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel p-5 sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-oxblood">
                Concerns and open questions
              </p>
              <ul className="mt-3 space-y-3">
                {party.concerns.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-oxblood" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Frontbench ───────────────────────────────────────────────── */}
        {party.frontbench.length ? (
          <section>
            <SectionHeading
              eyebrow="The team"
              title={party.slug === "labour" ? "The Cabinet" : "Frontbench and key figures"}
              standfirst={
                party.slug === "labour"
                  ? "The Burnham ministry, appointed 20 July 2026."
                  : undefined
              }
            />
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {party.frontbench.map((person) => (
                <li key={person.slug} className="panel flex gap-3.5 p-4">
                  <Portrait
                    slug={person.slug}
                    name={person.name}
                    size="md"
                    accent={party.colour}
                  />
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight">{person.name}</p>
                    <p className="mt-0.5 text-[0.8rem] font-semibold leading-snug text-ink-soft">
                      {person.role}
                    </p>
                    {person.seat ? (
                      <p className="text-[0.75rem] text-ink-faint">{person.seat}</p>
                    ) : null}
                    {person.background ? (
                      <p className="mt-1.5 text-[0.78rem] leading-snug text-ink-faint">
                        {person.background}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ── Recent news ──────────────────────────────────────────────── */}
        {party.recentNews.length ? (
          <section>
            <SectionHeading eyebrow="In the news" title="Recent developments" />
            <ul className="panel mt-5 divide-y divide-[color:var(--rule)]">
              {party.recentNews.map((item) => (
                <li key={item.headline} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4">
                  <span className="w-28 shrink-0 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    {formatDate(item.date)}
                  </span>
                  <p className="min-w-0 flex-1 font-display text-lg leading-snug">
                    {item.headline}
                  </p>
                  <span className="text-[0.75rem]">
                    <Cite source={item.source} prefix="via" />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <SourceList sources={party.sources} label="Sources for this profile" />
      </div>
    </article>
  );
}
