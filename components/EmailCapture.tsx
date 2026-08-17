"use client";

import { useState } from "react";
import { openSignupPrompt } from "@/lib/signup-prompt";

/**
 * A small inline signup that hands off to the full prompt.
 *
 * One field, because a three-field form dropped into the middle of a page is
 * an obstacle rather than an invitation. The address is carried into the
 * prompt, which then asks for the constituency and the year — the two things
 * that make the email worth sending and that there is no room for here.
 *
 * Nothing is sent from this component. The subscribe happens in the prompt,
 * so there is one submit path to maintain and one place where consent, the
 * honeypot and the under-13 check live.
 */
export default function EmailCapture({
  heading,
  blurb,
  reason,
  constituency,
  className = "",
}: {
  heading: string;
  blurb: string;
  /** Shown above the prompt's heading — "Local news for Clacton". */
  reason?: string;
  /** Pre-fills the prompt where the page already knows the seat. */
  constituency?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");

  return (
    <section
      className={`border-t-2 border-oxblood bg-[color:var(--paper-raised)] px-5 py-5 ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">One email each morning</p>
          <h2 className="mt-1 font-display text-xl leading-tight sm:text-2xl">{heading}</h2>
          <p className="measure mt-1.5 text-[0.86rem] leading-relaxed text-ink-soft">{blurb}</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            openSignupPrompt({ email: email.trim() || undefined, reason, constituency });
          }}
          className="flex w-full min-w-[16rem] max-w-md flex-1 shrink-0"
        >
          <label htmlFor={`capture-${reason ?? "general"}`} className="sr-only">
            Email address
          </label>
          <input
            id={`capture-${reason ?? "general"}`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.co.uk"
            autoComplete="email"
            className="min-w-0 flex-1 border border-r-0 border-rule bg-[color:var(--paper)] px-3 py-2.5 font-body text-[0.88rem] placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-oxblood bg-oxblood px-4 py-2.5 font-body text-[0.7rem] font-bold uppercase tracking-[0.13em] text-[color:var(--paper)] transition-opacity hover:opacity-90"
          >
            Sign up
          </button>
        </form>
      </div>

      <p className="mt-2.5 text-[0.68rem] leading-snug text-ink-faint">
        We&rsquo;ll ask for your constituency and year of birth next — both optional, and the year
        only so we know readers are 13 or over.
      </p>
    </section>
  );
}
