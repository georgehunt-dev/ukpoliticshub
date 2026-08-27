"use client";

import { useEffect, useRef, useState } from "react";
import { GLOSSARY_LOOKUP, type GlossaryEntry } from "@/data/glossary";

/**
 * Marks jargon in a run of text and explains it on click.
 *
 * Terms are found automatically rather than hand-marked, so a definition added
 * to data/glossary.ts appears everywhere that phrase is used without anyone
 * editing the copy. Only the first occurrence in a block is marked: a
 * paragraph peppered with icons is worse than the jargon was.
 */

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Source for the pattern, not the pattern itself.
 *
 * A shared global RegExp carries mutable `lastIndex`, so reusing one across
 * renders would let one render's position leak into another's and silently
 * mis-match. Each call builds its own.
 */
const PATTERN_SOURCE = `\\b(${GLOSSARY_LOOKUP.map((g) => escapeRegExp(g.match)).join("|")})\\b`;

function entryFor(matched: string): GlossaryEntry | undefined {
  const lower = matched.toLowerCase();
  return GLOSSARY_LOOKUP.find((g) => g.match.toLowerCase() === lower)?.entry;
}

function Term({ label, entry }: { label: string; entry: GlossaryEntry }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onClick(event: MouseEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <span ref={wrapper} className="relative inline">
      <span className="border-b border-dotted border-ink-faint">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`What does “${entry.term}” mean?`}
        className="ml-0.5 inline-flex h-[0.95em] w-[0.95em] translate-y-[-0.15em] items-center justify-center rounded-full border border-ink-faint/60 align-middle text-[0.62em] font-bold leading-none text-ink-faint transition-colors hover:border-oxblood hover:text-oxblood"
      >
        i
      </button>

      {open ? (
        <span
          role="note"
          className="absolute left-0 top-[calc(100%+0.4em)] z-50 block w-[min(20rem,80vw)] border border-rule bg-[color:var(--paper-raised)] px-3.5 py-3 text-left shadow-[0_10px_30px_-12px_rgba(15,31,56,0.45)]"
        >
          <span className="block font-display text-[0.95rem] font-bold leading-tight text-ink">
            {entry.term}
          </span>
          <span className="mt-1.5 block font-body text-[0.82rem] font-normal leading-relaxed text-ink-soft">
            {entry.definition}
          </span>
        </span>
      ) : null}
    </span>
  );
}

function mark(text: string): React.ReactNode[] {
  const seen = new Set<string>();
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(new RegExp(PATTERN_SOURCE, "gi"))) {
    const entry = entryFor(match[1]);
    const index = match.index ?? 0;
    // One marker per term per block: a paragraph peppered with icons is worse
    // than the jargon was.
    if (!entry || seen.has(entry.term)) continue;
    seen.add(entry.term);

    if (index > cursor) nodes.push(text.slice(cursor, index));
    nodes.push(<Term key={`${entry.term}-${index}`} label={match[1]} entry={entry} />);
    cursor = index + match[1].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export default function Explain({ text }: { text: string }) {
  return <>{mark(text)}</>;
}
