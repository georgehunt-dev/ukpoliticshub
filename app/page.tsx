import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import ConstituencyBand from "@/components/ConstituencyBand";
import ElectionsStrip from "@/components/ElectionsStrip";
import HeroRace from "@/components/HeroRace";
import MorningEmail from "@/components/MorningEmail";
import KeyIndicators from "@/components/KeyIndicators";
import FrontPageNews from "@/components/FrontPageNews";
import StartHere from "@/components/StartHere";
import { SectionHeading } from "@/components/ui";
import { getPhoto, type PhotoSlug } from "@/lib/photos";

/** Rebuilt at most every 10 minutes; the scheduled refresh keeps it warmer
 *  than that. See DEPLOY.md and app/api/revalidate. */
export const revalidate = 600;

/** Real date, not a pinned literal: the election countdowns would otherwise
 *  freeze on the day this was written and drift further every day after. */
const today = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  return (
    <>
      {/* What the site is, said once, before anything else. It spans both
          columns because it is a claim about the whole page: the polls on the
          left and the morning email on the right are two examples of it, not
          the subject of it. The room for it comes from the race panel, which
          gave up three stacked lines above its title to pay for this. */}
      <div className="shell pt-4">
        <h1 className="max-w-4xl font-display text-[1.9rem] leading-[1.06] tracking-tight text-balance sm:text-[2.5rem]">
          British politics in one place, from both sides.
        </h1>
      </div>

      {/* The front page's lead: the race on the left, the morning email on
          the right. On a phone the email lands directly under the race, which
          is the natural next beat rather than a footer afterthought.

          Tight top padding on purpose: the line above is this block's own
          heading, so the usual gap would read as a gap between two unrelated
          things — and the sign-up button sits within a few pixels of the fold
          on a small laptop, which is the one thing here worth protecting. */}
      <div className="shell pb-6 pt-3">
        <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr] lg:items-stretch lg:gap-8">
          <HeroRace />
          <MorningEmail />
        </div>
      </div>

      <KeyIndicators today={today()} />
      <StartHere />
      <ConstituencyBand />

      <div className="shell space-y-14 py-12">
        <Suspense fallback={<NewsSkeleton />}>
          <FrontPageNews />
        </Suspense>

        <GoDeeper />
      </div>

      <ElectionsStrip today={today()} />
    </>
  );
}

/**
 * The front page used to stack every section end to end, which came to twenty
 * screens on a phone — no way to judge how deep the page ran, and no way to
 * skip. Each of those sections now has its own page, and this is the index to
 * them: one tap to any of it, and the front page stays short enough to read.
 */
const SECTIONS: {
  href: string;
  title: string;
  blurb: string;
  photo: PhotoSlug;
  alt: string;
}[] = [
  {
    href: "/polls",
    title: "The polls themselves",
    blurb:
      "Every poll inside the rolling average, with fieldwork dates and a link to each pollster's own write-up.",
    photo: "polling-station",
    alt: "A polling station sign outside a British polling place",
  },
  {
    href: "/immigration",
    title: "Immigration",
    blurb:
      "Channel crossings year-to-date and by year, the asylum backlog, and where each party stands.",
    photo: "dover",
    alt: "The White Cliffs of Dover and South Foreland Lighthouse, seen from the sea",
  },
  {
    href: "/threat",
    title: "Threats & alliances",
    blurb:
      "The official terrorism level, unadjusted, plus our own weighted read on Russia, Iran and China — and on what the UK can rely on from the US, NATO and Europe.",
    photo: "royal-navy",
    alt: "HMS Kent, a Royal Navy Type 23 frigate, under way",
  },
  {
    href: "/prime-minister",
    title: "The Prime Minister",
    blurb: "Approval, the best-prime-minister head-to-head, and how the government is standing.",
    photo: "downing-street",
    alt: "The front door of 10 Downing Street",
  },
  {
    href: "/parties",
    title: "The six parties",
    blurb:
      "Policies, leadership, spectrum position, what each can credibly claim and what is fairly held against it.",
    photo: "buckingham-palace",
    alt: "The eastern façade of Buckingham Palace",
  },
  {
    href: "/compare",
    title: "Compare the parties",
    blurb: "Every party answering the same ten questions, in the same order, side by side.",
    photo: "westminster",
    alt: "The Palace of Westminster seen across the Thames from the South Bank",
  },
  {
    href: "/constituencies",
    title: "Your constituency",
    blurb:
      "All 650 seats: your MP, the full 2024 result with every candidate, turnout and the margin.",
    photo: "england",
    alt: "Cottages and a bridge in a village in the Cotswolds",
  },
  {
    href: "/briefing",
    title: "Today's briefing",
    blurb: "About five minutes, both sides of every argument, dated so you know how fresh it is.",
    photo: "london",
    alt: "A panorama of the London skyline",
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
        {SECTIONS.map((section) => {
          const photo = getPhoto(section.photo);
          return (
            <li key={section.href} className="border-b border-rule last:border-b-0">
              <Link
                href={section.href}
                className="group flex items-center gap-4 py-4 transition-colors hover:bg-[color:var(--paper-sunk)]/55 sm:gap-6 sm:py-5"
              >
                {photo ? (
                  <span className="relative h-20 w-20 shrink-0 overflow-hidden bg-ink sm:h-24 sm:w-36 lg:h-28 lg:w-48">
                    <Image
                      src={photo.file}
                      alt={section.alt}
                      fill
                      sizes="(max-width: 640px) 80px, (max-width: 1024px) 144px, 192px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      style={{
                        objectPosition: photo.position,
                        // Matches SectionImage: these are overcast British
                        // exteriors and read muddy without a small lift.
                        filter: "brightness(1.18) contrast(0.97) saturate(1.06)",
                      }}
                    />
                  </span>
                ) : null}

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl leading-tight group-hover:text-oxblood sm:text-2xl">
                    {section.title}
                  </span>
                  <span className="mt-1 block max-w-2xl text-[0.92rem] leading-relaxed text-ink-soft">
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
          );
        })}
      </ul>
    </section>
  );
}

function NewsSkeleton() {
  return (
    <section className="rule-gold pt-4">
      <p className="eyebrow">The papers</p>
      <p className="mt-2 font-display text-3xl text-ink-faint">Reading the front pages…</p>
    </section>
  );
}
