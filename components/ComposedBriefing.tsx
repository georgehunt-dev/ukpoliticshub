import Link from "next/link";
import { SourceList } from "@/components/ui";
import { composeBriefing } from "@/lib/briefing/compose";

/**
 * The live half of the briefing page.
 *
 * Everything here is assembled from figures published elsewhere on the site,
 * so it regenerates with the news and carries no claim it cannot support. The
 * hand-written editorial sits below it, clearly dated and clearly separate.
 */
export default async function ComposedBriefing() {
  const briefing = await composeBriefing();

  const updated = new Date(briefing.generatedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section aria-labelledby="composed-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="eyebrow">
          Assembled from live data · updated {updated}
        </p>
        {briefing.feedsLive ? (
          <p className="text-[0.75rem] text-ink-faint">Regenerates every 15 minutes</p>
        ) : null}
      </div>

      <h2 id="composed-heading" className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        {briefing.headline}
      </h2>

      <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-ink-soft">
        {briefing.standfirst}
      </p>

      {/* Topics carrying today's coverage */}
      {briefing.topics.length ? (
        <nav aria-label="Today's topics" className="mt-5 flex flex-wrap gap-2">
          {briefing.topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/news#${topic.id}`}
              className="border border-rule bg-[color:var(--paper-raised)] px-3 py-1.5 text-[0.78rem] font-semibold transition-colors hover:border-oxblood hover:text-oxblood"
            >
              {topic.name}
              <span className="ml-1.5 text-ink-faint tabular">{topic.count}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <ol className="mt-7 divide-y divide-[color:var(--rule)] border-y border-rule">
        {briefing.sections.map((section, index) => (
          <li key={section.id} className="grid gap-x-8 gap-y-2 py-5 lg:grid-cols-[190px_1fr]">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-lg font-bold text-ink-faint tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl leading-tight">{section.title}</h3>
            </div>

            <div className="min-w-0">
              <p className="text-[0.98rem] leading-relaxed text-ink">{section.body}</p>
              {section.sources.length ? (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {section.sources.map((source) => (
                    <li key={source.url} className="text-[0.76rem]">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-ink-faint"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-l-4 border-ink/25 bg-[color:var(--paper-sunk)]/50 px-4 py-3 text-[0.85rem] leading-relaxed text-ink-soft">
        <strong className="font-semibold text-ink">How this is written:</strong> assembled
        automatically from the figures published across this site, each of which carries its own
        source. No language model writes it, so it cannot invent a number — and it regenerates with
        the news rather than being typed once and left. What it does not do is reach a judgement;
        that is what the dated editorial below is for.
      </p>

      {!briefing.feedsLive ? (
        <p className="mt-3 text-[0.85rem] leading-relaxed text-oxblood">
          The press summary is missing because the live feeds could not be reached on this pass. The
          figures above are unaffected.
        </p>
      ) : null}
    </section>
  );
}

/** Sources shared across the composed sections, listed once at the foot. */
export function ComposedSources() {
  return (
    <SourceList
      label="The composed briefing draws on"
      sources={[
        {
          label: "PollCheck — 7-poll moving average",
          url: "https://www.pollcheck.co.uk/gb-polls",
        },
        {
          label: "GOV.UK — Terrorism threat levels",
          url: "https://www.gov.uk/terrorism-national-emergency/terrorism-threat-levels",
        },
        {
          label: "Home Office — small boat activity in the English Channel",
          url: "https://www.gov.uk/government/publications/migrants-detected-crossing-the-english-channel-in-small-boats",
        },
      ]}
    />
  );
}
