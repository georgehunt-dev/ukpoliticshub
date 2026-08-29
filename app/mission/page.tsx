import type { Metadata } from "next";
import Link from "next/link";
import MissionValues from "@/components/MissionValues";
import Reveal from "@/components/Reveal";
import SupportLink from "@/components/SupportLink";
import SectionImage from "@/components/SectionImage";
import { MoreLink } from "@/components/ui";

/**
 * The one page where the site speaks about itself.
 *
 * Everywhere else the house rule is that copy should be reportable rather than
 * persuasive: state the figure, cite it, let the comparison do the arguing.
 * A statement of values cannot work that way, and this is the deliberate
 * exception. It is kept to four values and one sentence for the same reason:
 * a page of manifesto would undercut the restraint the rest of the site is
 * built on.
 *
 * What it must not become is a claim we cannot keep. "Never financially
 * affiliated with any political party" is a promise a reader can hold us to,
 * and it is the same promise made in the footer and on /how-we-work. If any of
 * those three ever change, all three change.
 */

export const metadata: Metadata = {
  title: "Our mission",
  description:
    "Why ukpoliticshub exists: neutrality, palatability, knowledge and democracy, and a commitment never to be financially affiliated with any UK political party.",
  alternates: { canonical: "/mission" },
};

export default function MissionPage() {
  return (
    <div className="shell py-11">
      <SectionImage
        as="h1"
        photo="london"
        title="Our mission"
        titleClassName="text-4xl sm:text-6xl"
        standfirst="Why this site exists, and the four things it will not trade away."
        alt="The London skyline at dusk, looking east along the Thames"
        height="h-52 sm:h-72"
      />

      {/* The mission. Tightened from the original draft, which ran the vote
          and the power it carries through a single clause and lost both. The
          four beats are unchanged: knowledge, the vote, the power, the
          country. */}
      <Reveal>
        <blockquote className="reveal-item mt-10 border-l-[3px] border-gold pl-6 sm:pl-8">
          <p className="max-w-4xl font-display text-[1.7rem] leading-[1.28] sm:text-[2.35rem]">
          Give British people the knowledge to vote with confidence, and through that vote,
            the power to change the nation they love for the better.
          </p>
        </blockquote>
      </Reveal>

      <MissionValues />

      {/* A value is only worth printing if it is checkable. These are the two
          places a reader can go and hold us to it. */}
      <section className="mt-12 border border-rule bg-[color:var(--paper-raised)] p-5 sm:p-7">
        <p className="eyebrow">Holding us to it</p>
        <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-3xl">
          Take none of it on trust
        </h2>
        <p className="measure mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          Every figure on this site carries a link to where it came from, so you can read the
          source rather than take our word for it. Where we publish a judgement of our own rather
          than a sourced fact (a party&rsquo;s place on the spectrum, a masthead&rsquo;s lean, a
          state threat assessment), it is flagged as ours so you can weigh it differently. Where
          someone disputes how we have characterised them, the dispute is printed next to the
          characterisation rather than settled by us.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          <MoreLink href="/how-we-work">How every judgement here is made</MoreLink>
          <MoreLink href="/colophon">Where the images come from</MoreLink>
        </p>
      </section>

      {/* The ask sits here, immediately after the page has finished promising
          independence, because it is the same statement: what pays for the
          site is what determines who it answers to. Kept to the fact, with no
          urgency and no counter. */}
      <Reveal>
        <section className="reveal-item mt-12 border-t-2 border-ink pt-6">
          <p className="eyebrow">Who pays for this</p>
          <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-3xl">
            No ads, no paywall, no party money
          </h2>
          <p className="measure mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            The site carries no advertising, sells nothing and has never taken a penny from a
            party, campaign or candidate. That is what lets the first value above be a promise
            rather than a preference: there is nobody to answer to except the people reading it.
            It stays free either way. If it has been useful, you can put something in the tin.
          </p>
          <p className="mt-5">
            <SupportLink>Buy us a coffee →</SupportLink>
          </p>
        </section>
      </Reveal>

      <p className="mt-10 measure text-[0.86rem] leading-relaxed text-ink-faint">
        ukpoliticshub is not endorsed by, affiliated with, funded by or connected to any political
        party, campaign or candidate. If you think we have fallen short of any of the four above,{" "}
        <Link href="/how-we-work#corrections" className="link-underline font-medium">
          we would rather hear it and fix it
        </Link>{" "}
        than defend it.
      </p>
    </div>
  );
}
