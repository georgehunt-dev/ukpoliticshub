import { Suspense } from "react";
import type { Metadata } from "next";
import AiMark from "@/components/AiMark";
import BriefingBody from "@/components/BriefingBody";
import ComposedBriefing, { ComposedSources } from "@/components/ComposedBriefing";
import EditionNotice from "@/components/EditionNotice";
import { SectionHeading, SourceList, formatDate } from "@/components/ui";
import { BRIEFING_DATE, briefing } from "@/data/briefing";

/** Regenerates with the feeds, in step with the rest of the site. */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "The briefing",
  description:
    "Where British politics stands right now: a live summary assembled from sourced figures, followed by a dated editorial reading of what it means.",
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
          <p className="eyebrow">Briefing</p>
          <h1 className="mt-1 font-display text-4xl leading-tight sm:text-5xl">
            The state of British politics
          </h1>
        </div>
      </header>

      {/* ── Live half: composed from sourced figures, regenerates ───────── */}
      <div className="mt-9">
        <Suspense fallback={<ComposingFallback />}>
          <ComposedBriefing />
        </Suspense>
      </div>

      {/* ── Questions ───────────────────────────────────────────────────── */}
      <div className="mt-12">
        <BriefingBody question={question} />
      </div>

      {/* ── Dated half: hand-written, argues rather than states ─────────── */}
      <article className="mt-14">
        <SectionHeading
          eyebrow={`Editorial · edition of ${formatDate(BRIEFING_DATE)}`}
          title="What it means"
          standfirst="The section above states where things stand. This one argues about it — which is why it is written by hand, dated, and kept separate from the figures."
        />

        <EditionNotice className="mt-5" />

        <h3 className="mt-8 font-display text-2xl leading-snug sm:text-3xl">{briefing.headline}</h3>

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

        <SourceList sources={briefing.sources} label="The editorial draws on" />
        <ComposedSources />
      </article>
    </div>
  );
}

function ComposingFallback() {
  return (
    <div className="panel p-8">
      <p className="eyebrow">Assembling from live data</p>
      <p className="mt-2 font-display text-2xl text-ink-faint">Reading the feeds…</p>
    </div>
  );
}
