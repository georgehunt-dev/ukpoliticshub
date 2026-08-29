import type { PolicyArea } from "@/lib/types";

/**
 * One line drawing per policy area.
 *
 * Drawn here rather than imported from an icon set, for the same reason the
 * party emblems and the mission values are: a set brings its own line weight
 * and corner radius, and this site has neither to spare. Same 48 grid, same
 * 1.6 stroke, same single oxblood accent picking out the part that carries
 * the meaning.
 *
 * They label a row, they do not illustrate an argument. A boat for
 * immigration or a scale for crime would be taking a side about what the
 * subject is; a passport and a pair of scales are what the argument is
 * conducted with.
 */

const PATHS: Record<PolicyArea, React.ReactNode> = {
  /* A passport, opened. */
  immigration: (
    <>
      <path d="M8 6h26a4 4 0 014 4v28a4 4 0 01-4 4H8z" />
      <path d="M14 6v36" />
      <circle cx="26" cy="19" r="5" />
      <path d="M21 31h10" stroke="var(--oxblood)" />
    </>
  ),
  /* A coin stack and the line above it. */
  economy: (
    <>
      <ellipse cx="16" cy="31" rx="8" ry="3" />
      <path d="M8 31v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      <path d="M30 40V22M38 40V14" />
      <path d="M28 26l6-8 6-5" stroke="var(--oxblood)" />
    </>
  ),
  /* A pulse crossing a cross. */
  health: (
    <>
      <path d="M19 8h10v11h11v10H29v11H19V29H8V19h11z" />
      <path d="M4 24h6l3-5 4 10 3-5h4" stroke="var(--oxblood)" fill="none" />
    </>
  ),
  /* A roof over a door. */
  housing: (
    <>
      <path d="M6 22L24 8l18 14" />
      <path d="M11 26v14h26V26" />
      <path d="M20 40V29h8v11" stroke="var(--oxblood)" />
    </>
  ),
  /* Bars. The scales would have been the obvious drawing and are already the
     Neutrality mark on /mission, and one drawing cannot mean two things. */
  crime: (
    <>
      <rect x="8" y="10" width="32" height="28" />
      <path d="M16 10v28M24 10v28M32 10v28" />
      <path d="M8 24h32" stroke="var(--oxblood)" />
    </>
  ),
  /* A pylon with a leaf at its foot. */
  energy: (
    <>
      <path d="M17 42L22 8h4l5 34" />
      <path d="M14 24h20M16 16h16" />
      <path d="M36 42c0-5 3-8 8-8 0 5-3 8-8 8z" stroke="var(--oxblood)" />
    </>
  ),
  /* An open book. */
  education: (
    <>
      <path d="M24 14v26" />
      <path d="M24 14c-4-3-9-4-16-4v26c7 0 12 1 16 4" />
      <path d="M24 14c4-3 9-4 16-4v26c-7 0-12 1-16 4" />
      <path d="M10 18h8M30 18h8" stroke="var(--oxblood)" />
    </>
  ),
  /* A shield with a single horizontal division. Two tries got discarded here:
     a cross inside the shield read as first aid, and the heraldic quartering
     that replaced it drew a red cross on a shield, which is St George and a
     tone this site does not take. A fess carries no flag. */
  defence: (
    <>
      <path d="M24 6l16 6v12c0 10-7 16-16 20-9-4-16-10-16-20V12z" />
      <path d="M9 21h30" stroke="var(--oxblood)" />
    </>
  ),
  /* A portico: the courts and constitutions half of the question. The ring of
     stars was tried first and drew as a crosshair at small sizes. */
  europe: (
    <>
      <path d="M6 18L24 8l18 10" />
      <path d="M10 18v18M18 18v18M30 18v18M38 18v18" />
      <path d="M6 40h36" />
      <path d="M18 13h12" stroke="var(--oxblood)" />
    </>
  ),
  /* A broadcast mast. */
  culture: (
    <>
      <path d="M24 20v22M17 42h14" />
      <path d="M15 20a12 12 0 019-15 12 12 0 019 15" />
      <circle cx="24" cy="16" r="3" fill="var(--oxblood)" stroke="none" />
    </>
  ),
};

export default function PolicyIcon({
  area,
  className = "h-5 w-5",
}: {
  area: PolicyArea;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      aria-hidden="true"
    >
      {PATHS[area]}
    </svg>
  );
}
