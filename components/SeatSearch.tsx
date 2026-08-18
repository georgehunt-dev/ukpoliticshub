"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { PlaceHit } from "@/app/api/place/route";

/**
 * One box for three kinds of answer: a postcode, a place, or a constituency.
 *
 * The rule that shapes it is that British place names repeat — eight
 * Whitchurches, nine Hooks, ten Overtons. So the box never redirects on a
 * guess. A postcode has exactly one answer and goes straight through; a name
 * matching several seats lists them and asks. Getting this wrong would quietly
 * send a reader in Shropshire to a page about Hampshire.
 */

/** Deliberately loose: real validation is postcodes.io saying yes or no. */
const LOOKS_LIKE_POSTCODE = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
/** Enough of a postcode to be worth saying "keep going" rather than "no match". */
const PARTIAL_POSTCODE = /^[a-z]{1,2}\d/i;

/** What the typed text is, worked out during render rather than in an effect. */
type Mode = "idle" | "postcode" | "partial" | "search";

function modeFor(query: string): Mode {
  const trimmed = query.trim();
  if (trimmed.length < 2) return "idle";
  if (LOOKS_LIKE_POSTCODE.test(trimmed)) return "postcode";
  if (PARTIAL_POSTCODE.test(trimmed) && trimmed.length < 5) return "partial";
  return "search";
}

type Async =
  | { kind: "none" }
  | { kind: "busy" }
  | { kind: "hits"; hits: PlaceHit[]; query: string }
  | { kind: "empty"; query: string }
  | { kind: "error"; message: string };

export default function SeatSearch({
  autoFocus = false,
  placeholder = "Postcode, town, or constituency",
}: {
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [async_, setAsync] = useState<Async>({ kind: "none" });
  const router = useRouter();
  const inputId = useId();
  /** Guards against a slow response overwriting a newer one. */
  const seq = useRef(0);

  const mode = modeFor(query);

  useEffect(() => {
    if (modeFor(query) !== "search") return;

    const trimmed = query.trim();
    const ticket = ++seq.current;
    const timer = setTimeout(async () => {
      setAsync({ kind: "busy" });
      try {
        const response = await fetch(`/api/place?q=${encodeURIComponent(trimmed)}`);
        const body = await response.json();
        if (ticket !== seq.current) return;
        const hits = (body.hits ?? []) as PlaceHit[];
        setAsync(
          hits.length ? { kind: "hits", hits, query: trimmed } : { kind: "empty", query: trimmed }
        );
      } catch {
        if (ticket === seq.current) {
          setAsync({ kind: "error", message: "Search is unavailable just now." });
        }
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (LOOKS_LIKE_POSTCODE.test(trimmed)) {
      seq.current += 1;
      setAsync({ kind: "busy" });
      try {
        const postcode = trimmed.replace(/\s+/g, "");
        const response = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
        );
        if (!response.ok) {
          setAsync({ kind: "empty", query: trimmed });
          return;
        }
        const body = await response.json();
        const seat: string | undefined = body?.result?.parliamentary_constituency_2024;
        if (!seat) {
          setAsync({ kind: "empty", query: trimmed });
          return;
        }
        const lookup = await fetch(`/api/place?q=${encodeURIComponent(seat)}`);
        const hits = ((await lookup.json())?.hits ?? []) as PlaceHit[];
        const match = hits.find((hit) => hit.kind === "seat");
        if (match) {
          router.push(`/constituencies/${match.slug}`);
          return;
        }
        setAsync({ kind: "empty", query: trimmed });
      } catch {
        setAsync({ kind: "error", message: "Postcode lookup is unavailable just now." });
      }
      return;
    }

    // A single unambiguous match on Enter is a redirect; anything else is a list.
    if (async_.kind === "hits" && async_.hits.length === 1) {
      router.push(`/constituencies/${async_.hits[0].slug}`);
    }
  }

  const showAsync = mode === "search" || mode === "postcode";

  return (
    <div>
      <form
        onSubmit={submit}
        className="flex border-[1.5px] border-ink bg-[color:var(--paper-raised)]"
      >
        <label htmlFor={inputId} className="sr-only">
          Postcode, town, or constituency
        </label>
        <input
          id={inputId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          type="submit"
          className="shrink-0 bg-ink px-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[color:var(--paper)]"
        >
          Find
        </button>
      </form>

      <div aria-live="polite">
        {mode === "partial" ? (
          <p className="mt-2.5 text-[0.82rem] text-ink-faint">Keep typing the full postcode.</p>
        ) : null}

        {mode === "postcode" && async_.kind === "none" ? (
          <p className="mt-2.5 text-[0.82rem] text-ink-faint">
            Looks like a postcode — press Find.
          </p>
        ) : null}

        {showAsync && async_.kind === "busy" ? (
          <p className="mt-2.5 text-[0.82rem] text-ink-faint">Looking…</p>
        ) : null}

        {showAsync && async_.kind === "error" ? (
          <p className="mt-2.5 text-[0.82rem] text-[color:var(--oxblood)]">{async_.message}</p>
        ) : null}

        {showAsync && async_.kind === "empty" ? (
          <p className="mt-2.5 text-[0.82rem] text-ink-soft">
            Nothing matched <b>{async_.query}</b>. Try a postcode, a nearby town, or the
            constituency name.
          </p>
        ) : null}

        {mode === "search" && async_.kind === "hits" ? <Hits hits={async_.hits} /> : null}
      </div>
    </div>
  );
}

function Hits({ hits }: { hits: PlaceHit[] }) {
  const shared = hits.filter((hit) => hit.shared);
  const sharedName = shared.length > 1 ? shared[0].name : null;

  return (
    <div className="mt-3 border-t border-rule">
      {sharedName ? (
        <p className="py-2.5 text-[0.84rem] text-ink-soft">
          There is more than one <b>{sharedName}</b>. Which did you mean?
        </p>
      ) : null}

      <ul>
        {hits.map((hit) => (
          <li key={`${hit.kind}-${hit.name}-${hit.slug}`}>
            <Link
              href={`/constituencies/${hit.slug}`}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-rule px-1 py-2.5 hover:bg-[color:var(--paper-sunk)]"
            >
              <span className="font-display text-[1.05rem] leading-tight">{hit.name}</span>
              <span className="text-[0.75rem] text-ink-faint">
                {hit.kind === "seat"
                  ? "Constituency"
                  : [hit.type, hit.district].filter(Boolean).join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
