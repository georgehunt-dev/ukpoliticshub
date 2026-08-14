import { outletById } from "@/data/news";

/**
 * Outlet identifiers, set typographically.
 *
 * These are NOT the broadcasters' and newspapers' logos. Those are registered
 * trademarks and, in nearly every case, non-free artwork — the same problem as
 * the party logos. Each masthead instead gets its name set in the site's own
 * display face on a bar in a colour associated with it, which identifies the
 * source at a glance without reproducing anyone's mark.
 */

/** Colours associated with each masthead, for identification only. */
const OUTLET_COLOUR: Record<string, string> = {
  bbc: "#1c1c1c",
  guardian: "#052962",
  telegraph: "#0a1a2f",
  times: "#1c1c1c",
  ft: "#0d7680",
  sun: "#d0021b",
  mirror: "#c1001f",
  mail: "#004db3",
  express: "#00579c",
  gbnews: "#12284c",
  sky: "#c8102e",
  independent: "#1c1c1c",
  channel4: "#1e7a6f",
  novara: "#b2182b",
  spectator: "#0d3b2e",
};

export function outletColour(id: string): string {
  return OUTLET_COLOUR[id] ?? "#3b4a63";
}

export default function OutletMark({
  id,
  size = "md",
  className = "",
}: {
  id: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const outlet = outletById[id];
  const name = outlet?.name ?? id;
  const colour = outletColour(id);

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      title={name}
    >
      <span
        aria-hidden="true"
        className={`block shrink-0 ${size === "sm" ? "h-3.5 w-[3px]" : "h-4 w-[4px]"}`}
        style={{ backgroundColor: colour }}
      />
      <span
        className={`font-display font-bold leading-none tracking-tight ${
          size === "sm" ? "text-[0.82rem]" : "text-[0.95rem]"
        }`}
        style={{ color: colour }}
      >
        {name}
      </span>
    </span>
  );
}
