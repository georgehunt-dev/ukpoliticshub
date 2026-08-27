import Link from "next/link";
import Explain from "@/components/Explain";
import { NO_POSITION, POLICY_AREAS } from "@/data/policy-areas";
import { SourceList } from "@/components/ui";
import type { Party } from "@/lib/types";

/**
 * Every party answers the same ten questions, in the same order.
 *
 * The comparability is the point: a reader can hold two pages side by side and
 * the areas line up. Where a party has published nothing we could source, the
 * row still appears and says so: an empty row is information about the
 * platform, and hiding it would flatter parties with thin programmes.
 */
export default function PolicyGrid({ party }: { party: Party }) {
  const byArea = Object.fromEntries(party.policies.map((p) => [p.area, p]));
  const stated = party.policies.length;

  return (
    <section id="policies" className="scroll-mt-24">
      <div className="rule-gold flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pt-4">
        <div>
          <p className="eyebrow">Where they stand</p>
          <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">The policies</h2>
        </div>
        <p className="text-[0.82rem] text-ink-soft">
          <strong className="font-semibold text-ink tabular">{stated}</strong> of{" "}
          <span className="tabular">{POLICY_AREAS.length}</span> areas with a position we could
          source
        </p>
      </div>

      <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-ink-soft">
        All six parties are asked the same questions in the same order, so their answers can be read
        against each other. Positions are the party&rsquo;s own; anything in the grey line beneath is
        our note on where a policy is contested or short on detail.
      </p>

      <ol className="mt-6 divide-y divide-[color:var(--rule)] border-y border-rule">
        {POLICY_AREAS.map((area, index) => {
          const policy = byArea[area.id];
          return (
            <li
              key={area.id}
              className={`grid gap-x-8 gap-y-2 py-5 lg:grid-cols-[240px_1fr] ${
                policy ? "" : "bg-[color:var(--paper-sunk)]/35"
              }`}
            >
              <div className="lg:pl-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-lg font-bold text-ink-faint tabular">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-display text-xl leading-tight"
                    style={policy ? { color: party.colour } : undefined}
                  >
                    {area.name}
                  </h3>
                </div>
                <p className="mt-1.5 pl-7 text-[0.78rem] leading-snug text-ink-faint lg:pl-0">
                  {area.question}
                </p>
              </div>

              <div className="min-w-0">
                {policy ? (
                  <>
                    <p className="font-display text-[1.05rem] leading-snug text-ink">
                      <Explain text={policy.summary} />
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                      <Explain text={policy.position} />
                    </p>
                    {policy.caveat ? (
                      <p className="mt-2.5 border-l-2 border-oxblood/40 pl-3 text-[0.86rem] leading-relaxed text-ink-soft">
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
                  </>
                ) : (
                  <p className="text-[0.88rem] leading-relaxed text-ink-faint">{NO_POSITION}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {party.policySources?.length ? (
        <SourceList sources={party.policySources} label="Policy positions drawn from" />
      ) : null}

      <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-faint">
        Positions are summarised from each party&rsquo;s published material and reporting of it, not
        from a full manifesto reading, and platforms move.{" "}
        <Link href="/how-we-work" className="link-underline">
          How we work
        </Link>
        .
      </p>
    </section>
  );
}
