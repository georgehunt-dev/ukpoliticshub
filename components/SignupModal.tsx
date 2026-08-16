"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import constituencyData from "@/data/generated/constituencies.json";

/**
 * First-visit newsletter prompt.
 *
 * Shown once. Subscribing or dismissing records the answer in localStorage and
 * it never appears again — a popup that reappears every visit is the single
 * fastest way to make a site feel cheap.
 *
 * Deliberately restrained: it waits five seconds so the reader has landed and
 * started reading before anything interrupts, never covers a page they arrived at from search within the first
 * seconds, and is dismissible by Escape, backdrop click and an explicit "No
 * thanks". Google demotes intrusive interstitials on mobile, so on small
 * screens it sits as a sheet at the bottom rather than covering the article.
 */

const STORAGE_KEY = "ukph-signup-prompt";
const DELAY_MS = 5_000;

const CONSTITUENCIES: string[] = constituencyData.constituencies;

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "done" }
  | { status: "error"; message: string };

export default function SignupModal() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [constituency, setConstituency] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<State>({ status: "idle" });

  const startedAt = useRef(0);
  const dialog = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  // Decide whether to show, once, after a pause.
  useEffect(() => {
    let answered = false;
    try {
      answered = Boolean(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      // Storage blocked: treat as answered rather than nag on every page.
      answered = true;
    }
    if (answered) return;

    const timer = window.setTimeout(() => {
      startedAt.current = Date.now();
      previouslyFocused.current = document.activeElement;
      setVisible(true);
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  function remember(answer: "subscribed" | "dismissed") {
    try {
      window.localStorage.setItem(STORAGE_KEY, answer);
    } catch {
      // Nothing to do — it simply may ask again next time.
    }
  }

  function close(answer: "subscribed" | "dismissed") {
    remember(answer);
    setVisible(false);
    (previouslyFocused.current as HTMLElement | null)?.focus?.();
  }

  // Escape to close, and keep focus inside while open.
  useEffect(() => {
    if (!visible) return;
    firstField.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close("dismissed");
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialog.current?.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // close is stable enough for this dialog's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state.status === "sending") return;
    setState({ status: "sending" });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          startedAt: startedAt.current || undefined,
          constituency: constituency || undefined,
          birthYear: birthYear || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        remember("subscribed");
        setState({ status: "done" });
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

  if (!visible) return null;

  const field =
    "w-full border border-rule bg-[color:var(--paper)] px-3 py-2.5 font-body text-sm " +
    "placeholder:text-ink-faint focus:border-ink focus:outline-none";
  const label = "block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft";

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={() => close("dismissed")}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
      />

      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-heading"
        className="relative w-full max-w-md border border-rule bg-[color:var(--paper-raised)] shadow-[0_20px_60px_-20px_rgba(15,31,56,0.6)] sm:w-[min(28rem,92vw)]"
      >
        {state.status === "done" ? (
          <div className="px-6 py-8 text-center">
            <LogoMark size={38} className="mx-auto" />
            <h2 id="signup-heading" className="mt-4 font-display text-2xl leading-tight">
              Check your inbox
            </h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
              We&rsquo;ve sent a confirmation link. Click it and you&rsquo;re on the list — one email
              a day, and one click to leave whenever you want.
            </p>
            <button
              type="button"
              onClick={() => close("subscribed")}
              className="mt-6 w-full border border-ink bg-ink px-5 py-2.5 font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[color:var(--paper)]"
            >
              Back to the site
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="px-6 py-7">
            <LogoMark size={34} className="mx-auto" />

            <h2
              id="signup-heading"
              className="mt-4 text-center font-display text-2xl leading-tight sm:text-[1.75rem]"
            >
              Know where Britain stands
            </h2>
            <p className="mt-1.5 text-center text-[0.88rem] leading-relaxed text-ink-soft">
              One email each morning: the polls, the threat picture and the day&rsquo;s stories from
              both sides.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="modal-email" className={label}>
                  Email address<span className="text-oxblood">*</span>
                </label>
                <input
                  ref={firstField}
                  id="modal-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.co.uk"
                  className={`mt-1.5 ${field}`}
                />
              </div>

              <div>
                <label htmlFor="modal-constituency" className={label}>
                  Your constituency
                </label>
                <input
                  id="modal-constituency"
                  list="constituency-list"
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  placeholder="Start typing, e.g. Makerfield"
                  autoComplete="off"
                  className={`mt-1.5 ${field}`}
                />
                <datalist id="constituency-list">
                  {CONSTITUENCIES.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                <p className="mt-1 text-[0.72rem] leading-snug text-ink-faint">
                  Optional. We&rsquo;ll use it to send you local news when that launches.
                </p>
              </div>

              <div>
                <label htmlFor="modal-year" className={label}>
                  Year of birth
                </label>
                <input
                  id="modal-year"
                  type="number"
                  inputMode="numeric"
                  min={new Date().getFullYear() - 120}
                  max={new Date().getFullYear()}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="1994"
                  className={`mt-1.5 ${field}`}
                />
                <p className="mt-1 text-[0.72rem] leading-snug text-ink-faint">
                  Optional, and the year is all we ask — enough to know readers are 13 or over,
                  without holding your full date of birth.
                </p>
              </div>

              {/* Hidden from people, tempting to bots. */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <label htmlFor="modal-company">Company</label>
                <input
                  id="modal-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            {state.status === "error" ? (
              <p role="alert" className="mt-3 text-[0.82rem] leading-relaxed text-oxblood">
                {state.message}
              </p>
            ) : null}

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => close("dismissed")}
                className="border border-rule px-5 py-2.5 font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                No thanks
              </button>
              <button
                type="submit"
                disabled={state.status === "sending"}
                className="border border-ink bg-ink px-5 py-2.5 font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[color:var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {state.status === "sending" ? "Adding…" : "Sign up"}
              </button>
            </div>

            <p className="mt-4 text-center text-[0.72rem] leading-relaxed text-ink-faint">
              We never share your address.{" "}
              <Link href="/privacy" className="link-underline" onClick={() => close("dismissed")}>
                How we handle data
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
