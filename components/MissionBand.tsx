import Link from "next/link";
import Reveal from "@/components/Reveal";
import SupportLink from "@/components/SupportLink";

/**
 * The first thing a reader meets after the opening screen.
 *
 * Placed above the indicator tiles on purpose: a site whose whole pitch is
 * even-handedness should say what it stands for before it starts handing over
 * numbers, not three screens later. It sits below the fold, so it costs the
 * opening screen nothing.
 *
 * Kept to one line and four words. The page itself carries the argument; this
 * is a door, and a door that argues is a wall.
 */

const VALUES = ["Neutrality", "Palatability", "Knowledge", "Democracy"];

export default function MissionBand() {
  return (
    <section aria-label="Our mission" className="border-y border-rule bg-[color:var(--paper-raised)]">
      <Reveal className="shell flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-5">
        <div className="reveal-item min-w-0">
          <p className="eyebrow">Our mission</p>
          <p className="measure mt-1.5 font-display text-[1.15rem] leading-snug sm:text-[1.4rem]">
            Give British people the knowledge to vote with confidence, and the power to change
            the nation they love for the better.
          </p>
        </div>

        <div className="reveal-item flex flex-wrap items-center gap-x-6 gap-y-2">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {VALUES.map((value) => (
              <li
                key={value}
                className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint"
              >
                {value}
              </li>
            ))}
          </ul>

          <Link
            href="/mission"
            className="shrink-0 border border-ink px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-[color:var(--paper)]"
          >
            What we stand for →
          </Link>

          <SupportLink variant="quiet">Buy us a coffee</SupportLink>
        </div>
      </Reveal>
    </section>
  );
}
