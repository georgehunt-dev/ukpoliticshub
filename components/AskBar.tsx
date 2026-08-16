"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/**
 * The ask bar.
 *
 * Answers are assembled only from pages this site already holds, and every
 * answer carries the same citations the underlying page carries. Where we hold
 * nothing on a subject the answer says so rather than reaching for something
 * plausible — a confident wrong answer here would undo the one promise the
 * rest of the site keeps, on the page most people see first.
 *
 * Square, like everything else on this site. The sparkle and the oxblood mark
 * it as different; a rounded box would be the only rounded thing on the page.
 */

type Source = { label: string; href: string };

type State =
  | { status: "idle" }
  | { status: "asking" }
  | { status: "answered"; answer: string; sources: Source[]; covered: boolean }
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
      <div className="mx-auto max-w-6xl px-5 py-3.5">
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
            placeholder="Ask anything — ‘where do the parties stand on the ECHR?’"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2.5 font-body text-[0.88rem] placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="submit"
            disabled={state.status === "asking"}
            className="shrink-0 bg-ink px-5 font-body text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[color:var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {state.status === "asking" ? "Reading…" : "Ask"}
          </button>
        </form>

        {state.status === "idle" ? (
          <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
            {EXAMPLES.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => {
                    setQuestion(example);
                    void ask(example);
                  }}
                  className="border border-rule px-2 py-0.5 text-[0.72rem] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {state.status === "answered" ? (
          <div className="mt-3 border border-rule bg-[color:var(--paper-raised)] p-4">
            <p className="eyebrow flex items-center gap-1.5">
              <Sparkle className="h-3 w-3 text-oxblood" />
              {state.covered ? "From our pages" : "Not covered yet"}
            </p>
            <p className="mt-2 text-[0.92rem] leading-relaxed">{state.answer}</p>

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
                setState({ status: "idle" });
                setQuestion("");
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

        <p className="mt-2 text-[0.68rem] leading-snug text-ink-faint">
          <span className="font-semibold text-ink-soft">AI answers</span>, built only from this
          site&rsquo;s own sourced pages and returned with the citations attached. If we don&rsquo;t
          hold something, it says so rather than guessing.
        </p>
      </div>
    </div>
  );
}
