import { Cite, OfficialFigure, OurAssessment, formatDate } from "@/components/ui";
import { type Assessment, bandOf, scoreOf } from "@/data/states";

/**
 * One state assessment, opened out: the composite, then every factor that
 * produced it with its own score, weight, evidence and sources.
 *
 * The working is shown rather than summarised because the number is ours. A
 * reader who disagrees with the score should be able to see exactly which
 * factor they disagree with and go to the source behind it. Where the UK
 * government has made a formal designation it is printed separately and marked
 * official — that part is not our judgement. Where the subject rejects the
 * characterisation, the rejection is printed too.
 */
export default function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const score = scoreOf(assessment);
  const band = bandOf(assessment);
  const isThreat = assessment.kind === "threat";

  return (
    <article id={assessment.slug} className="panel scroll-mt-24">
      <header className="border-b border-rule px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="eyebrow">
              {isThreat ? "Pressure on the UK" : "What the UK can rely on"}
            </p>
            <h3 className="mt-1 font-display text-3xl leading-none">{assessment.name}</h3>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span
              className={`font-display text-5xl font-bold leading-none tabular ${
                isThreat && score >= 60 ? "text-oxblood" : ""
              }`}
            >
              {score}
            </span>
            <span className="font-display text-lg text-ink-faint">/100</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="border border-ink/25 bg-ink/[0.05] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
            {band.label}
          </span>
          <span className="text-[0.78rem] text-ink-soft">{band.note}</span>
          <OurAssessment className="ml-auto" />
        </div>

        <p className="measure mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
          {assessment.standfirst}
        </p>
      </header>

      {assessment.official ? (
        <div className="border-b border-rule bg-[color:var(--paper-sunk)]/60 px-5 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <OfficialFigure />
            <p className="text-[0.78rem] font-semibold">{assessment.official.label}</p>
          </div>
          <p className="measure mt-1.5 text-[0.84rem] leading-relaxed text-ink-soft">
            {assessment.official.detail}
          </p>
          <div className="mt-1.5">
            <Cite source={assessment.official.source} />
          </div>
        </div>
      ) : null}

      <ol className="divide-y divide-rule">
        {assessment.factors.map((factor) => (
          <li key={factor.name} className="px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display text-lg leading-tight">{factor.name}</p>
              <p className="shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                <span className="text-ink">{factor.score}</span>/100 · {factor.weight}% weight
              </p>
            </div>

            {/* The bar is the factor's own score; the tint below it is how much
                of the composite this factor is allowed to move. */}
            <div className="mt-2 h-[3px] w-full bg-ink/[0.08]">
              <div
                className="h-full"
                style={{
                  width: `${factor.score}%`,
                  background: factor.score >= 60 ? "var(--oxblood)" : "var(--ink-soft)",
                }}
              />
            </div>

            <p className="measure mt-2.5 text-[0.88rem] leading-relaxed text-ink-soft">
              {factor.evidence}
            </p>

            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {factor.sources.map((source) => (
                <li key={source.url}>
                  <Cite source={source} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {assessment.dispute ? (
        <div className="border-t border-rule px-5 py-3.5 sm:px-6">
          <p className="eyebrow mb-1">Disputed</p>
          <p className="measure text-[0.86rem] leading-relaxed text-ink-soft">
            {assessment.dispute.text}
          </p>
          {assessment.dispute.source ? (
            <div className="mt-1.5">
              <Cite source={assessment.dispute.source} />
            </div>
          ) : null}
        </div>
      ) : null}

      <footer className="border-t border-rule px-5 py-2.5 text-[0.72rem] text-ink-faint sm:px-6">
        Assessed {formatDate(assessment.assessedOn)} · weights sum to 100
      </footer>
    </article>
  );
}
