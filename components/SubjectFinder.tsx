"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Find a person, party or issue.
 *
 * Same shape as the constituency lookup, deliberately — a reader who has used
 * one should recognise the other. Everything is matched in the browser; the
 * list is a few dozen short strings.
 */

export type FinderSubject = { slug: string; name: string; role: string; count: number };

function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function SubjectFinder({ subjects }: { subjects: FinderSubject[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const index = useMemo(
    () => subjects.map((s) => ({ ...s, key: fold(`${s.name} ${s.role}`) })),
    [subjects]
  );

  const matches = useMemo(() => {
    const q = fold(query);
    if (q.length < 2) return [];
    const starts = index.filter((s) => s.key.startsWith(q));
    const contains = index.filter((s) => !s.key.startsWith(q) && s.key.includes(q));
    return [...starts, ...contains].slice(0, 8);
  }, [query, index]);

  return (
    <div className="relative">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const target = matches[active];
          if (target) router.push(`/news/${target.slug}`);
        }}
        className="flex items-stretch border-[1.5px] border-ink bg-[color:var(--paper-raised)]"
      >
        <label htmlFor="subject-find" className="sr-only">
          Find a person, party or issue
        </label>
        <input
          id="subject-find"
          type="text"
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls="subject-matches"
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((i) => Math.min(i + 1, matches.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (event.key === "Escape") {
              setQuery("");
            }
          }}
          placeholder="A person, a party or an issue — try Nigel Farage"
          className="min-w-0 flex-1 bg-transparent px-3.5 py-3 font-body text-[0.92rem] placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 bg-ink px-5 font-body text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--paper)]"
        >
          Find
        </button>
      </form>

      {matches.length > 0 ? (
        <ul
          id="subject-matches"
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto border border-rule bg-[color:var(--paper-raised)] shadow-[0_18px_44px_-22px_rgba(15,31,56,0.55)]"
        >
          {matches.map((subject, i) => (
            <li key={subject.slug} role="option" aria-selected={i === active}>
              <Link
                href={`/news/${subject.slug}`}
                onMouseEnter={() => setActive(i)}
                className={`flex items-baseline justify-between gap-3 px-3.5 py-2.5 ${
                  i === active ? "bg-ink text-[color:var(--paper)]" : "text-ink"
                }`}
              >
                <span className="font-body text-[0.92rem]">{subject.name}</span>
                <span className="shrink-0 text-[0.7rem] opacity-70">
                  {subject.role} · {subject.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
