import Image from "next/image";
import { getPortrait, initials } from "@/lib/portraits";

type Size = "sm" | "md" | "lg" | "xl";

const DIMENSIONS: Record<Size, { px: number; className: string; text: string }> = {
  sm: { px: 48, className: "h-12 w-12", text: "text-sm" },
  md: { px: 72, className: "h-[72px] w-[72px]", text: "text-base" },
  lg: { px: 112, className: "h-28 w-28", text: "text-xl" },
  xl: { px: 176, className: "h-44 w-44", text: "text-3xl" },
};

/**
 * A leader or frontbencher's photograph from Wikimedia Commons, or a
 * typographic monogram where no freely licensed portrait exists. Squared off
 * with a hairline rule: passport-plate rather than avatar-bubble.
 */
export default function Portrait({
  slug,
  name,
  size = "md",
  accent,
  className = "",
}: {
  slug: string;
  name: string;
  size?: Size;
  /** Party colour, drawn as a rule beneath the plate. */
  accent?: string;
  className?: string;
}) {
  const portrait = getPortrait(slug);
  const dim = DIMENSIONS[size];

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-paper-sunk ${dim.className} ${className}`}
      style={accent ? { boxShadow: `inset 0 -3px 0 0 ${accent}` } : undefined}
    >
      {portrait ? (
        <Image
          src={portrait.file}
          alt={`${name}, portrait`}
          width={dim.px}
          height={dim.px}
          className="h-full w-full object-cover object-top"
          sizes={`${dim.px}px`}
        />
      ) : (
        /* An engraved monogram plate, not a failed image. Some figures (a new
           party's spokesperson, say) have no freely licensed photograph, and
           we will not use an unlicensed one. This should look like a decision. */
        <div
          className="relative flex h-full w-full items-center justify-center"
          style={{
            background:
              "repeating-linear-gradient(135deg, var(--paper-sunk) 0 6px, var(--paper-raised) 6px 12px)",
          }}
          title={`No freely licensed photograph of ${name} is available`}
        >
          <span
            className="absolute inset-[3px] border"
            style={{ borderColor: accent ?? "var(--rule-strong)", opacity: 0.55 }}
            aria-hidden="true"
          />
          <span
            className={`relative font-display font-bold tracking-tight ${dim.text}`}
            style={{ color: accent ?? "var(--ink-soft)" }}
          >
            {initials(name)}
          </span>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[color:var(--rule)]" />
    </div>
  );
}
