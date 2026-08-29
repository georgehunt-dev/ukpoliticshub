import Link from "next/link";
import Explain from "@/components/Explain";
import PartyEmblem from "@/components/PartyEmblem";
import PolicyIcon from "@/components/PolicyIcon";
import Portrait from "@/components/Portrait";
import { pollAverage } from "@/data/polls";
import { NO_POSITION } from "@/data/policy-areas";
import type { IssueView, PairView } from "@/lib/compare";
import type { Policy } from "@/lib/types";

/**
 * Comparison rows.
 *
 * The summary line carries the page: six of those scan in seconds, where six
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

/** Each party's share in the current rolling average, for the standings column. */
const POLL = Object.fromEntries(pollAverage.map((entry) => [entry.party, entry.pct]));
const POLL_LEAD = Math.max(...pollAverage.map((entry) => entry.pct));

/**
 * Who leads the party, and where it is standing.
 *
 * The page used to carry the policy alone, which answered "what does this
 * party say" but not "and who is this, and does anyone back them". The bar is
 * scaled to the leader rather than to 100, because the comparison being drawn
 * here is between these six and not against an absolute.
 */
function PartyCell({ party }: { party: IssueView["rows"][number]["party"] }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Portrait
        slug={party.leader.slug}
        name={party.leader.name}
        size="sm"
        accent={party.colour}
      />
      <div className="min-w-0">
        <Link
          href={`/parties/${party.slug}`}
          className="block truncate font-display text-[1.05rem] leading-tight transition-colors hover:text-oxblood"
        >
          {party.shortName}
        </Link>
        <p className="truncate text-[0.72rem] text-ink-faint">{party.leader.name}</p>
      </div>
    </div>
  );
}

function PollCell({ party }: { party: IssueView["rows"][number]["party"] }) {
  const pct = POLL[party.slug];
  if (pct == null) return null;
  return (
    <div>
      <p className="font-display text-[1.05rem] leading-none tabular">
        {pct.toFixed(1)}
        <span className="text-[0.66rem] text-ink-faint">%</span>
      </p>
      <span aria-hidden="true" className="mt-1.5 block h-[3px] w-full bg-ink/10">
        <span
          className="block h-full"
          style={{ width: `${(pct / POLL_LEAD) * 100}%`, backgroundColor: party.colour }}
        />
      </span>
    </div>
  );
}

function Missing() {
  return <p className="text-[0.86rem] leading-relaxed text-ink-faint">{NO_POSITION}</p>;
}

/**
 * Every party on one issue, ordered left to right by spectrum placement.
 *
 * Four aligned columns: who, standing, position, placement. The position used
 * to sit in a second column 220px away from the party name with the whole gap
 * empty, and each row repeated an "in full" link. The row itself now carries
 * the detail, so the six links go and the position gets the width they were
 * taking.
 */
export function IssueComparison({ view }: { view: IssueView }) {
  return (
    <ol className="mt-6 border-t border-rule">
      {view.rows.map(({ party, policy }) => (
        <li
          key={party.slug}
          className={`grid items-start gap-x-6 gap-y-3 border-b border-rule py-4 lg:grid-cols-[190px_104px_1fr_46px] ${
            policy ? "" : "bg-[color:var(--paper-sunk)]/35"
          }`}
        >
          <PartyCell party={party} />
          <PollCell party={party} />

          <div className="min-w-0">
            {policy ? (
              <>
                <p className="text-[1rem] leading-relaxed">
                  <Explain text={policy.summary} />
                </p>
                <Detail policy={policy} />
              </>
            ) : (
              <Missing />
            )}
          </div>

          <p className="text-[0.78rem] text-ink-faint tabular lg:text-right">
            {party.spectrum > 0 ? "+" : ""}
            {party.spectrum}
          </p>
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
      {/* The two parties, stated once and properly.
          This is the view where the leader and the standing carry real
          weight: on the six-party page they are context, but here the whole
          page is a judgement between two, and who fronts them and who is
          backing them is half of it. */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {[left, right].map((party) => (
          <div
            key={party.slug}
            className="flex items-center gap-3.5 border-t-[3px] pt-3"
            style={{ borderColor: party.colour }}
          >
            <Portrait
              slug={party.leader.slug}
              name={party.leader.name}
              size="md"
              accent={party.colour}
            />
            <div className="min-w-0">
              <Link
                href={`/parties/${party.slug}`}
                className="block font-display text-[1.4rem] leading-tight transition-colors hover:text-oxblood"
              >
                {party.shortName}
              </Link>
              <p className="text-[0.8rem] text-ink-faint">{party.leader.name}</p>
              <p className="mt-1 text-[0.76rem] text-ink-soft">
                {POLL[party.slug] != null ? (
                  <>
                    <span className="font-display text-[1rem] tabular">
                      {POLL[party.slug].toFixed(1)}%
                    </span>{" "}
                    polling <span className="text-ink-faint">·</span>{" "}
                  </>
                ) : null}
                <span className="font-display text-[1rem] tabular">
                  {party.spectrum > 0 ? "+" : ""}
                  {party.spectrum}
                </span>{" "}
                on our scale
              </p>
            </div>
          </div>
        ))}
      </div>

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
                <h3 className="flex items-start gap-2 font-display text-lg leading-tight">
                  <PolicyIcon area={area.id} className="mt-[3px] h-[17px] w-[17px] shrink-0 text-ink-faint" />
                  {area.name}
                </h3>
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
