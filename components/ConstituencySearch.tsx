"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Type-ahead lookup for the 650 seats.
 *
 * Deliberately not a postcode box. A postcode identifies a household, and
 * asking a first-time visitor for one is a bigger ask than this site has yet
 * earned. A constituency name identifies an area of roughly 70,000 people and
 * tells us nothing about the reader — so it is typed, matched locally in the
 * browser, and never sent anywhere.
 */

type Seat = { name: string; slug: string };

/** Fold punctuation and case so "St Ives", "st. ives" and "ST IVES" all match. */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const LIMIT = 8;

export default function ConstituencySearch({ seats }: { seats: Seat[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Precomputed once: 650 short strings, cheap to hold and to scan.
  const index = useMemo(
    () => seats.map((seat) => ({ ...seat, key: normalise(seat.name) })),
    [seats]
  );

  const matches = useMemo(() => {
    const q = normalise(query);
    if (q.length < 2) return [];
    // Seats whose name starts with what was typed come first — someone typing
    // "bath" wants Bath, not Bathgate-adjacent matches buried below it.
    const starts: Seat[] = [];
    const contains: Seat[] = [];
    for (const seat of index) {
      if (seat.key.startsWith(q)) starts.push(seat);
      else if (seat.key.includes(q)) contains.push(seat);
      if (starts.length >= LIMIT) break;
    }
    return [...starts, ...contains].slice(0, LIMIT);
  }, [query, index]);

  const exact = useMemo(() => {
    const q = normalise(query);
    return index.find((seat) => seat.key === q);
  }, [query, index]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      const target = matches[active] ?? exact;
      if (target) {
        event.preventDefault();
        router.push(`/constituencies/${target.slug}`);
      }
    } else if (event.key === "Escape") {
      setQuery("");
    }
  }

  const listId = "constituency-matches";

  return (
    <div className="relative">
      <label
        htmlFor="constituency-search"
        className="block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-soft"
      >
        Find your constituency
      </label>

      <input
        ref={inputRef}
        id="constituency-search"
        type="text"
        role="combobox"
        aria-expanded={matches.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder="Start typing, e.g. Makerfield"
        className="mt-2 w-full border border-rule bg-[color:var(--paper)] px-4 py-3.5 font-body text-base placeholder:text-ink-faint focus:border-ink focus:outline-none sm:text-lg"
      />

      {query.length >= 2 && matches.length === 0 ? (
        <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-soft">
          No seat matches that. Boundaries changed in 2024, so a good few names are new — try
          the town rather than the county, or{" "}
          <Link href="/constituencies/all" className="link-underline font-medium">
            browse all 650
          </Link>
          .
        </p>
      ) : null}

      {matches.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto border border-rule bg-[color:var(--paper-raised)] shadow-[0_18px_44px_-22px_rgba(15,31,56,0.55)]"
        >
          {matches.map((seat, i) => (
            <li key={seat.slug} role="option" aria-selected={i === active}>
              <Link
                href={`/constituencies/${seat.slug}`}
                onMouseEnter={() => setActive(i)}
                className={`block px-4 py-2.5 font-body text-[0.95rem] ${
                  i === active ? "bg-ink text-[color:var(--paper)]" : "text-ink"
                }`}
              >
                {seat.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2.5 text-[0.75rem] leading-snug text-ink-faint">
        Typed here and matched in your browser — nothing is sent to us, and we don&rsquo;t ask
        for your postcode.
      </p>
    </div>
  );
}
