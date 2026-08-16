import { Suspense } from "react";
import Link from "next/link";
import ElectionsStrip from "@/components/ElectionsStrip";
import EmailSignup from "@/components/EmailSignup";
import HeroRace from "@/components/HeroRace";
import KeyIndicators from "@/components/KeyIndicators";
import NewsDigest from "@/components/NewsDigest";
import StartHere from "@/components/StartHere";
import { SectionHeading } from "@/components/ui";

/** Rebuilt at most every 10 minutes; the scheduled refresh keeps it warmer
 *  than that. See DEPLOY.md and app/api/revalidate. */
export const revalidate = 600;

/** Real date, not a pinned literal: the election countdowns would otherwise
 *  freeze on the day this was written and drift further every day after. */
const today = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  return (
    <>
      <HeroRace />
      <KeyIndicators today={today()} />
      <StartHere />

      <div className="mx-auto max-w-6xl space-y-14 px-5 py-12">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsDigest />
        </Suspense>

        <GoDeeper />
      </div>

      <ElectionsStrip today={today()} />

      <div className="mx-auto max-w-6xl px-5 py-12">
        <EmailSignup />
      </div>
    </>
  );
}

/**
 * The front page used to stack every section end to end, which came to twenty
 * screens on a phone — no way to judge how deep the page ran, and no way to
 * skip. Each of those sections now has its own page, and this is the index to
 * them: one tap to any of it, and the front page stays short enough to read.
 */
const SECTIONS: { href: string; title: string; blurb: string }[] = [
  {
    href: "/polls",
    title: "The polls themselves",
    blurb:
      "Every poll inside the rolling average, with fieldwork dates and a link to each pollster's own write-up.",
  },
  {
    href: "/immigration",
    title: "Immigration",
    blurb:
      "Channel crossings year-to-date and by year, the asylum backlog, and where each party stands.",
  },
  {
    href: "/threat",
    title: "Threat level",
    blurb:
      "The official terrorism level, unadjusted, and our own six-factor read on Russian pressure.",
  },
  {
    href: "/prime-minister",
    title: "The Prime Minister",
    blurb: "Approval, the best-prime-minister head-to-head, and how the government is standing.",
  },
  {
    href: "/parties",
    title: "The six parties",
    blurb:
      "Policies, leadership, spectrum position, what each can credibly claim and what is fairly held against it.",
  },
  {
    href: "/compare",
    title: "Compare the parties",
    blurb: "Every party answering the same ten questions, in the same order, side by side.",
  },
  {
    href: "/briefing",
    title: "Today's briefing",
    blurb: "About five minutes, both sides of every argument, dated so you know how fresh it is.",
  },
];

function GoDeeper() {
  return (
    <section id="go-deeper" className="scroll-mt-24">
      <SectionHeading
        eyebrow="The rest of it"
        title="Go deeper"
        standfirst="Everything the site holds, one tap away. Each page carries its sources on the same page as its figures."
      />

      <ul className="mt-5 border-y border-rule">
        {SECTIONS.map((section) => (
          <li key={section.href} className="border-b border-rule last:border-b-0">
            <Link
              href={section.href}
              className="group flex items-baseline gap-4 py-4 transition-colors hover:bg-[color:var(--paper-sunk)]/55 sm:py-5"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl leading-tight group-hover:text-oxblood sm:text-2xl">
                  {section.title}
                </span>
                <span className="mt-1 block text-[0.92rem] leading-relaxed text-ink-soft">
                  {section.blurb}
                </span>
              </span>
              <span
                aria-hidden
                className="shrink-0 font-display text-2xl text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-oxblood"
              >
                &rsaquo;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NewsSkeleton() {
  return (
    <section className="panel p-8">
      <p className="eyebrow">The papers</p>
      <p className="mt-2 font-display text-2xl text-ink-faint">Fetching the front pages…</p>
    </section>
  );
}
