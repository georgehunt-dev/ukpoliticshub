/**
 * ukpoliticshub brand marks.
 *
 * The mark is a ballot cross inside an engraved roundel — the one symbol every
 * British voter recognises, and one nobody owns. Navy ring, oxblood cross, with
 * the saltire of the Union Flag implied in the fine diagonals behind it. It
 * reads at 16px in a browser tab and at 200px on a title card.
 */

export function LogoMark({
  size = 40,
  className = "",
  title = "ukpoliticshub",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Roundel */}
      <circle cx="0" cy="0" r="47" fill="var(--paper-raised, #fbf9f4)" />
      <circle cx="0" cy="0" r="47" fill="none" stroke="#0f1f38" strokeWidth="4" />
      <circle cx="0" cy="0" r="40" fill="none" stroke="#0f1f38" strokeWidth="1.5" opacity="0.55" />

      {/* Implied saltire, kept faint so the cross reads first */}
      <g stroke="#0f1f38" strokeWidth="2" opacity="0.16" strokeLinecap="round">
        <path d="M-27 -27L27 27M27 -27L-27 27" />
      </g>

      {/* The ballot cross */}
      <g stroke="#7a1c2b" strokeWidth="11" strokeLinecap="round">
        <path d="M-19 -19L19 19" />
        <path d="M19 -19L-19 19" />
      </g>
    </svg>
  );
}

/** Full lockup: mark plus wordmark, for the header and footer. */
export function LogoLockup({
  size = 30,
  className = "",
  showDomain = false,
}: {
  size?: number;
  className?: string;
  showDomain?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="flex items-baseline">
        <span className="font-display text-xl font-bold leading-none tracking-tight">
          ukpolitics
        </span>
        <span className="font-display text-xl font-bold leading-none tracking-tight text-oxblood">
          hub
        </span>
        {showDomain ? (
          <span className="ml-0.5 font-body text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            .com
          </span>
        ) : null}
      </span>
    </span>
  );
}
