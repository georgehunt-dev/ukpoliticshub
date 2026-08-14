import SectionImage from "@/components/SectionImage";
import { Cite, OfficialFigure, OurAssessment, formatDate } from "@/components/ui";
import {
  OFFICIAL_LEVELS,
  RUSSIA_ASSESSED_ON,
  RUSSIA_BANDS,
  officialTerrorismThreat,
  russiaBand,
  russiaCaveat,
  russiaFactors,
  russiaScore,
  russiaSummary,
} from "@/data/threat";

export default function ThreatPanel() {
  return (
    <section id="threat" className="scroll-mt-24">
      <SectionImage
        photo="royal-navy"
        eyebrow="National security"
        title="Threat levels"
        standfirst="One official figure, set by the government, and one editorial assessment of our own. They are kept visually distinct on purpose, and never blended into a single number."
        alt="HMS Kent, a Royal Navy Type 23 frigate, under way at sea"
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* ── Official terrorism threat level ───────────────────────────── */}
        <article className="panel flex flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3 sm:px-6">
            <p className="eyebrow">UK terrorism threat level</p>
            <OfficialFigure />
          </div>

          <div className="px-5 py-6 sm:px-6">
            <p className="font-display text-5xl leading-none text-oxblood sm:text-6xl">
              {officialTerrorismThreat.level}
            </p>
            <p className="mt-2 text-base text-ink-soft">
              An attack is <strong className="font-semibold text-ink">highly likely</strong>.
            </p>

            {/* The five-rung ladder */}
            <ol className="mt-6 space-y-px">
              {OFFICIAL_LEVELS.map((level) => {
                const isCurrent = level.level === officialTerrorismThreat.level;
                return (
                  <li
                    key={level.level}
                    className={`flex items-center justify-between gap-3 border-l-4 px-3 py-2 text-sm ${
                      isCurrent
                        ? "border-oxblood bg-oxblood/[0.07] font-semibold text-ink"
                        : "border-[color:var(--rule)] text-ink-faint"
                    }`}
                  >
                    <span>{level.level}</span>
                    <span className="text-right text-[0.78rem] font-normal">{level.meaning}</span>
                  </li>
                );
              })}
            </ol>

            <p className="mt-5 text-[0.82rem] leading-relaxed text-ink-faint">
              Set by the {officialTerrorismThreat.setBy}. Scope: {officialTerrorismThreat.scope}. We
              publish it exactly as issued and never adjust it.
            </p>
          </div>

          <div className="mt-auto border-t border-rule px-5 py-3 text-[0.78rem] sm:px-6">
            <Cite source={officialTerrorismThreat.source} />
          </div>
        </article>

        {/* ── Russia assessment ─────────────────────────────────────────── */}
        <article className="panel flex flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3 sm:px-6">
            <p className="eyebrow">Russia — pressure on the United Kingdom</p>
            <OurAssessment />
          </div>

          <div className="px-5 py-6 sm:px-6">
            <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
              <p className="font-display text-6xl font-bold leading-none tabular sm:text-7xl">
                {russiaScore}
                <span className="text-2xl font-normal text-ink-faint">/100</span>
              </p>
              <div className="pb-1">
                <p className="font-display text-2xl leading-none text-oxblood">{russiaBand.label}</p>
                <p className="mt-1 text-[0.82rem] text-ink-soft">{russiaBand.note}</p>
              </div>
            </div>

            {/* Band scale */}
            <div className="mt-5">
              <div className="relative h-2.5 w-full overflow-hidden bg-[color:var(--paper-sunk)]">
                <div
                  className="h-full bg-oxblood/80"
                  style={{ width: `${russiaScore}%` }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-ink"
                  style={{ left: `${russiaScore}%` }}
                  aria-hidden="true"
                />
              </div>
              <ol className="mt-1.5 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                {RUSSIA_BANDS.map((band) => (
                  <li key={band.label} className={band.label === russiaBand.label ? "text-oxblood" : ""}>
                    {band.label}
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-5 text-[0.92rem] leading-relaxed text-ink-soft">{russiaSummary}</p>

            {/* Factor breakdown */}
            <div className="mt-6">
              <p className="eyebrow mb-3">What makes up the score</p>
              <ul className="space-y-px">
                {russiaFactors.map((factor) => (
                  <li key={factor.name} className="border-t border-rule">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center gap-3 py-2.5">
                        <span className="min-w-0 flex-1 text-sm leading-snug">
                          {factor.name}
                          <span className="ml-1.5 whitespace-nowrap text-[0.72rem] text-ink-faint">
                            weight {factor.weight}%
                          </span>
                        </span>
                        <span className="h-1.5 w-20 shrink-0 bg-[color:var(--paper-sunk)] sm:w-28">
                          <span
                            className="block h-full bg-ink/55"
                            style={{ width: `${factor.score}%` }}
                          />
                        </span>
                        <span className="w-8 shrink-0 text-right font-display text-lg font-bold tabular">
                          {factor.score}
                        </span>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-ink-faint transition-transform group-open:rotate-90"
                        >
                          ›
                        </span>
                      </summary>
                      <div className="pb-4 pl-0 pr-2">
                        <p className="text-[0.85rem] leading-relaxed text-ink-soft">{factor.evidence}</p>
                        <ul className="mt-2 space-y-0.5">
                          {factor.sources.map((source) => (
                            <li key={source.url} className="text-[0.75rem]">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-underline text-ink-faint"
                              >
                                {source.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-rule pt-3 text-[0.78rem] text-ink-faint">
                Each factor is scored 0–100 on its own evidence, then weighted; the weights sum to
                100. Assessed {formatDate(RUSSIA_ASSESSED_ON)}.
              </p>
            </div>
          </div>

          <div className="mt-auto border-t border-rule bg-oxblood/[0.05] px-5 py-3 sm:px-6">
            <p className="text-[0.78rem] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-oxblood">Read this carefully:</strong>{" "}
              {russiaCaveat}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
