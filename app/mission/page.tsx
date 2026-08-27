import type { Metadata } from "next";
import Link from "next/link";
import SectionImage from "@/components/SectionImage";
import { MoreLink } from "@/components/ui";

/**
 * The one page where the site speaks about itself.
 *
 * Everywhere else the house rule is that copy should be reportable rather than
 * persuasive — state the figure, cite it, let the comparison do the arguing.
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
    "Why ukpoliticshub exists: neutrality, palatability, knowledge and democracy — and a commitment never to be financially affiliated with any UK political party.",
  alternates: { canonical: "/mission" },
};

const VALUES: { name: string; note: string; body: string }[] = [
  {
    name: "Neutrality",
    note: "People first",
    body: "We will never — ever — be financially affiliated with any UK political party.",
  },
  {
    name: "Palatability",
    note: "Everything in one place",
    body: "We obsess over ensuring the British public have everything they need, all in one place.",
  },
  {
    name: "Knowledge",
    note: "Naming the bias",
    body: "Addressing the division from the left and the right, we wish to educate all on media bias.",
  },
  {
    name: "Democracy",
    note: "The power of a vote",
    body: "We aspire to empower the British public to enact positive change via their vote.",
  },
];

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
      <blockquote className="mt-10 border-l-[3px] border-gold pl-6 sm:pl-8">
        <p className="max-w-4xl font-display text-[1.7rem] leading-[1.28] sm:text-[2.35rem]">
          Give British people the knowledge to vote with confidence — and through that vote,
          the power to change the nation they love for the better.
        </p>
      </blockquote>

      <section className="mt-14">
        <p className="eyebrow">What we hold to</p>
        <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">Four values</h2>

        <ol className="mt-7 border-t-2 border-ink">
          {VALUES.map((value, index) => (
            <li
              key={value.name}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-7"
            >
              <span className="font-display text-2xl leading-none text-ink-faint tabular sm:text-3xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                  <h3 className="font-display text-2xl leading-none sm:text-3xl">{value.name}</h3>
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-oxblood">
                    {value.note}
                  </span>
                </div>
                <p className="measure mt-2.5 text-[1rem] leading-relaxed text-ink-soft">
                  {value.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

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
          than a sourced fact — a party&rsquo;s place on the spectrum, a masthead&rsquo;s lean, a
          state threat assessment — it is flagged as ours so you can weigh it differently. Where
          someone disputes how we have characterised them, the dispute is printed next to the
          characterisation rather than settled by us.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          <MoreLink href="/how-we-work">How every judgement here is made</MoreLink>
          <MoreLink href="/colophon">Where the images come from</MoreLink>
        </p>
      </section>

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
