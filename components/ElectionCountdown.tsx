"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The live clock inside the by-election band.
 *
 * Only the digits are a client component: the surrounding band is rendered on
 * the server, so the wards, the candidate counts and the links are all in the
 * HTML a crawler sees. This part is here purely because it has to tick.
 *
 * It renders a dash until it has mounted. A server-rendered "6 days" would be
 * wrong the moment the page was cached, and a hydration mismatch on the front
 * page is a worse trade than a few hundred milliseconds of blank digits.
 */

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remaining(target: number, now: number): Remaining | null {
  const ms = target - now;
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export default function ElectionCountdown({
  closesAt,
  href,
}: {
  /** ISO timestamp of the close of poll. */
  closesAt: string;
  href: string;
}) {
  const target = new Date(closesAt).getTime();
  const [left, setLeft] = useState<Remaining | null | "pending">("pending");

  useEffect(() => {
    const tick = () => setLeft(remaining(target, Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (left === null) {
    return (
      <p className="font-display text-2xl leading-tight text-[color:var(--paper)]">
        Polls have closed.{" "}
        <Link href={href} className="underline underline-offset-4">
          Counting under way
        </Link>
      </p>
    );
  }

  const units: { label: string; value: number | null }[] = [
    { label: "Days", value: left === "pending" ? null : left.days },
    { label: "Hours", value: left === "pending" ? null : left.hours },
    { label: "Minutes", value: left === "pending" ? null : left.minutes },
    { label: "Seconds", value: left === "pending" ? null : left.seconds },
  ];

  return (
    /* The digits and their caption share one bordered plate, so the block reads
       as a single object aligned with the ward list rather than as numbers with
       a stray line under them. */
    <div className="inline-block border border-[color:var(--paper)]/30">
      <ul
        className="flex items-end justify-between gap-4 px-5 pb-3 pt-4 sm:gap-5"
        aria-label="Time until polls close"
        /* The digits change every second; announcing that would make the page
           unusable with a screen reader. The caption below carries the same
           information without ticking. */
        aria-hidden="true"
      >
        {units.map((unit) => (
          <li key={unit.label} className="text-center">
            <span className="block min-w-[2.4ch] font-display text-[2.4rem] font-bold leading-none tabular text-[color:var(--paper)] sm:text-[2.9rem]">
              {unit.value == null ? "—" : String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-[0.56rem] font-bold uppercase tracking-[0.16em] text-[color:var(--paper)]/60">
              {unit.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-[color:var(--paper)]/25 px-5 py-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[color:var(--paper)]/70">
        Until polls close at 10pm
      </p>
    </div>
  );
}
