"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { credit, getPhoto } from "@/lib/photos";
import { openSignupPrompt } from "@/lib/signup-prompt";

/**
 * The morning email, sitting beside the race on the front page.
 *
 * This is the front page's one ask, so it says what arrives rather than
 * asserting that it is good: four lines of contents, then the field.
 *
 * One field here, then the prompt. The address is carried into the prompt,
 * which asks for the constituency and the year of birth — the two things this
 * column has no room for, and the two that decide whether the email can carry
 * local news and whether the reader is old enough to be on the list. Sending
 * straight to /api/subscribe from here skipped both, so the front page was the
 * one place on the site that signed people up without ever asking.
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

export default function MorningEmail() {
  const photo = getPhoto("london");
  const [email, setEmail] = useState("");

  return (
    <aside className="flex flex-col border-t border-rule pt-5 lg:h-full lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
      {photo ? (
        <div className="relative h-28 shrink-0 overflow-hidden bg-ink sm:h-32 lg:h-auto lg:min-h-32 lg:flex-1">
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

      {/* The prompt owns the submit, the consent copy, the honeypot and the
          under-13 check, so there is one path to maintain rather than two. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          openSignupPrompt({ email: email.trim() || undefined, reason: "The morning email" });
        }}
        className="mt-4"
      >
        <div className="flex">
          <label htmlFor="morning-email" className="sr-only">
            Email address
          </label>
          <input
            id="morning-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.co.uk"
            className="min-w-0 flex-1 border border-rule border-r-0 bg-[color:var(--paper-raised)] px-3 py-2.5 font-body text-[0.88rem] placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-oxblood bg-oxblood px-4 py-2.5 font-body text-[0.7rem] font-bold uppercase tracking-[0.13em] text-[color:var(--paper)] transition-opacity hover:opacity-90"
          >
            Sign up
          </button>
        </div>
      </form>

      <p className="mt-2.5 text-[0.68rem] leading-snug text-ink-faint">
        We&rsquo;ll ask for your constituency and year of birth next — both optional, and the year
        only so we know readers are 13 or over. No spam, one click to leave, and we never share
        your address.{" "}
        <Link href="/privacy" className="link-underline">
          How we handle data
        </Link>
        .
      </p>
    </aside>
  );
}
