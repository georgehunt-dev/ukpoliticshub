/**
 * A masthead's name, drawn in our own type.
 *
 * Deliberately not the outlet's logo. Every one of those is a registered
 * trademark, and this site already refuses to reproduce party logos for the
 * same reason: the party emblems are original drawings in a house style, and
 * these are the same idea for the press.
 *
 * The face varies by what the outlet is, not by imitating its wordmark: a
 * serif for the broadsheets and weeklies, a heavy condensed sans for the
 * tabloids, a plain sans for the broadcasters. Enough to give each page its own
 * character without borrowing anyone's identity.
 */

type Face = "broadsheet" | "tabloid" | "broadcast";

const FACES: Record<string, Face> = {
  guardian: "broadsheet",
  telegraph: "broadsheet",
  times: "broadsheet",
  ft: "broadsheet",
  independent: "broadsheet",
  spectator: "broadsheet",
  mail: "tabloid",
  sun: "tabloid",
  express: "tabloid",
  mirror: "tabloid",
  bbc: "broadcast",
  sky: "broadcast",
  channel4: "broadcast",
  gbnews: "broadcast",
  novara: "broadcast",
};

const STYLES: Record<Face, string> = {
  broadsheet: "font-display tracking-[-0.02em]",
  tabloid: "font-display font-bold uppercase tracking-[0.01em]",
  broadcast: "font-body font-bold tracking-[-0.01em]",
};

export default function MastheadPlate({
  id,
  name,
  size = "lg",
}: {
  id: string;
  name: string;
  size?: "sm" | "lg";
}) {
  const face = FACES[id] ?? "broadsheet";
  const dimension = size === "lg" ? "px-5 py-3.5 text-3xl sm:text-4xl" : "px-3 py-1.5 text-lg";

  return (
    <span
      className={`inline-block border-[1.5px] border-ink bg-[color:var(--paper-raised)] leading-none text-ink ${dimension} ${STYLES[face]}`}
    >
      {name}
    </span>
  );
}
