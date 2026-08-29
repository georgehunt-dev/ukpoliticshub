/**
 * The one place the support URL is written down.
 *
 * The ask is put next to the independence claim rather than in a corner on its
 * own, because the two are the same statement: no advertising, nothing sold,
 * and no money from any party is what lets "we will never be financially
 * affiliated with any UK political party" be a promise instead of a
 * preference. A reader who funds the site is the only constituency it has.
 */

export const SUPPORT_URL = "https://buymeacoffee.com/ukpoliticshub";

export default function SupportLink({
  /** "button" for the bordered call to action, "quiet" to sit beside one. */
  variant = "button",
  children = "Buy us a coffee",
  className = "",
}: {
  variant?: "button" | "quiet";
  children?: React.ReactNode;
  className?: string;
}) {
  const base =
    variant === "button"
      ? "inline-block shrink-0 border border-ink px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-[color:var(--paper)]"
      : "link-underline shrink-0 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-oxblood";

  return (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`.trim()}
    >
      {children}
    </a>
  );
}
