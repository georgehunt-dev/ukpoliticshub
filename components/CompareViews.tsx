import Link from "next/link";
import Explain from "@/components/Explain";
import PartyEmblem from "@/components/PartyEmblem";
import { NO_POSITION } from "@/data/policy-areas";
import type { IssueView, PairView } from "@/lib/compare";
import type { Policy } from "@/lib/types";

/**
 * Comparison rows.
 *
 * The summary line carries the page — six of those scan in seconds, where six
 * full positions would be a wall. The detail sits behind a <details>, so it
 * works without JavaScript and stays crawlable: search engines read the full
 * text even though a reader sees the short version first.
 */

function Detail({ policy }: { policy: Policy }) {
  return (
    <details className="group mt-2">
      <summary className="cursor-pointer list-none text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-oxblood">
        <span className="group-open:hidden">In full ▾</span>
        <span className="hidden group-open:inline">Less ▴</span>
      </summary>
      <div className="mt-2.5 border-l-2 border-rule pl-3.5">
        <p className="text-[0.92rem] leading-relaxed text-ink-soft">
          <Explain text={policy.position} />
        </p>
        {policy.caveat ? (
          <p className="mt-2 border-l-2 border-oxblood/40 pl-3 text-[0.85rem] leading-relaxed text-ink-soft">
            <Explain text={policy.caveat} />
          </p>
        ) : null}
        {policy.source ? (
          <a
            href={policy.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-2.5 inline-flex items-baseline gap-1.5 text-[0.78rem] font-medium text-ink-soft"
          >
            <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
              Check it
            </span>
            {policy.source.label}
          </a>
        ) : null}
      </div>
    </details>
  );
}

function Missing() {
  return <p className="text-[0.86rem] leading-relaxed text-ink-faint">{NO_POSITION}</p>;
}

/** Every party on one issue, ordered left to right by spectrum placement. */
export function IssueComparison({ view }: { view: IssueView }) {
  return (
    <ol className="mt-8 divide-y divide-[color:var(--rule)] border-y border-rule">
      {view.rows.map(({ party, policy }) => (
        <li
          key={party.slug}
          className={`grid gap-x-6 gap-y-2 py-5 lg:grid-cols-[220px_1fr] ${
            policy ? "" : "bg-[color:var(--paper-sunk)]/35"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 h-full w-1 shrink-0"
              style={{ backgroundColor: party.colour, minHeight: "2.5rem" }}
            />
            <div className="min-w-0">
              <Link
                href={`/parties/${party.slug}`}
                className="font-display text-xl leading-tight transition-colors hover:text-oxblood"
              >
                {party.shortName}
              </Link>
              <p className="mt-0.5 text-[0.75rem] text-ink-faint">
                {party.spectrum > 0 ? "+" : ""}
                {party.spectrum} on our scale
              </p>
            </div>
          </div>

          <div className="min-w-0">
            {policy ? (
              <>
                <p className="font-display text-[1.15rem] leading-snug text-ink">
                  <Explain text={policy.summary} />
                </p>
                <Detail policy={policy} />
              </>
            ) : (
              <Missing />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Two parties down every issue, side by side. */
export function PairComparison({ view }: { view: PairView }) {
  const { left, right, rows } = view;

  return (
    <>
      {/* Column headers, sticky so you never lose which side is which */}
      <div className="sticky top-[52px] z-20 mt-8 grid grid-cols-2 gap-px border-y border-rule bg-[color:var(--rule)] sm:grid-cols-[150px_1fr_1fr]">
        <div className="hidden bg-[color:var(--paper)] px-3 py-2.5 sm:block" />
        {[left, right].map((party) => (
          <div key={party.slug} className="flex items-center gap-2.5 bg-[color:var(--paper)] px-3 py-2.5">
            <PartyEmblem slug={party.slug} colour={party.colour} size={22} className="shrink-0" />
            <Link
              href={`/parties/${party.slug}`}
              className="min-w-0 truncate font-display text-lg leading-tight transition-colors hover:text-oxblood"
            >
              {party.shortName}
            </Link>
          </div>
        ))}
      </div>

      <ol className="divide-y divide-[color:var(--rule)] border-b border-rule">
        {rows.map(({ area, left: l, right: r }) => (
          <li key={area.id} className="py-5">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[150px_1fr_1fr]">
              <div>
                <h3 className="font-display text-lg leading-tight">{area.name}</h3>
                <p className="mt-1 hidden text-[0.75rem] leading-snug text-ink-faint sm:block">
                  {area.question}
                </p>
              </div>

              {[
                { policy: l, party: left },
                { policy: r, party: right },
              ].map(({ policy, party }) => (
                <div
                  key={party.slug}
                  className="min-w-0 border-l-2 pl-3.5"
                  style={{ borderColor: policy ? party.colour : "var(--rule)" }}
                >
                  <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-faint sm:hidden">
                    {party.shortName}
                  </p>
                  {policy ? (
                    <>
                      <p className="font-display text-[1.05rem] leading-snug text-ink">
                        <Explain text={policy.summary} />
                      </p>
                      <Detail policy={policy} />
                    </>
                  ) : (
                    <Missing />
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
