"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AiMark from "@/components/AiMark";
import { briefing } from "@/data/briefing";

/**
 * The landing page's AI slot, kept deliberately small: one line of input that
 * opens the full briefing. Everything long lives at /briefing.
 */
export default function AskBox() {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const q = question.trim();
    router.push(q ? `/briefing?q=${encodeURIComponent(q)}` : "/briefing");
  }

  return (
    <section id="ask" className="scroll-mt-24">
      <div className="panel px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-center gap-4">
          <AiMark size={44} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Daily briefing</p>
            <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
              Ask anything about British politics
            </h2>
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="ask-input" className="sr-only">
            Your question about UK politics
          </label>
          <input
            id="ask-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Who is leading the polls, and by how much?"
            className="min-w-0 flex-1 border border-rule bg-[color:var(--paper)] px-4 py-3 font-body text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-ink bg-ink px-6 py-3 font-body text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[color:var(--paper)] transition-opacity hover:opacity-90"
          >
            Get the briefing
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[0.78rem] text-ink-faint">Or try:</span>
          {briefing.followUps.slice(0, 3).map((item) => (
            <button
              key={item.question}
              type="button"
              onClick={() => router.push(`/briefing?q=${encodeURIComponent(item.question)}`)}
              className="border border-rule bg-[color:var(--paper)] px-3 py-1.5 text-left text-[0.78rem] transition-colors hover:border-oxblood hover:text-oxblood"
            >
              {item.question}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
