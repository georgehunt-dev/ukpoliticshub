/**
 * The No.10 door, drawn as a line engraving: six panels, fanlight, lion's-head
 * knocker, the iron lamp overhead. Used as the emblem of the poll section.
 */
export default function DoorTen({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 108" className={className} role="img" aria-label="The door of 10 Downing Street">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* Lamp */}
        <path d="M36 4v5" strokeLinecap="round" />
        <path d="M30 9h12l-2.5 7h-7L30 9Z" strokeLinejoin="round" />
        <path d="M24 16c3-6 9-9 12-9s9 3 12 9" strokeLinecap="round" />
        {/* Frame */}
        <rect x="12" y="20" width="48" height="86" />
        <rect x="16" y="24" width="40" height="82" />
        {/* Fanlight */}
        <path d="M20 40h32" />
        <path d="M36 40V26M28 40c0-5 3.5-9 8-9s8 4 8 9M24 40c0-7 5.5-12 12-12s12 5 12 12" />
        {/* Panels */}
        <rect x="22" y="48" width="12" height="16" />
        <rect x="38" y="48" width="12" height="16" />
        <rect x="22" y="82" width="12" height="18" />
        <rect x="38" y="82" width="12" height="18" />
        {/* Knocker and letterbox */}
        <circle cx="36" cy="71" r="3.5" />
        <path d="M28 76h16" strokeLinecap="round" />
      </g>
      {/* The numeral */}
      <text
        x="36"
        y="45"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, serif"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
      >
        10
      </text>
    </svg>
  );
}
