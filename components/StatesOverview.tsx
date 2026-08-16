import Link from "next/link";
import { OurAssessment, SectionHeading } from "@/components/ui";
import { type Assessment, bandOf, partnerships, scoreOf, threats } from "@/data/states";

/**
 * The comparison row: every assessment on one scale, before any of the detail.
 *
 * Threats and partnerships are kept on separate rails on purpose. They share a
 * method — weighted factors, weights summing to 100 — but not a meaning, and a
 * single 0–100 rail carrying both would invite the reading that a strong
 * alliance cancels out a hostile state.
 */
function Rail({
  title,
  eyebrow,
  standfirst,
  items,
  highIsBad,
}: {
  title: string;
  eyebrow: string;
  standfirst: string;
  items: Assessment[];
  highIsBad: boolean;
}) {
  return (
    <section className="mt-9">
      <SectionHeading eyebrow={eyebrow} title={title} standfirst={standfirst} />

      <ol className="mt-4 border-t border-rule">
        {items.map((item) => {
          const score = scoreOf(item);
          const band = bandOf(item);
          return (
            <li key={item.slug} className="border-b border-rule">
              <Link
                href={`#${item.slug}`}
                className="group flex items-center gap-4 py-3 transition-colors hover:bg-[color:var(--paper-sunk)]/55"
              >
                <span className="w-24 shrink-0 sm:w-32">
                  <span className="block font-display text-lg leading-tight group-hover:text-oxblood">
                    {item.name}
                  </span>
                  <span className="block text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    {band.label}
                  </span>
                </span>

                <span className="hidden min-w-0 flex-1 text-[0.84rem] leading-snug text-ink-soft sm:block">
                  {item.summary}
                </span>

                <span className="ml-auto flex w-32 shrink-0 items-center gap-2.5 sm:w-44">
                  <span aria-hidden="true" className="h-[3px] flex-1 bg-ink/[0.08]">
                    <span
                      className="block h-full"
                      style={{
                        width: `${score}%`,
                        background:
                          highIsBad && score >= 60 ? "var(--oxblood)" : "var(--ink-soft)",
                      }}
                    />
                  </span>
                  <span className="w-9 shrink-0 text-right font-display text-xl font-bold tabular">
                    {score}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function StatesOverview() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">
          Beyond Russia: threats and alliances
        </h2>
        <OurAssessment />
      </div>

      <p className="measure mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
        Six assessments on the same method as the Russia score: each factor scored on its own
        evidence, then weighted, weights summing to 100. Threats measure sustained pressure on the
        UK. Partnerships measure what the UK can currently rely on. Every figure here is ours — the
        only official number on this page is the terrorism level above.
      </p>

      <Rail
        eyebrow="Pressure on the UK"
        title="State threats"
        standfirst="Higher is worse. Scored conservatively: documented grey-zone activity is not a warning of imminent attack."
        items={threats}
        highIsBad
      />

      <Rail
        eyebrow="What the UK can rely on"
        title="Alliances"
        standfirst="Higher is better. Treaty commitments and institutional ties score above political warmth, because they survive a change of government."
        items={partnerships}
        highIsBad={false}
      />
    </div>
  );
}
