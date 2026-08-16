import type { Metadata } from "next";
import Link from "next/link";
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

      {NATIONS.map((nation) => {
        const seats = CONSTITUENCIES.filter((seat) => seat.nation === nation);
        return (
          <section key={nation} className="mt-9">
            <h2 className="border-b-2 border-ink pb-1.5 font-display text-2xl leading-none">
              {nation}
              <span className="ml-2 font-body text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                {seats.length} seats
              </span>
            </h2>
            <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
              {seats.map((seat) => (
                <li key={seat.slug} className="border-b border-rule/70">
                  <Link
                    href={`/constituencies/${seat.slug}`}
                    className="flex items-baseline justify-between gap-3 py-2 transition-colors hover:bg-ink/[0.03]"
                  >
                    <span className="min-w-0 truncate text-[0.92rem]">{seat.name}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[0.72rem] text-ink-faint">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 border border-ink/20"
                        style={{ background: seat.mp?.partyColour ?? "transparent" }}
                      />
                      {seat.mp?.party ?? "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
