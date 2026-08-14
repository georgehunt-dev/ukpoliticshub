"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { briefing } from "@/data/briefing";

/**
 * The interactive part of the briefing page: the answer to whatever was
 * asked, plus follow-ups.
 *
 * Answers are written in advance from this site's own data — there is no model
 * running behind this yet, and the page says so rather than implying one. The
 * matcher below scores the question against the prepared set and is honest
 * when nothing fits.
 */

function scoreMatch(question: string, candidate: string): number {
  const stop = new Set([
    "the", "a", "an", "is", "are", "of", "in", "on", "to", "and", "for", "what", "who",
    "how", "why", "when", "does", "do", "it", "that", "this", "with", "at", "by", "be",
  ]);
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));
  if (!words.length) return 0;
  const target = candidate.toLowerCase();
  const hits = words.filter((w) => target.includes(w)).length;
  return hits / words.length;
}

export default function BriefingBody({ question }: { question?: string }) {
  const router = useRouter();
  const [followUp, setFollowUp] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const best = question
    ? briefing.followUps
        .map((item, index) => ({
          index,
          item,
          score: Math.max(scoreMatch(question, item.question), scoreMatch(question, item.answer)),
        }))
        .sort((a, b) => b.score - a.score)[0]
    : undefined;

  const matched = best && best.score >= 0.34 ? best : undefined;

  return (
    <div className="space-y-10">
      {/* The answer, when one was asked for */}
      {question ? (
        <section className="panel">
          <div className="border-b border-rule px-5 py-3 sm:px-7">
            <p className="eyebrow">You asked</p>
            <p className="mt-1 font-display text-xl leading-snug sm:text-2xl">{question}</p>
          </div>
          <div className="px-5 py-5 sm:px-7">
            {matched ? (
              <>
                <p className="text-[1rem] leading-relaxed text-ink-soft">{matched.item.answer}</p>
                <p className="mt-4 border-t border-rule pt-3 text-[0.8rem] text-ink-faint">
                  Closest prepared answer to your question. Everything in it is drawn from figures
                  published elsewhere on this site.
                </p>
              </>
            ) : (
              <>
                <p className="text-[1rem] leading-relaxed text-ink-soft">
                  We don&rsquo;t have a prepared answer to that one yet. Rather than guess, here is
                  today&rsquo;s full briefing below — and the questions we have answered are listed
                  underneath it.
                </p>
                <p className="mt-4 border-t border-rule pt-3 text-[0.8rem] text-ink-faint">
                  Free-text answers need a language model wired up, which is not live yet. When it
                  is, it will answer only from this site&rsquo;s sourced data.
                </p>
              </>
            )}
          </div>
        </section>
      ) : null}

      {/* Follow-ups */}
      <section>
        <p className="eyebrow">
          {question ? "Other questions we've answered" : "Start with one of these"}
        </p>
        <ul className="mt-3 space-y-2">
          {briefing.followUps.map((item, index) => {
            const isOpen = open === index || matched?.index === index;
            return (
              <li key={item.question} className="border border-rule bg-[color:var(--paper-raised)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--paper-sunk)]/60"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1 shrink-0 text-oxblood transition-transform ${isOpen ? "rotate-90" : ""}`}
                  >
                    ›
                  </span>
                  <span className="font-display text-[1.05rem] leading-snug">{item.question}</span>
                </button>
                {isOpen ? (
                  <p className="border-t border-rule px-4 py-3.5 text-[0.92rem] leading-relaxed text-ink-soft">
                    {item.answer}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Ask another */}
      <section className="panel px-5 py-5 sm:px-7">
        <p className="eyebrow">Ask another question</p>
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const q = followUp.trim();
            if (q) router.push(`/briefing?q=${encodeURIComponent(q)}`);
          }}
        >
          <label htmlFor="follow-up" className="sr-only">
            Another question
          </label>
          <input
            id="follow-up"
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="What would you like to know?"
            className="min-w-0 flex-1 border border-rule bg-[color:var(--paper)] px-4 py-2.5 font-body text-[0.95rem] placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-ink bg-ink px-5 py-2.5 font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[color:var(--paper)] transition-opacity hover:opacity-90"
          >
            Ask
          </button>
        </form>
      </section>
    </div>
  );
}
