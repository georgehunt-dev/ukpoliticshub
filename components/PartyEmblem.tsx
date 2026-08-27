import type { PartySlug } from "@/lib/types";

/**
 * Engraved party crests, drawn for this site.
 *
 * These are NOT the parties' official logos. Those are registered trademarks
 * and, for five of the six parties, non-free copyrighted artwork. Each crest
 * instead uses a generic symbol long associated with the party (rose, oak,
 * bird of liberty, leaf, shield, ascending rule), rendered in one consistent
 * house style: a double-ruled roundel with fine hatching, in the party's own
 * colour, in the manner of a Victorian engraving.
 */

const MOTIF: Record<PartySlug, React.ReactNode> = {
  // Rose in full bloom
  labour: (
    <g>
      <circle cx="0" cy="0" r="5.5" strokeWidth="1.6" />
      <circle cx="0" cy="0" r="2" strokeWidth="1.2" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <path
          key={deg}
          d="M0 -5.5C5 -11 12 -10.5 14 -4c-3.5 3.5-10 3-14 1.5Z"
          strokeWidth="1.5"
          strokeLinejoin="round"
          transform={`rotate(${deg})`}
        />
      ))}
      {[36, 108, 180, 252, 324].map((deg) => (
        <path
          key={deg}
          d="M0 -6c3-4.5 8-5 10-1.5"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.75"
          transform={`rotate(${deg})`}
        />
      ))}
    </g>
  ),
  // Oak in leaf
  conservative: (
    <g>
      <path d="M0 17V2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M0 8l-6-5M0 4l6-5M0 12l-5-4" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M0 -17c6.5 0 11 4.5 11 10.5S6.5 3 0 3s-11-4.5-11-9.5S-6.5 -17 0 -17Z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M-9 -10c-3.5 1.5-5 5-3.5 8.5M9 -10c3.5 1.5 5 5 3.5 8.5" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M-6 -9c2 2.5 4 4 6 4.5M6 -9c-2 2.5-4 4-6 4.5" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
    </g>
  ),
  // Ascending rule
  reform: (
    <g>
      <path d="M-14 8l7-7 6 6 12-12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 -5h7v7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-14 15h28" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <circle cx="-14" cy="8" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  // Bird of liberty
  "liberal-democrats": (
    <g>
      <path d="M-16 0c6-9 15-12 22-7.5" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M6 -7.5c5 1.5 8.5 5.5 10 10.5-7 2.5-13.5 1-17.5-3"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M-10 -2c3 6.5 9.5 10.5 17.5 9.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M-6 3c2.5 4 6.5 6.5 11 7" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <circle cx="9" cy="-5" r="1.3" fill="currentColor" stroke="none" />
    </g>
  ),
  // Leaf
  green: (
    <g>
      <path
        d="M14 -14C-3 -14-14 -5-14 7c0 4.5 1.5 8 4 10.5C3 19 17 9 17 -5c0-3.5-1-6.5-3-9Z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 -11C3 -4-4 5-9 17" strokeWidth="1.4" strokeLinecap="round" />
      {[
        "M8 -8c-1 3-1 6 0 8.5",
        "M2 -3c-1.5 3-2 6-1.5 8.5",
        "M-4 3c-1.5 2.5-2 5-2 7",
      ].map((d) => (
        <path key={d} d={d} strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      ))}
    </g>
  ),
  // Shield
  "restore-britain": (
    <g>
      <path
        d="M0 -16l14 5v11c0 9-6 15.5-14 19-8-3.5-14-10-14-19v-11l14-5Z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M0 -9v20" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M-8.5 -1.5h17" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M0 -12.5l9.5 3.5v7.5c0 6-4 10.5-9.5 13" strokeWidth="0.9" opacity="0.5" strokeLinejoin="round" />
    </g>
  ),
};

export default function PartyEmblem({
  slug,
  colour,
  size = 40,
  className = "",
}: {
  slug: PartySlug;
  colour: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="-32 -32 64 64"
      width={size}
      height={size}
      className={className}
      style={{ color: colour }}
      fill="none"
      stroke="currentColor"
      role="img"
      aria-label={`${slug} crest`}
    >
      {/* Double-ruled roundel, as on an engraved seal */}
      <circle cx="0" cy="0" r="29.5" strokeWidth="1.4" opacity="0.85" />
      <circle cx="0" cy="0" r="26.5" strokeWidth="0.7" opacity="0.5" />
      {MOTIF[slug]}
    </svg>
  );
}
