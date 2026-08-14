import Link from "next/link";
import PartyEmblem from "@/components/PartyEmblem";
import SectionImage from "@/components/SectionImage";
import { Cite, OfficialFigure, formatDate } from "@/components/ui";
import { partyBySlug } from "@/data/parties";
import {
  IMMIGRATION_AS_OF,
  asylumSystem,
  crossingsByYear,
  crossingsByYearSource,
  crossingsYearNote,
  crossingsYearToDate,
  partyPositions,
  plainEnglish,
  trackerCaveat,
} from "@/data/immigration";

export default function ImmigrationTracker() {
  const maxYear = Math.max(
    ...crossingsByYear.map((y) => y.total ?? 0)
  );

  return (
    <section id="immigration" className="scroll-mt-24">
      <SectionImage
        photo="dover"
        eyebrow="Tracker"
        title="Channel crossings"
        standfirst="Small boat arrivals, the asylum backlog and returns — the official figures, updated as the Home Office publishes them."
        alt="The white cliffs and the Strait of Dover"
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Headline number */}
        <article className="panel flex flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3 sm:px-6">
            <p className="eyebrow">{crossingsYearToDate.label}</p>
            <OfficialFigure />
          </div>

          <div className="px-5 py-6 sm:px-6">
            <p className="font-display text-6xl font-bold leading-none tabular sm:text-7xl">
              {crossingsYearToDate.total.toLocaleString("en-GB")}
            </p>
            <p className="mt-2 text-sm text-ink-faint">
              Provisional, as of {formatDate(IMMIGRATION_AS_OF)}
            </p>

            <ul className="mt-5 space-y-2.5">
              {crossingsYearToDate.comparisons.map((c) => (
                <li key={c.label} className="flex items-baseline justify-between gap-4 border-t border-rule pt-2.5">
                  <span className="text-[0.9rem] text-ink-soft">{c.label}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-lg tabular text-ink-faint">
                      {c.value.toLocaleString("en-GB")}
                    </span>
                    <span
                      className={`font-display text-xl font-bold tabular ${
                        c.change < 0 ? "text-[#1d6b3f]" : "text-oxblood"
                      }`}
                    >
                      {c.change > 0 ? "+" : ""}
                      {c.change}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[0.9rem] leading-relaxed text-ink-soft">
              {crossingsYearToDate.note}
            </p>
          </div>

          <div className="mt-auto border-t border-rule px-5 py-3 sm:px-6">
            <Cite source={crossingsYearToDate.source} />
          </div>
        </article>

        {/* By year */}
        <article className="panel flex flex-col">
          <div className="border-b border-rule px-5 py-3 sm:px-6">
            <p className="eyebrow">Small boat arrivals by year</p>
          </div>

          <div className="px-5 py-6 sm:px-6">
            <ul className="space-y-3">
              {crossingsByYear.map((year) => (
                <li key={year.year} className="flex items-center gap-3">
                  <span className="w-11 shrink-0 font-display text-base font-bold tabular text-ink-faint">
                    {year.year}
                  </span>
                  <span className="h-5 flex-1 bg-[color:var(--paper-sunk)]">
                    {year.total != null ? (
                      <span
                        className="block h-full bg-ink/70"
                        style={{ width: `${(year.total / maxYear) * 100}%` }}
                      />
                    ) : null}
                  </span>
                  <span className="w-16 shrink-0 text-right font-display text-base font-bold tabular">
                    {year.total != null ? year.total.toLocaleString("en-GB") : "—"}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-rule pt-3 text-[0.82rem] leading-relaxed text-ink-faint">
              {crossingsYearNote}
            </p>
          </div>

          <div className="mt-auto border-t border-rule px-5 py-3 sm:px-6">
            <Cite source={crossingsByYearSource} />
          </div>
        </article>
      </div>

      {/* The wider system */}
      <div className="mt-5 grid gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-3">
        {asylumSystem.map((stat) => (
          <div key={stat.label} className="bg-[color:var(--paper-raised)] px-5 py-5">
            <p className="eyebrow leading-tight">{stat.label}</p>
            <p className="mt-2 font-display text-4xl font-bold leading-none tabular">{stat.value}</p>
            {stat.change ? (
              <p className="mt-1 text-[0.82rem] font-semibold text-ink-soft">{stat.change}</p>
            ) : null}
            <p className="mt-2.5 text-[0.85rem] leading-relaxed text-ink-soft">{stat.detail}</p>
            <p className="mt-3 text-[0.78rem]">
              <Cite source={stat.source} />
            </p>
          </div>
        ))}
      </div>

      {/* Plain English */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {plainEnglish.map((qa) => (
          <div key={qa.q} className="panel p-5">
            <p className="font-display text-lg leading-snug">{qa.q}</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">{qa.a}</p>
          </div>
        ))}
      </div>

      {/* What each party would do */}
      <div className="mt-8">
        <p className="eyebrow">What each party says it would do</p>
        <ul className="mt-3 grid gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-2">
          {partyPositions.map((position) => {
            const party = partyBySlug[position.party as keyof typeof partyBySlug];
            if (!party) return null;
            return (
              <li key={position.party} className="bg-[color:var(--paper-raised)]">
                <Link
                  href={`/parties/${party.slug}`}
                  className="group flex gap-3.5 px-4 py-4 transition-colors hover:bg-[color:var(--paper-sunk)]/60"
                >
                  <PartyEmblem slug={party.slug} colour={party.colour} size={34} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight group-hover:text-oxblood">
                      {party.shortName}
                    </p>
                    <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-soft">
                      {position.position}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-5 border-l-4 border-ink/30 bg-[color:var(--paper-sunk)]/50 px-4 py-3 text-[0.86rem] leading-relaxed text-ink-soft">
        <strong className="font-semibold text-ink">On the wording:</strong> the government&rsquo;s own
        statistical term is &ldquo;irregular migration&rdquo;, because claiming asylum is lawful
        however someone arrived. Much of the press and several parties say &ldquo;illegal
        immigration&rdquo;. We use the official term in our own words and keep whichever term a
        source used. {trackerCaveat}
      </p>
    </section>
  );
}
