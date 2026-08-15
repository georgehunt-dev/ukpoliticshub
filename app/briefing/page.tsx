import type { Metadata } from "next";
import AiMark from "@/components/AiMark";
import BriefingBody from "@/components/BriefingBody";
import EditionNotice from "@/components/EditionNotice";
import { SourceList, formatDate } from "@/components/ui";
import { BRIEFING_DATE, briefing } from "@/data/briefing";

export const metadata: Metadata = {
  title: "The briefing",
  description:
    "A dated briefing on British politics, written from ukpoliticshub's own sourced data — the polls, the threat picture and the arguments, read from both directions. The edition date is stated on the page.",
};

export default async function BriefingPage(props: PageProps<"/briefing">) {
  const params = await props.searchParams;
  const raw = params.q;
  const question = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 200).trim() || undefined;

  return (
    <div className="mx-auto max-w-4xl px-5 py-11">
      <header className="rule-gold flex flex-wrap items-center gap-4 pt-4">
        <AiMark size={54} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Briefing · edition of {formatDate(BRIEFING_DATE)}</p>
          <h1 className="mt-1 font-display text-4xl leading-tight sm:text-5xl">
            The state of British politics
          </h1>
        </div>
      </header>

      <EditionNotice className="mt-6" />

      <div className="mt-8">
        <BriefingBody question={question} />
      </div>

      {/* The briefing itself */}
      <article className="mt-12">
        <h2 className="font-display text-2xl leading-snug sm:text-3xl">{briefing.headline}</h2>

        <div className="mt-4 space-y-4">
          {briefing.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-[1.02rem] leading-relaxed text-ink-soft ${
                index === 0
                  ? "first-letter:float-left first-letter:mr-2.5 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.82] first-letter:text-ink"
                  : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Both sides */}
        <div className="mt-10">
          <p className="eyebrow mb-3">Read it both ways</p>
          <div className="space-y-4">
            {briefing.bothSides.map((pair) => (
              <div key={pair.question} className="border border-rule bg-[color:var(--paper-raised)]">
                <p className="border-b border-rule px-4 py-2.5 font-display text-lg">
                  {pair.question}
                </p>
                <div className="grid gap-px bg-[color:var(--rule)] sm:grid-cols-2">
                  <div className="bg-[color:var(--paper-raised)] px-4 py-3.5">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#1d4f91]">
                      One reading
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{pair.left}</p>
                  </div>
                  <div className="bg-[color:var(--paper-raised)] px-4 py-3.5">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-oxblood">
                      The other
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{pair.right}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SourceList sources={briefing.sources} label="Everything above traces to these" />

        <p className="mt-6 border-l-4 border-oxblood bg-oxblood/[0.05] px-4 py-3 text-[0.88rem] leading-relaxed text-ink-soft">
          <strong className="font-semibold text-oxblood">How this is written:</strong> from the
          figures and citations published on this site, and nothing else. Where a claim favours one
          side, the reading that cuts the other way is printed beside it. No language model is
          running behind this page yet — when one is, it will be held to the same rule.
        </p>
      </article>
    </div>
  );
}
