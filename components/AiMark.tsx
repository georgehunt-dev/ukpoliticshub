/**
 * The briefing mark: a neural graph whose edges trace the Union Flag — the
 * saltire diagonals and the cross of St George — with nodes at every
 * intersection. Union Flag colours (Pantone 280 blue, 186 red).
 */
export default function AiMark({ size = 44, className = "" }: { size?: number; className?: string }) {
  const BLUE = "#012169";
  const RED = "#c8102e";

  const nodes: [number, number, string][] = [
    [32, 32, RED],
    [8, 8, BLUE],
    [56, 8, BLUE],
    [8, 56, BLUE],
    [56, 56, BLUE],
    [32, 6, RED],
    [32, 58, RED],
    [6, 32, RED],
    [58, 32, RED],
  ];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="AI daily briefing"
    >
      <circle cx="32" cy="32" r="30" fill="none" stroke="var(--rule)" strokeWidth="1" />
      <g stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <path d="M8 8L56 56M56 8L8 56" />
      </g>
      <g stroke={RED} strokeWidth="2.4" strokeLinecap="round">
        <path d="M32 6v52M6 32h52" />
      </g>
      {nodes.map(([cx, cy, fill], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={i === 0 ? 5 : 3.4} fill="var(--paper-raised)" />
          <circle
            cx={cx}
            cy={cy}
            r={i === 0 ? 5 : 3.4}
            fill="none"
            stroke={fill}
            strokeWidth={i === 0 ? 2.4 : 1.8}
          />
        </g>
      ))}
    </svg>
  );
}
