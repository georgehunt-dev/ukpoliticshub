import type { Candidate } from "@/lib/constituencies";

/**
 * One election result as a share-of-vote table.
 *
 * Every candidate is listed, not just the top few: the long tail is often the
 * most interesting part of a seat, and trimming it would quietly edit the
 * result. Bars are drawn relative to the winner so the shape of the contest is
 * readable at a glance.
 */

const fmt = new Intl.NumberFormat("en-GB");

/**
 * How far this party ran ahead of or behind its own national share. A party
 * that stood only here has no national figure, and gets an em dash rather than
 * a zero. Those are different statements.
 */
function NationalCell({ share, national }: { share: number; national: number | undefined }) {
  if (national == null) {
    return (
      <td className="py-2.5 pl-3 text-right text-[0.8rem] text-ink-faint tabular-nums" title="Did not stand nationally">
        —
      </td>
    );
  }
  const delta = share - national;
  return (
    <td className="py-2.5 pl-3 text-right text-[0.8rem] tabular-nums">
      <span className={delta >= 0 ? "text-ink-soft" : "text-[color:var(--oxblood)]"}>
        {delta >= 0 ? "+" : ""}
        {delta.toFixed(1)}
      </span>
    </td>
  );
}

export default function ConstituencyResult({
  candidates,
  label,
  nationalShare,
}: {
  candidates: Candidate[];
  label: string;
  /**
   * Party to national vote share at the same election. Passed only for the
   * general election, setting a by-election against national shares from a
   * different contest would compare two unlike things.
   */
  nationalShare?: Record<string, number>;
}) {
  const total = candidates.reduce((sum, c) => sum + c.votes, 0);
  const top = candidates[0]?.votes ?? 0;
  if (!total || !top) return null;

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        {label} result, every candidate by votes received
      </caption>
      <thead>
        <tr className="border-b border-ink/25">
          {[...["Candidate", "Party", "Votes", "Share"], ...(nationalShare ? ["vs UK"] : [])].map(
            (heading, i) => (
              <th
                key={heading}
                scope="col"
                className={`pb-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ink-faint ${
                  i >= 2 ? "text-right" : ""
                }`}
              >
                {heading}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate, i) => {
          const share = (candidate.votes / total) * 100;
          return (
            <tr key={`${candidate.name}-${i}`} className="border-b border-rule/70 align-baseline">
              <td className="py-2.5 pr-3">
                <span className={i === 0 ? "font-semibold" : ""}>{candidate.name}</span>
                {i === 0 ? (
                  <span className="ml-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-oxblood">
                    Elected
                  </span>
                ) : null}
              </td>
              <td className="py-2.5 pr-3 text-[0.88rem] text-ink-soft">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 shrink-0 border border-ink/20"
                    style={{ background: candidate.colour ?? "transparent" }}
                  />
                  {candidate.party}
                </span>
              </td>
              <td className="py-2.5 pr-3 text-right font-body tabular-nums">
                {fmt.format(candidate.votes)}
              </td>
              <td className="w-[34%] py-2.5 text-right">
                <span className="flex items-center justify-end gap-2.5">
                  <span
                    aria-hidden="true"
                    className="hidden h-2.5 flex-1 bg-ink/[0.06] sm:block"
                  >
                    <span
                      className="block h-full"
                      style={{
                        width: `${(candidate.votes / top) * 100}%`,
                        background: candidate.colour ?? "var(--ink-soft)",
                      }}
                    />
                  </span>
                  <span className="shrink-0 tabular-nums">{share.toFixed(1)}%</span>
                </span>
              </td>
              {nationalShare ? <NationalCell share={share} national={nationalShare[candidate.party]} /> : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
