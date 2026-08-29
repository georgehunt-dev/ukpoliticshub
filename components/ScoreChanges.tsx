import { Cite } from "@/components/ui";
import { formatDate } from "@/components/ui";
import { factorById } from "@/data/threat-model";
import { scoreChanges } from "@/data/threat-readings";

/**
 * Every time we have moved a score, with the date and the reason.
 *
 * A score nobody can audit is an opinion with a number attached. This is the
 * audit: what moved, when, by how much, and on the strength of what. It runs
 * newest first and it shows falls as readily as rises, because an assessment
 * that only ever climbs is one that is being written backwards from a
 * conclusion.
 *
 * Renders nothing until a score has actually moved, so a state we have never
 * revised does not carry an empty heading.
 */
export default function ScoreChanges({ slug }: { slug: string }) {
  const changes = [...(scoreChanges[slug] ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  if (!changes.length) return null;

  return (
    <section className="mt-10">
      <p className="eyebrow">On the record</p>
      <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
        What we have moved, and when
      </h2>
      <p className="measure mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
        Scores move when a person moves them, never because coverage spiked. Each change below
        says what it was, what it became and what changed our mind.
      </p>

      <ol className="mt-5 border-t border-rule">
        {changes.map((change) => {
          const factor = factorById(change.factor);
          const up = change.to > change.from;
          return (
            <li
              key={`${change.date}-${change.factor}`}
              className="grid gap-x-6 gap-y-2 border-b border-rule py-4 sm:grid-cols-[150px_minmax(0,1fr)]"
            >
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.13em] text-ink-faint">
                  {formatDate(change.date)}
                </p>
                <p className="mt-1 font-display text-[1.05rem] leading-tight">{factor.name}</p>
                <p className="mt-0.5 font-display text-[0.95rem] tabular text-ink-soft">
                  {change.from}
                  <span aria-hidden="true"> → </span>
                  <span className={up ? "text-oxblood" : "text-ink"}>{change.to}</span>
                  <span className="sr-only">
                    {up ? " raised to " : " lowered to "}
                    {change.to}
                  </span>
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[0.92rem] leading-relaxed text-ink-soft">{change.reason}</p>
                {change.source ? (
                  <div className="mt-2">
                    <Cite source={change.source} />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
