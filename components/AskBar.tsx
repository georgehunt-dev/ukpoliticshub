"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/**
 * The ask bar.
 *
 * Answers are assembled only from pages this site already holds, and every
 * answer carries the same citations the underlying page carries. Where we hold
 * nothing on a subject the answer says so rather than reaching for something
 * plausible: a confident wrong answer here would undo the one promise the
 * rest of the site keeps, on the page most people see first.
 *
 * Square, like everything else on this site. The sparkle and the oxblood mark
 * it as different; a rounded box would be the only rounded thing on the page.
 */

type Source = { label: string; href: string };

type Suggestion = { name: string; href: string };

type State =
  | { status: "idle" }
  | { status: "asking" }
  | {
      status: "answered";
      answer: string;
      sources: Source[];
      covered: boolean;
      suggestions: Suggestion[];
    }
  | { status: "error"; message: string };

const EXAMPLES = [
  "Where do the parties stand on the ECHR?",
  "How many Channel crossings this year?",
  "Who is my MP in Makerfield?",
];

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M11 1.5l2.05 6.45L19.5 10l-6.45 2.05L11 18.5l-2.05-6.45L2.5 10l6.45-2.05z" />
      <path
        d="M18.7 13.6l.86 2.72 2.72.86-2.72.86-.86 2.72-.86-2.72-2.72-.86 2.72-.86z"
        opacity="0.5"
      />
    </svg>
  );
}

export default function AskBar() {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  /** Put the bar back to how it was before anyone asked anything. */
  function dismiss() {
    setState({ status: "idle" });
    setQuestion("");
  }
  const inputRef = useRef<HTMLInputElement>(null);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || state.status === "asking") return;
    setState({ status: "asking" });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.ok) {
        setState({
          status: "answered",
          answer: data.answer,
          sources: data.sources ?? [],
          covered: data.covered !== false,
          suggestions: data.suggestions ?? [],
        });
      } else {
        setState({ status: "error", message: data.error ?? "Something went wrong." });
      }
    } catch {
      setState({
        status: "error",
        message: "Could not reach the server. Check your connection and try again.",
      });
    }
  }

  return (
    <div className="border-t border-rule bg-[color:var(--paper-sunk)]/70">
      <div className="shell py-2.5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void ask(question);
          }}
          className="flex items-stretch border-[1.5px] border-ink bg-[color:var(--paper-raised)]"
        >
          <span className="flex shrink-0 items-center pl-3 pr-2.5 text-oxblood">
            <Sparkle className="h-[18px] w-[18px]" />
          </span>
          <label htmlFor="ask" className="sr-only">
            Ask anything about UK politics
          </label>
          <input
            ref={inputRef}
            id="ask"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && state.status === "answered") dismiss();
            }}
            placeholder="Ask anything: ‘where do the parties stand on the ECHR?’"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2 font-body text-[0.88rem] placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="submit"
            disabled={state.status === "asking"}
            className="shrink-0 bg-ink px-5 font-body text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[color:var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {state.status === "asking" ? "Reading…" : "Ask"}
          </button>
        </form>

        {/* Suggestions and the standing note share one line, so the bar costs
            two rows of height rather than four. It is the first thing on the
            page and should not out-shout the race below it. */}
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-6 gap-y-1.5">
          {state.status === "idle" ? (
            /* On a phone these three questions would stack three deep and cost
               a quarter of the first screen, so they scroll sideways in one
               row instead and wrap normally once there is width for it. */
            <ul className="-mx-1 flex max-w-full gap-x-2 overflow-x-auto px-1 sm:mx-0 sm:flex-wrap sm:gap-y-1.5 sm:overflow-visible sm:px-0">
              {EXAMPLES.map((example) => (
                <li key={example} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setQuestion(example);
                      void ask(example);
                    }}
                    className="whitespace-nowrap border border-rule px-2 py-0.5 text-[0.72rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {state.status === "answered" ? (
          <div className="mt-3 border border-rule bg-[color:var(--paper-raised)] p-4">
            {/* Dismiss sits at the top because that is where the reader is when
                they decide they are done. "Ask something else" at the foot of
                the panel means scrolling past the whole answer to get rid of
                it, which on a phone is the answer covering the site until you
                have scrolled it all. Both stay: this closes, that one closes
                and puts the cursor back in the box. */}
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow flex items-center gap-1.5">
                <Sparkle className="h-3 w-3 text-oxblood" />
                {state.covered ? "From our pages" : "Not covered yet"}
              </p>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close this answer"
                /* 36x36 hit area around a 14px mark. The glyph wants to be
                   small and quiet; the thing you tap does not. */
                className="-mr-2 -mt-2 flex h-9 w-9 shrink-0 items-center justify-center text-ink-faint transition-colors hover:text-ink"
              >
                <svg
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path d="M1.5 1.5l11 11M12.5 1.5l-11 11" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-[0.92rem] leading-relaxed">{state.answer}</p>

            {state.suggestions.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {state.suggestions.map((suggestion) => (
                  <li key={suggestion.href}>
                    <Link
                      href={suggestion.href}
                      className="inline-block border border-rule px-2.5 py-1 text-[0.82rem] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      {suggestion.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* The standing note that used to sit under the bar has moved to
                /how-we-work. The disclosure itself belongs on the answer, not
                on every page of the site whether or not anyone has asked
                anything, so it is stated here, once, where the answer is. */}
            <p className="mt-2.5 text-[0.72rem] leading-snug text-ink-faint">
              Assembled by AI from this site&rsquo;s own sourced pages.{" "}
              <Link href="/how-we-work#ask" className="link-underline">
                How this works
              </Link>
            </p>

            {state.sources.length ? (
              <div className="mt-3 border-t border-rule pt-2.5">
                <p className="eyebrow mb-1.5">Where this comes from</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {state.sources.map((source) => (
                    <li key={source.href}>
                      <Link
                        href={source.href}
                        className="link-underline text-[0.83rem] font-medium text-ink-soft"
                      >
                        {source.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => {
                dismiss();
                inputRef.current?.focus();
              }}
              className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-oxblood"
            >
              Ask something else
            </button>
          </div>
        ) : null}

        {state.status === "error" ? (
          <p role="alert" className="mt-2 text-[0.78rem] leading-snug text-oxblood">
            {state.message}
          </p>
        ) : null}

      </div>
    </div>
  );
}
