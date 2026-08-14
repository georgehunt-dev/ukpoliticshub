import Link from "next/link";
import PartyEmblem from "@/components/PartyEmblem";
import Portrait from "@/components/Portrait";
import { formatDate } from "@/components/ui";
import { partyBySlug } from "@/data/parties";
import {
  bestPrimeMinister,
  governmentStanding,
  primeMinister,
  primeMinisterRatings,
} from "@/data/government";

export default function PrimeMinisterPanel() {
  const labour = partyBySlug.labour;

  return (
    <section id="prime-minister" className="scroll-mt-24">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* ── The Prime Minister ─────────────────────────────────────────── */}
        <article className="panel flex flex-col">
          <div className="border-b border-rule px-5 py-3 sm:px-7">
            <p className="eyebrow">The Prime Minister</p>
          </div>

          <Link
            href="/parties/labour#leader"
            className="group flex flex-1 flex-col gap-5 px-5 py-6 transition-colors hover:bg-[color:var(--paper-sunk)]/50 sm:flex-row sm:px-7"
          >
            <Portrait
              slug={primeMinister.slug}
              name={primeMinister.name}
              size="xl"
              accent={labour.colour}
              className="self-start"
            />

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-3xl leading-tight group-hover:text-oxblood sm:text-4xl">
                {primeMinister.name}
              </h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-ink-soft">
                {primeMinister.seat}
              </p>
              <p className="mt-1 text-sm text-ink-faint">
                In office since {formatDate(primeMinister.since)}
              </p>

              <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-soft">
                {primeMinister.precis}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-oxblood">
                Full profile
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>

          {/* Approval */}
          <div className="border-t border-rule">
            <div className="px-5 pt-4 sm:px-7">
              <p className="eyebrow">Approval of Burnham as Prime Minister</p>
            </div>
            <div className="grid gap-px bg-[color:var(--rule)] sm:grid-cols-2">
              {primeMinisterRatings.map((rating) => (
                <div key={rating.pollster} className="bg-[color:var(--paper-raised)] px-5 py-4 sm:px-7">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tabular">{rating.approve}%</span>
                    <span className="text-sm text-ink-soft">approve</span>
                  </div>
                  {rating.disapprove != null ? (
                    <p className="mt-1 text-sm text-ink-soft tabular">
                      {rating.disapprove}% disapprove ·{" "}
                      <span className="font-semibold text-ink">
                        net {rating.net != null && rating.net > 0 ? "+" : ""}
                        {rating.net}
                      </span>
                    </p>
                  ) : null}
                  {rating.note ? (
                    <p className="mt-2 text-[0.8rem] leading-snug text-ink-faint">{rating.note}</p>
                  ) : null}
                  <a
                    href={rating.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-2 block text-[0.75rem] text-ink-faint"
                  >
                    {rating.pollster}, {rating.fieldwork}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* ── The government + best PM ───────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <article className="panel flex-1">
            <div className="border-b border-rule px-5 py-3 sm:px-7">
              <p className="eyebrow">The government</p>
            </div>

            <Link
              href="/parties/labour"
              className="group block px-5 py-5 transition-colors hover:bg-[color:var(--paper-sunk)]/50 sm:px-7"
            >
              <div className="flex items-center gap-3">
                <PartyEmblem slug="labour" colour={labour.colour} size={34} />
                <div>
                  <h3 className="font-display text-2xl leading-tight group-hover:text-oxblood">
                    {governmentStanding.label}
                  </h3>
                  <p className="text-sm text-ink-faint">
                    In office since {formatDate(governmentStanding.inOfficeSince)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2 border-t border-rule pt-4">
                <span className="font-display text-4xl font-bold tabular" style={{ color: labour.colour }}>
                  {governmentStanding.voteShare}%
                </span>
                <span className="text-sm text-ink-soft">in the rolling voting-intention average</span>
              </div>

              <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-soft">
                {governmentStanding.assessment}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-oxblood">
                The Labour Party in full
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>

            {/* Kept outside the Link — an anchor cannot legally nest inside one. */}
            <div className="border-t border-rule px-5 py-2.5 sm:px-7">
              <a
                href={governmentStanding.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-[0.75rem] text-ink-faint"
              >
                {governmentStanding.source.label}
              </a>
            </div>
          </article>

          {/* Best PM head-to-head */}
          <article className="panel">
            <div className="border-b border-rule px-5 py-3 sm:px-7">
              <p className="eyebrow">{bestPrimeMinister.question}</p>
            </div>
            <ul className="space-y-3 px-5 py-4 sm:px-7">
              {bestPrimeMinister.options.map((option) => {
                const party = partyBySlug[option.party];
                return (
                  <li key={option.name} className="flex items-center gap-3">
                    <Portrait slug={slugFor(option.name)} name={option.name} size="sm" accent={party.colour} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{option.name}</p>
                      <div className="mt-1 h-[6px] w-full bg-[color:var(--paper-sunk)]">
                        <div
                          className="h-full"
                          style={{
                            width: `${(option.pct / bestPrimeMinister.options[0].pct) * 100}%`,
                            backgroundColor: party.colour,
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-display text-xl font-bold tabular">{option.pct}%</span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-rule px-5 py-2.5 sm:px-7">
              <a
                href={bestPrimeMinister.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-[0.75rem] text-ink-faint"
              >
                {bestPrimeMinister.pollster}, {bestPrimeMinister.fieldwork}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/** The three leaders tested map onto portrait slugs we already hold. */
function slugFor(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
