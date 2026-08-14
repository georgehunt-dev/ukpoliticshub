import { parties } from "@/data/parties";

/**
 * The left–right axis, −10 to +10, with every party plotted and one
 * highlighted. Showing all six at once is the point: a position only means
 * something relative to the others.
 */
export default function SpectrumBar({
  value,
  colour,
  label,
}: {
  /** Omit to plot every party evenly, with none singled out. */
  value?: number;
  colour?: string;
  label?: string;
}) {
  const toPct = (v: number) => ((v + 10) / 20) * 100;

  return (
    <div>
      <div className="flex justify-between text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
        <span>Left</span>
        <span>Centre</span>
        <span>Right</span>
      </div>

      <div className="relative mt-2 h-2 bg-[color:var(--paper-sunk)]">
        <span
          className="absolute top-[-4px] h-[16px] w-px bg-[color:var(--rule-strong)]"
          style={{ left: "50%" }}
          aria-hidden="true"
        />
        {/* Every other party, plotted faintly for context */}
        {parties
          .filter((party) => label == null || party.shortName !== label)
          .map((party) => (
            <span
              key={party.slug}
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
              style={{ left: `${toPct(party.spectrum)}%`, backgroundColor: party.colour }}
              title={`${party.shortName}: ${party.spectrum > 0 ? "+" : ""}${party.spectrum}`}
            />
          ))}
        {/* The party in focus, when there is one */}
        {value != null && colour ? (
          <span
            className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[color:var(--paper-raised)] shadow-[0_1px_4px_rgba(15,31,56,0.35)]"
            style={{ left: `${toPct(value)}%`, backgroundColor: colour }}
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {parties.map((party) => (
          <span
            key={party.slug}
            className={`flex items-center gap-1.5 text-[0.75rem] ${
              party.shortName === label ? "font-bold text-ink" : "text-ink-faint"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: party.colour }}
              aria-hidden="true"
            />
            {party.shortName}
            <span className="tabular">
              {party.spectrum > 0 ? "+" : ""}
              {party.spectrum}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
