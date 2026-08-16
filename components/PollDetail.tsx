import DoorTen from "@/components/DoorTen";
import { Cite, MoreLink, formatDate } from "@/components/ui";
import { partyBySlug } from "@/data/parties";
import {
  POLL_AVERAGE_AS_OF,
  POLL_AVERAGE_SOURCE,
  pollAverage,
  pollOther,
  recentPolls,
  trendNotes,
} from "@/data/polls";

/**
 * The workings behind the hero's standings: what has moved, and every
 * individual poll feeding the average. The standings themselves live on the
 * hero, so they are not repeated here.
 */
export default function PollDetail() {
  return (
    <section id="poll-detail" className="scroll-mt-24">
      <div className="rule-gold grid gap-8 pt-4 lg:grid-cols-[1fr_1.35fr]">
        {/* What has moved */}
        <div>
          <div className="flex items-start gap-4">
            <DoorTen className="h-16 w-auto shrink-0 text-ink" />
            <div>
              <p className="eyebrow">Behind the average</p>
              <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
                What has moved
              </h2>
            </div>
          </div>

          <ul className="mt-5 space-y-4">
            {trendNotes.map((note) => (
              <li key={note.source.url} className="border-l-2 border-oxblood/50 pl-4">
                <p className="text-[0.92rem] leading-relaxed text-ink-soft">{note.text}</p>
                <a
                  href={note.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-1.5 inline-block text-[0.75rem] text-ink-faint"
                >
                  {note.source.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-rule pt-3 text-[0.82rem] leading-relaxed text-ink-faint">
            All other parties and independents account for {pollOther.toFixed(1)}% of the average.
            Movements of a point or two between polls are usually noise.{" "}
            <MoreLink href="/how-we-work#polls">How we handle polling</MoreLink>
          </p>
        </div>

        {/* Underlying polls. min-w-0 is load-bearing: grid children default to
            min-width:auto, so without it the 560px table below stretches this
            column and drags the whole page sideways on a phone. */}
        <div className="min-w-0">
          <p className="eyebrow">Every poll in the average</p>
          <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            The polls themselves
          </h2>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
            As of {formatDate(POLL_AVERAGE_AS_OF)}. Each links to the pollster&rsquo;s own write-up,
            so every figure here is checkable at source.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-rule text-left">
                  <th className="py-2 pr-4 font-body text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    Pollster
                  </th>
                  <th className="py-2 pr-4 font-body text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    Fieldwork
                  </th>
                  {pollAverage.map((entry) => (
                    <th
                      key={entry.party}
                      className="py-2 pr-2 text-right font-body text-[0.66rem] font-bold uppercase tracking-[0.1em]"
                      style={{ color: partyBySlug[entry.party].colour }}
                    >
                      {partyBySlug[entry.party].shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rule bg-[color:var(--paper-sunk)]/45">
                  <td className="py-2.5 pr-4 font-semibold">Rolling average</td>
                  <td className="py-2.5 pr-4 text-ink-soft">7-poll</td>
                  {pollAverage.map((entry) => (
                    <td key={entry.party} className="py-2.5 pr-2 text-right font-bold tabular">
                      {entry.pct.toFixed(1)}
                    </td>
                  ))}
                </tr>
                {recentPolls.map((poll) => (
                  <tr key={`${poll.pollster}-${poll.fieldwork}`} className="border-b border-rule/60">
                    <td className="py-2.5 pr-4">
                      <a
                        href={poll.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline font-semibold"
                      >
                        {poll.pollster}
                      </a>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap text-ink-soft">{poll.fieldwork}</td>
                    {pollAverage.map((entry) => (
                      <td key={entry.party} className="py-2.5 pr-2 text-right tabular">
                        {poll.results[entry.party] != null ? (
                          poll.results[entry.party]
                        ) : (
                          <span className="text-ink-faint">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.76rem] text-ink-faint">
            <span>An em dash means the pollster published no separate figure for that party.</span>
            <Cite source={POLL_AVERAGE_SOURCE} />
          </p>
        </div>
      </div>
    </section>
  );
}
