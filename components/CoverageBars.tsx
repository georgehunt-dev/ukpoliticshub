import type { CoverageRow } from "@/lib/outlet-coverage";

/**
 * How much attention a masthead gave a subject, against the press as a whole.
 *
 * The bar is drawn against a fixed ceiling rather than the largest row, so a
 * paper with one extreme number does not make its other subjects look flat,
 * and two outlets can be compared by eye across pages.
 */
const CEILING = 4;

export default function CoverageBars({
  rows,
  tone,
}: {
  rows: CoverageRow[];
  /** "more" draws attention in oxblood; "less" stays quiet. */
  tone: "more" | "less";
}) {
  if (!rows.length) {
    return (
      <p className="mt-2 text-[0.84rem] italic leading-relaxed text-ink-faint">
        Nothing stands out on the days recorded so far.
      </p>
    );
  }

  return (
    <ul className="mt-3">
      {rows.map((row) => {
        const width = Math.min(row.index / CEILING, 1) * 100;
        const strong = tone === "more" && row.index >= 1.8;
        return (
          <li key={row.slug} className="border-b border-rule/60 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[1.02rem] leading-tight">{row.name}</span>
              <span className="shrink-0 font-display text-[1.05rem] font-bold tabular">
                {row.index.toFixed(1)}×
              </span>
            </div>

            <div className="mt-1.5 h-2 w-full bg-ink/[0.07]">
              <div
                className="h-full"
                style={{
                  width: `${width}%`,
                  background: strong ? "var(--oxblood)" : "var(--ink-soft)",
                }}
              />
            </div>

            <p className="mt-1 text-[0.72rem] text-ink-faint">
              {row.stories} {row.stories === 1 ? "story" : "stories"} ·{" "}
              {Math.round(row.share * 100)}% of its output, against{" "}
              {Math.round(row.pressShare * 100)}% across the press
            </p>
          </li>
        );
      })}
    </ul>
  );
}
