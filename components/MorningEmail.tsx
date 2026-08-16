"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { credit, getPhoto } from "@/lib/photos";

/**
 * The morning email, sitting beside the race on the front page.
 *
 * This is the front page's one ask, so it says what arrives rather than
 * asserting that it is good: four lines of contents, then the field. The
 * address goes to /api/subscribe, which forwards it to whichever provider is
 * configured and stores nothing here. Until one is configured the endpoint
 * refuses and the form says so — taking an address and quietly dropping it
 * would be worse than declining it.
 */

const INCLUDED: { title: string; detail: string }[] = [
  {
    title: "The same story from both sides",
    detail: "The day's topics as the left and the right each reported them, so you can see the gap.",
  },
  {
    title: "Channel crossings and the backlog",
    detail: "Straight from Home Office figures, never adjusted by us.",
  },
  {
    title: "Russia pressure and the threat level",
    detail: "The official terrorism level, and our own six-factor read alongside it.",
  },
  {
    title: "Local news for your seat",
    detail: "Tailored to your constituency. Coming soon.",
  },
];

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "done" }
  | { status: "error"; message: string };

export default function MorningEmail() {
  const photo = getPhoto("london");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<State>({ status: "idle" });

  // Set after mount: Date.now() during render is impure.
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
    <aside className="flex flex-col border-t border-rule pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
      {photo ? (
        <div className="relative h-28 overflow-hidden bg-ink sm:h-32">
          <Image
            src={photo.file}
            alt="The London skyline at dusk, looking east along the Thames"
            fill
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          <span
            className="absolute right-1.5 top-1.5 text-[0.55rem] text-[color:var(--paper)]/70"
            style={{ textShadow: "0 1px 4px rgba(8,16,30,0.9)" }}
          >
            {credit(photo)}
          </span>
        </div>
      ) : null}

      <p className="eyebrow mt-4">One email each morning</p>
      <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-[1.7rem]">
        Know where Britain stands before your first coffee.
      </h2>

      <ul className="mt-4">
        {INCLUDED.map((item) => (
          <li key={item.title} className="border-t border-rule py-2.5">
            <p className="text-[0.85rem] font-semibold leading-snug">{item.title}</p>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-ink-soft">{item.detail}</p>
          </li>
        ))}
      </ul>

      {state.status === "done" ? (
        <div className="mt-4 border border-rule bg-[color:var(--paper-raised)] p-4">
          <p className="font-display text-lg leading-tight">Check your inbox</p>
          <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">
            We&rsquo;ve sent a confirmation link. Click it and you&rsquo;re on the list.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-4">
          <div className="flex">
            <label htmlFor="morning-email" className="sr-only">
              Email address
            </label>
            <input
              id="morning-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.co.uk"
              className="min-w-0 flex-1 border border-rule border-r-0 bg-[color:var(--paper-raised)] px-3 py-2.5 font-body text-[0.88rem] placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
            <button
              type="submit"
              disabled={state.status === "sending"}
              className="shrink-0 border border-oxblood bg-oxblood px-4 py-2.5 font-body text-[0.7rem] font-bold uppercase tracking-[0.13em] text-[color:var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              {state.status === "sending" ? "Adding…" : "Sign up"}
            </button>
          </div>

          {/* Hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
            <label htmlFor="morning-company">Company</label>
            <input
              id="morning-company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </div>

          {state.status === "error" ? (
            <p role="alert" className="mt-2 text-[0.78rem] leading-snug text-oxblood">
              {state.message}
            </p>
          ) : null}
        </form>
      )}

      <p className="mt-2.5 text-[0.68rem] leading-snug text-ink-faint">
        No spam, one click to leave, and we never share your address.{" "}
        <Link href="/privacy" className="link-underline">
          How we handle data
        </Link>
        .
      </p>
    </aside>
  );
}
