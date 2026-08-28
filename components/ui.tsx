import Link from "next/link";
import type { Source } from "@/lib/types";

/** Section heading: small-caps eyebrow over a display-face title, on a gold rule. */
export function SectionHeading({
  eyebrow,
  title,
  standfirst,
  action,
  /**
   * Defaults to h2, because most of these introduce a section inside a page.
   * Where the heading *is* the page title, pass "h1": eleven pages were
   * shipping without one, which on a site whose growth plan is search is a
   * real cost rather than a nicety.
   */
  as: Heading = "h2",
}: {
  /** Omitted where the title alone should carry the section. */
  eyebrow?: string;
  title: string;
  standfirst?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <header className="rule-gold pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <Heading className={`text-3xl leading-tight sm:text-4xl ${eyebrow ? "mt-1" : ""}`}>
            {title}
          </Heading>
        </div>
        {action}
      </div>
      {standfirst ? (
        <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-ink-soft">{standfirst}</p>
      ) : null}
    </header>
  );
}

/** An inline citation. Every number on this site carries one. */
export function Cite({ source, prefix = "Source" }: { source: Source; prefix?: string }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline inline-flex items-baseline gap-1.5 text-[0.82rem] font-medium text-ink-soft"
    >
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
        {prefix}
      </span>
      {source.label}
      {source.date ? ` (${formatDate(source.date)})` : ""}
    </a>
  );
}

export function SourceList({ sources, label = "Sources" }: { sources: Source[]; label?: string }) {
  return (
    <div className="mt-4 border-t border-rule pt-3">
      <p className="eyebrow mb-2">{label}</p>
      <ul className="space-y-1.5">
        {sources.map((source) => (
          <li key={source.url} className="text-[0.86rem] leading-snug">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium text-ink-soft"
            >
              {source.label}
            </a>
            {source.date ? <span className="text-ink-faint"> · {formatDate(source.date)}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Editorial-assessment flag. Used wherever we publish our own judgement. */
export function OurAssessment({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-oxblood/40 bg-oxblood/[0.06] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-oxblood ${className}`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      Our assessment
    </span>
  );
}

export function OfficialFigure({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-ink/25 bg-ink/[0.05] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink ${className}`}
    >
      Official figure
    </span>
  );
}

export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 font-body text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-oxblood"
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

/**
 * Both of these take a calendar date, "YYYY-MM-DD", and every caller passes
 * one: the few that hold a full timestamp slice it down first.
 *
 * `timeZone: "UTC"` pins the output to that calendar date.
 * `new Date("2026-08-27")` is parsed as midnight UTC, so formatting it in
 * whatever zone the code happens to run in renders the day before anywhere
 * west of Greenwich: the 27 August poll average printed as "26 August 2026"
 * on a machine in New York.
 *
 * Today that only bites in local development, because every caller is a
 * server component and the deployment runs UTC. It is pinned anyway. The
 * moment one of these callers gains "use client" the date starts changing
 * with who is reading it, and a wrong date on a sourced figure is the kind
 * of fault this site cannot absorb. Do not remove it as redundant.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
