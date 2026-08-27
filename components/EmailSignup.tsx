"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import UnionRule from "@/components/UnionRule";

/**
 * Newsletter signup.
 *
 * The address is posted to /api/subscribe, which forwards it to whichever
 * mailing provider is configured and stores nothing on this site. Until a
 * provider is configured the endpoint returns 503 and the form says so:
 * accepting an address and quietly dropping it would be worse than refusing.
 */

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "done" }
  | { status: "error"; message: string };

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<State>({ status: "idle" });
  // Set after mount, not during render: calling Date.now() in a render is
  // impure and the lint rule is right to object.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state.status === "sending") return;
    setState({ status: "sending" });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, startedAt: startedAt.current || undefined }),
      });
      const data = await res.json();
      if (data.ok) {
        setState({ status: "done" });
        setEmail("");
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
    <section className="panel">
      <div className="grid items-center gap-6 px-5 py-7 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <UnionRule className="h-5 w-10 shrink-0" />
            <p className="eyebrow">The daily despatch</p>
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            One email. Both sides. Every morning.
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
            The polls, the threat picture and the day&rsquo;s stories from left and right, sourced,
            dated and short enough to read before your coffee goes cold.
          </p>
        </div>

        <div>
          {state.status === "done" ? (
            <div className="border border-rule bg-[color:var(--paper-sunk)]/60 px-4 py-4">
              <p className="font-display text-xl leading-tight">You&rsquo;re on the list.</p>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft">
                One email a day, and one click to leave whenever you want.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.co.uk"
                  aria-invalid={state.status === "error"}
                  aria-describedby="email-note"
                  className="min-w-0 flex-1 border border-rule bg-[color:var(--paper)] px-3.5 py-2.5 font-body text-sm placeholder:text-ink-faint focus:border-ink focus:outline-none"
                />

                {/* Hidden from people, tempting to bots. */}
                <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.status === "sending"}
                  className="shrink-0 border border-ink bg-ink px-5 py-2.5 font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[color:var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                >
                  {state.status === "sending" ? "Adding…" : "Subscribe"}
                </button>
              </div>

              {state.status === "error" ? (
                <p role="alert" className="mt-2 text-[0.82rem] leading-relaxed text-oxblood">
                  {state.message}
                </p>
              ) : null}

              <p id="email-note" className="mt-2 text-[0.75rem] leading-relaxed text-ink-faint">
                One email a day. We never share your address, and every issue carries a one-click
                unsubscribe.{" "}
                <Link href="/privacy" className="link-underline">
                  How we handle data
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
