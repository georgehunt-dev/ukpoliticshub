/**
 * A Union Flag rendered as a typographic rule — used as a masthead flourish
 * rather than a picture of a flag. Proper Union Flag geometry (2:1, with the
 * counterchanged saltire) compressed into a letterpress ornament.
 */
export default function UnionRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} role="img" aria-label="Union Flag">
      <rect width="60" height="30" fill="#012169" />
      {/* Saltire — white then counterchanged red */}
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0 0 L60 30 M60 0 L0 30"
        stroke="#c8102e"
        strokeWidth="2"
        clipPath="url(#union-half)"
      />
      <clipPath id="union-half">
        <path d="M30 15 L60 15 L60 30 Z M30 15 L30 0 L0 0 Z" />
      </clipPath>
      {/* Cross of St George */}
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
