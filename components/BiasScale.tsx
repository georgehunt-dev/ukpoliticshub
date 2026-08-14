/**
 * The left–right slider shown against every story. The track runs −10 to +10;
 * the marker sits at the outlet's fixed rating. Colour runs from the deep blue
 * of the left-hand end to oxblood at the right so the position reads at a
 * glance without needing the number.
 */
export default function BiasScale({
  value,
  label,
  width = 132,
}: {
  value: number;
  label: string;
  width?: number;
}) {
  const pct = ((value + 10) / 20) * 100;

  return (
    <div className="flex items-center gap-2" title={`${label}: ${describe(value)}`}>
      <div className="relative h-[5px] shrink-0 bg-[color:var(--paper-sunk)]" style={{ width }}>
        {/* centre tick */}
        <span
          className="absolute top-[-3px] h-[11px] w-px bg-[color:var(--rule-strong)]"
          style={{ left: "50%" }}
          aria-hidden="true"
        />
        {/* marker */}
        <span
          className="absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--paper-raised)]"
          style={{ left: `${pct}%`, backgroundColor: markerColour(value) }}
          aria-hidden="true"
        />
      </div>
      <span className="w-[4.5rem] shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">
        {describe(value)}
      </span>
    </div>
  );
}

export function describe(value: number): string {
  if (value <= -7) return "Left";
  if (value <= -3) return "Centre-left";
  if (value < 3) return "Centre";
  if (value < 7) return "Centre-right";
  return "Right";
}

export function markerColour(value: number): string {
  if (value <= -3) return "#1d4f91";
  if (value < 3) return "#6b7689";
  return "#7a1c2b";
}
