import { MEDIAN_METER_PCT, type SeatContext } from "@/lib/seat-context";

/**
 * Where this seat sits between knife-edge and fortress.
 *
 * A majority quoted as a percentage is precise and almost meaningless to read
 * cold — "13.2 points" tells you nothing until you know what a typical seat
 * looks like. The scale carries the median of all 650 as a marked point so the
 * number has something to be compared against.
 *
 * It plots the published margin. It is not a prediction, and nothing here
 * models what might happen next.
 */
export default function SafetyMeter({
  context,
  label,
}: {
  context: SeatContext;
  label: string;
}) {
  return (
    <section className="mt-8 border-t border-rule pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="eyebrow">How safe is this seat?</p>
        <p className="font-display text-xl leading-none text-[color:var(--oxblood)]">{label}</p>
      </div>

      <div className="relative mt-3 h-3 bg-[color:var(--paper-sunk)]">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-ink/15"
          style={{ width: `${context.meterPct}%` }}
        />
        {/* The median of all 650, so the reader has a reference point. */}
        <span
          aria-hidden="true"
          className="absolute -top-1 h-5 w-px bg-[color:var(--gold)]"
          style={{ left: `${MEDIAN_METER_PCT}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute -top-1.5 h-6 w-[3px] -translate-x-1/2 bg-[color:var(--oxblood)]"
          style={{ left: `${context.meterPct}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-[0.6rem] font-bold uppercase tracking-[0.13em] text-ink-faint">
        <span>Knife-edge</span>
        <span>Median seat</span>
        <span>Fortress</span>
      </div>

      <p className="sr-only">
        A majority of {context.majorityPct.toFixed(1)} points, which is larger than{" "}
        {context.saferThan} of the {context.totalRanked} seats with a published margin.
      </p>
    </section>
  );
}
