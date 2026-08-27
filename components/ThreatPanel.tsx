import SectionImage from "@/components/SectionImage";
import { Cite, OfficialFigure } from "@/components/ui";
import { OFFICIAL_LEVELS, officialTerrorismThreat } from "@/data/threat";

/**
 * The official terrorism threat level, laid out along the page rather than
 * down it.
 *
 * This is the only authoritative number on the site: set by JTAC and MI5,
 * published exactly as issued, never adjusted. It used to share the row with
 * our Russia score, which put an official figure and an editorial one side by
 * side as equals. Russia now sits with the other five assessments below, all
 * flagged as ours, which is a cleaner separation than a visual one.
 *
 * The five-rung ladder runs horizontally so the current rung reads as a
 * position on a scale, and the whole thing costs one band of height instead
 * of half a screen.
 */
export default function ThreatPanel() {
  return (
    <section id="threat" className="scroll-mt-24">
      <SectionImage
        as="h1"
        photo="royal-navy"
        eyebrow="National security"
        title="Threats & alliances"
        standfirst="One official figure, set by the government and never adjusted. Then six assessments of our own, each showing its working."
        alt="HMS Kent, a Royal Navy Type 23 frigate, under way at sea"
      />

      <article className="panel mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3 sm:px-6">
          <p className="eyebrow">UK terrorism threat level</p>
          <OfficialFigure />
        </div>

        <div className="grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
          <div className="lg:border-r lg:border-rule lg:pr-10">
            <p className="font-display text-5xl leading-none text-oxblood sm:text-6xl">
              {officialTerrorismThreat.level}
            </p>
            <p className="mt-1.5 text-[0.95rem] text-ink-soft">
              An attack is <strong className="font-semibold text-ink">highly likely</strong>.
            </p>
          </div>

          {/* The ladder, laid along the page: five rungs, current one filled. */}
          <ol className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5">
            {OFFICIAL_LEVELS.map((level) => {
              const isCurrent = level.level === officialTerrorismThreat.level;
              return (
                <li
                  key={level.level}
                  className={`border-t-[3px] px-2.5 pb-1 pt-2 ${
                    isCurrent
                      ? "border-oxblood bg-oxblood/[0.06]"
                      : "border-[color:var(--rule)]"
                  }`}
                >
                  <p
                    className={`font-display text-base leading-tight ${
                      isCurrent ? "font-bold text-ink" : "text-ink-faint"
                    }`}
                  >
                    {level.level}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] leading-snug text-ink-faint">
                    {level.meaning}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule px-5 py-3 sm:px-6">
          <p className="measure text-[0.8rem] leading-relaxed text-ink-faint">
            Set by the {officialTerrorismThreat.setBy}. Scope: {officialTerrorismThreat.scope}. We
            publish it exactly as issued and never adjust it.
          </p>
          <Cite source={officialTerrorismThreat.source} />
        </div>
      </article>
    </section>
  );
}
