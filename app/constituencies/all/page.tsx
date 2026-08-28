import type { Metadata } from "next";
import SeatLetterNav from "@/components/SeatLetterNav";
import SeatList from "@/components/SeatList";
import { MoreLink, SectionHeading } from "@/components/ui";
import { CONSTITUENCIES, CONSTITUENCY_SOURCE, type Constituency } from "@/lib/constituencies";

export const metadata: Metadata = {
  title: "All 650 constituencies",
  description:
    "Every UK parliamentary constituency, grouped by nation, with the sitting MP and their party.",
};

const NATIONS: Constituency["nation"][] = ["England", "Scotland", "Wales", "Northern Ireland"];

export default function AllConstituenciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7 sm:py-10">
      <SectionHeading
        eyebrow="Your area"
        title="All 650 constituencies"
        standfirst="Every Westminster seat and its sitting MP, grouped by nation and listed alphabetically."
        action={<MoreLink href="/constituencies">Search instead</MoreLink>}
      />

      {/* Jumping to W on this page otherwise means scrolling past five hundred
          seats. Each letter is also its own page, which is what gives a
          crawler a route to a seat that is not through 650 links at once. */}
      <SeatLetterNav />

      {NATIONS.map((nation) => {
        const seats = CONSTITUENCIES.filter((seat) => seat.nation === nation);
        return (
          <section
            key={nation}
            id={nation.toLowerCase().replace(/\s+/g, "-")}
            className="mt-9 scroll-mt-40"
          >
            <h2 className="border-b-2 border-ink pb-1.5 font-display text-2xl leading-none">
              {nation}
              <span className="ml-2 font-body text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                {seats.length} seats
              </span>
            </h2>
            <SeatList seats={seats} />
          </section>
        );
      })}

      <footer className="mt-10 border-t border-rule pt-4">
        <p className="eyebrow mb-2">Source</p>
        <p className="text-[0.86rem] leading-relaxed text-ink-soft">
          Constituencies and sitting members from the{" "}
          <a
            href={CONSTITUENCY_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium"
          >
            {CONSTITUENCY_SOURCE.label}
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
