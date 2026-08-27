import type { Metadata } from "next";
import Link from "next/link";
import SeatSearch from "@/components/SeatSearch";
import SectionImage from "@/components/SectionImage";
import { MoreLink, SectionHeading } from "@/components/ui";
import { CONSTITUENCIES, CONSTITUENCY_SOURCE } from "@/lib/constituencies";
import { PLACE_COUNT, PLACE_SOURCE } from "@/lib/places";

export const metadata: Metadata = {
  title: "Find your MP and your constituency",
  description:
    "Enter a postcode or your town to find your MP, the full 2024 general election result, turnout and how safe the seat is. All 650 UK constituencies, sourced from Parliament's own records.",
};

const fmt = new Intl.NumberFormat("en-GB");

const NATION_ORDER = ["England", "Scotland", "Wales", "Northern Ireland"] as const;

const NATION_COUNTS = NATION_ORDER.map((name) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  count: CONSTITUENCIES.filter((seat) => seat.nation === name).length,
}));

/** The closest and the widest seats in the country: a way in for browsers. */
const withMargin = CONSTITUENCIES.filter((c) => c.election?.majorityPct != null);
const closest = [...withMargin]
  .sort((a, b) => a.election!.majorityPct! - b.election!.majorityPct!)
  .slice(0, 6);
const safest = [...withMargin]
  .sort((a, b) => b.election!.majorityPct! - a.election!.majorityPct!)
  .slice(0, 6);

function SeatList({ seats, note }: { seats: typeof closest; note: string }) {
  return (
    <ol className="mt-3 space-y-px">
      {seats.map((seat) => (
        <li key={seat.slug}>
          <Link
            href={`/constituencies/${seat.slug}`}
            className="flex items-baseline justify-between gap-3 border-b border-rule/70 py-2 transition-colors hover:bg-ink/[0.03]"
          >
            <span className="min-w-0">
              <span className="font-medium">{seat.name}</span>
              <span className="block text-[0.78rem] text-ink-faint">
                {seat.mp?.party ?? "—"}
              </span>
            </span>
            <span className="shrink-0 font-body text-[0.86rem] tabular-nums text-ink-soft">
              {seat.election!.majorityPct!.toFixed(1)} pts
            </span>
          </Link>
        </li>
      ))}
      <li className="pt-2 text-[0.75rem] leading-snug text-ink-faint">{note}</li>
    </ol>
  );
}

export default function ConstituenciesPage() {
  return (
    <div>
      <SectionImage
        as="h1"
        photo="polling-station"
        eyebrow="Your area"
        title="Your constituency"
        standfirst="All 650 seats: who your MP is, how they won, and how safely."
        alt="A polling station sign outside a British village hall on election day."
      />

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7 sm:py-10">
        <div className="border border-rule bg-[color:var(--paper-raised)] p-5 sm:p-6">
          <h2 className="font-display text-2xl leading-tight sm:text-3xl">Find your seat</h2>
          <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">
            Enter a postcode, the town you live in, or the name of a constituency.
          </p>
          <div className="mt-4">
            <SeatSearch autoFocus />
          </div>
          <p className="mt-3 text-[0.78rem] leading-snug text-ink-faint">
            {fmt.format(PLACE_COUNT)} towns, villages and suburbs mapped to the 2024 boundaries.
          </p>
        </div>

        {/* Browsing by nation: a way in for anyone who does not have a specific
            seat in mind, and it puts every seat within two clicks of here. */}
        <section className="mt-8">
          <p className="eyebrow">Or browse by nation</p>
          <ul className="mt-3 grid grid-cols-2 gap-px bg-[color:var(--rule)] sm:grid-cols-4">
            {NATION_COUNTS.map((nation) => (
              <li key={nation.name}>
                <Link
                  href={`/constituencies/all#${nation.slug}`}
                  className="block bg-[color:var(--paper)] p-3.5 transition-colors hover:bg-[color:var(--paper-sunk)]"
                >
                  <span className="block font-display text-2xl leading-none">
                    {fmt.format(nation.count)}
                  </span>
                  <span className="mt-1 block text-[0.78rem] text-ink-soft">{nation.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-soft">
          Boundaries were redrawn for the 2024 general election, so a seat may not be called
          what it was in 2019: around two-thirds of constituencies changed shape, and many
          changed name with them. A postcode is the surest way in.
        </p>

        <section className="mt-10">
          <SectionHeading
            eyebrow="Where it was close"
            title="The narrowest seats"
            standfirst="Margins from the 2024 general election, as a share of votes cast in that seat."
          />
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Closest results</p>
              <SeatList
                seats={closest}
                note="Won by the smallest share-of-vote margins in the country."
              />
            </div>
            <div>
              <p className="eyebrow">Widest margins</p>
              <SeatList seats={safest} note="The most one-sided results of the 2024 election." />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-rule pt-6">
          <p className="eyebrow">Browse</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
            Rather scroll than type? Every seat is listed alphabetically, grouped by nation.
          </p>
          <p className="mt-3">
            <MoreLink href="/constituencies/all">
              All {fmt.format(CONSTITUENCIES.length)} constituencies
            </MoreLink>
          </p>
        </section>

        <footer className="mt-10 border-t border-rule pt-4">
          <p className="eyebrow mb-2">Source</p>
          <p className="text-[0.86rem] leading-relaxed text-ink-soft">
            Sitting members and full 2024 general election results come from the{" "}
            <a
              href={CONSTITUENCY_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium"
            >
              {CONSTITUENCY_SOURCE.label}
            </a>
            . Vote shares and margins are worked out from those published vote counts. Postcodes
            and place names are matched to the 2024 boundaries using{" "}
            <a
              href={PLACE_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium"
            >
              {PLACE_SOURCE.label}
            </a>
            . There is no reliable seat-by-seat polling in this country, so nothing on these
            pages is a projection of what would happen now.
          </p>
        </footer>
      </div>
    </div>
  );
}
