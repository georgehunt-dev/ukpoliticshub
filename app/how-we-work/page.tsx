import type { Metadata } from "next";
import Link from "next/link";
import BiasScale from "@/components/BiasScale";
import { SectionHeading } from "@/components/ui";
import { outlets } from "@/data/news";
import { parties } from "@/data/parties";
import { RUSSIA_BANDS, russiaFactors, russiaScore } from "@/data/threat";
import { PARTNERSHIP_BANDS, assessments, bandOf, scoreOf } from "@/data/states";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How ukpoliticshub rates news outlets, places parties on the left–right spectrum, reports polling, and builds its state threat and alliance assessments — including what each method cannot tell you.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-11">
      <SectionHeading
        as="h1"
        eyebrow="How this site works"
        title="Methodology"
        standfirst="A site that promises both sides has to show its workings. This page sets out how every judgement on ukpoliticshub is made — and, just as importantly, what each method cannot tell you."
      />

      {/* ── Independence ────────────────────────────────────────────────── */}
      <section className="panel mt-8 p-6 sm:p-7">
        <h2 className="font-display text-2xl">Independence</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          ukpoliticshub is not endorsed by, affiliated with, funded by or connected to any
          political party, campaign or candidate. No party has any editorial input. Where we publish
          a judgement of our own rather than a sourced fact, it is flagged{" "}
          <strong className="font-semibold text-oxblood">Our assessment</strong> so you can weigh it
          differently from an official figure.
        </p>
      </section>

      {/* ── Polling ─────────────────────────────────────────────────────── */}
      <section id="polls" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-3xl">Polling</h2>
        <div className="mt-4 space-y-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
          <p>
            The Race for No.10 reports an existing published rolling average of British Polling
            Council members&rsquo; voting-intention polls, rather than computing an average of our
            own. That is deliberate: you can check our headline number against its source in one
            click, and we cannot quietly put a thumb on the scale by choosing which polls to include.
          </p>
          <p>
            Every individual poll behind the average is listed on the front page with its pollster,
            fieldwork dates and a link to the pollster&rsquo;s own write-up. Where a pollster did not
            publish a figure for a party, we print an em dash rather than a zero or an estimate.
          </p>
          <p>
            <strong className="font-semibold text-ink">What this cannot tell you:</strong> vote share
            is not seats. Under first-past-the-post a party on 12% nationally may hold five seats
            while a party on 21% holds over a hundred. We do not publish a seat projection, because
            the available models diverge sharply and get quoted as fact. Movements of a point or two
            between polls are usually noise, not news.
          </p>
        </div>
      </section>

      {/* ── Outlet bias ─────────────────────────────────────────────────── */}
      <section id="bias" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-3xl">How we rate news outlets</h2>
        <div className="mt-4 space-y-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
          <p>
            Each masthead carries a fixed position on a −10 (left) to +10 (right) scale. The rating
            describes the outlet, not the individual article, and it does not change from story to
            story. Positions draw on Ofcom&rsquo;s news-consumption research, the Reuters Institute
            Digital News Report&rsquo;s left–right placement of news audiences, and published
            perception surveys. Where those sources disagree, we take the midpoint.
          </p>
          <p>
            We rate the outlet rather than the article on purpose. The news table is filled from live
            RSS feeds with no human in the loop, so per-article scoring would mean having a model
            judge the slant of every headline — precisely the point at which a site promising
            neutrality becomes the story.
          </p>
          <p>
            <strong className="font-semibold text-ink">What this cannot tell you:</strong> a
            right-leaning paper runs stories that damage the right, and a left-leaning one does the
            reverse. A rating is a prior, not a verdict on the piece in front of you. Broadcasters
            regulated for due impartiality sit near the centre by obligation, which is not the same
            as being free of editorial judgement. Reasonable people place several of these mastheads
            a point or two from where we have.
          </p>
          <p>
            Two outlets below are rated but do not appear in the news table:{" "}
            <strong className="font-semibold text-ink">The Times</strong> and{" "}
            <strong className="font-semibold text-ink">The Spectator</strong> publish no open RSS
            feed. We list their ratings for reference rather than quietly dropping them, so you can
            see the full picture of who we do and do not carry.
          </p>
        </div>

        <div className="panel mt-6 divide-y divide-[color:var(--rule)]">
          {[...outlets]
            .sort((a, b) => a.bias - b.bias)
            .map((outlet) => (
              <div key={outlet.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3">
                <a
                  href={outlet.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline w-44 shrink-0 text-sm font-semibold"
                >
                  {outlet.name}
                </a>
                <BiasScale value={outlet.bias} label={outlet.name} />
                <span className="ml-auto font-display text-lg font-bold tabular">
                  {outlet.bias > 0 ? "+" : ""}
                  {outlet.bias}
                </span>
              </div>
            ))}
        </div>
      </section>

      {/* ── Spectrum ────────────────────────────────────────────────────── */}
      <section id="spectrum" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-3xl">Placing parties on the spectrum</h2>
        <div className="mt-4 space-y-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
          <p>
            Party positions use the same −10 to +10 axis, as a composite of economic and social
            policy. These are editorial judgements informed by published academic classification,
            each party&rsquo;s own stated policy, and where commentators across the spectrum place
            them. They are not measurements, and we would not defend any single figure to the point.
          </p>
          <p>
            Where a party disputes how it is characterised, the dispute is printed alongside the
            characterisation rather than resolved by us. Restore Britain is the clearest current
            case: political scientists classify it as far-right and ethno-nationalist, and the party
            rejects that description as a smear campaign. Both statements appear on its page.
          </p>
          <p>
            <strong className="font-semibold text-ink">What this cannot tell you:</strong> a single
            axis flattens real disagreement. A party can be economically interventionist and socially
            restrictive at once, and the number will hide that. Read the position note, not just the
            dot.
          </p>
        </div>

        <ul className="panel mt-6 divide-y divide-[color:var(--rule)]">
          {[...parties]
            .sort((a, b) => a.spectrum - b.spectrum)
            .map((party) => (
              <li key={party.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
                <Link
                  href={`/parties/${party.slug}`}
                  className="link-underline w-32 shrink-0 text-sm font-semibold"
                >
                  {party.shortName}
                </Link>
                <span
                  className="font-display text-lg font-bold tabular"
                  style={{ color: party.colour }}
                >
                  {party.spectrum > 0 ? "+" : ""}
                  {party.spectrum}
                </span>
                <span className="min-w-0 flex-1 text-[0.85rem] leading-snug text-ink-soft">
                  {party.spectrumNote}
                </span>
              </li>
            ))}
        </ul>
      </section>

      {/* ── Russia ──────────────────────────────────────────────────────── */}
      <section id="russia" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-3xl">The state assessments</h2>
        <div className="mt-4 space-y-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
          <p>
            We publish six of these. Three measure{" "}
            <em>sustained state-level pressure on the United Kingdom</em> — Russia, currently{" "}
            <strong className="font-semibold text-ink tabular">{russiaScore}/100</strong>, alongside
            Iran and China. Three measure the opposite: what the UK can currently rely on from the
            United States, NATO, and France and the EU. None of them measures the likelihood of open
            war, which remains low.
          </p>
          <p>
            Every one uses the same method. Each factor is scored 0–100 on its own evidence and then
            weighted; the weights sum to 100, and each factor shows the reporting behind it. Where
            the UK government has made a formal designation — Russia and Iran sit on the enhanced
            tier of the Foreign Influence Registration Scheme and China does not — we print it and
            score against it rather than around it. Where the state rejects the characterisation,
            the rejection is printed beside our assessment.
          </p>
          <p>
            Threats and alliances are deliberately kept on separate scales. They share a method but
            not a meaning, and one rail carrying both would invite the reading that a strong
            alliance cancels out a hostile state.
          </p>
          <p>The Russia weights, as an example of the method:</p>
        </div>

        <ul className="panel mt-5 divide-y divide-[color:var(--rule)]">
          {russiaFactors.map((factor) => (
            <li key={factor.name} className="flex items-baseline gap-4 px-5 py-3">
              <span className="w-12 shrink-0 font-display text-lg font-bold tabular">
                {factor.weight}%
              </span>
              <span className="min-w-0 flex-1 text-[0.9rem]">{factor.name}</span>
              <span className="shrink-0 font-display text-lg font-bold tabular text-ink-soft">
                {factor.score}
              </span>
            </li>
          ))}
        </ul>

        <div className="panel mt-5 p-5">
          <p className="eyebrow mb-3">All six assessments, as they currently stand</p>
          <ul className="space-y-1.5">
            {assessments.map((a) => (
              <li key={a.slug} className="flex flex-wrap items-baseline gap-x-3 text-[0.85rem]">
                <span className="w-10 shrink-0 font-display text-lg font-bold tabular">
                  {scoreOf(a)}
                </span>
                <span className="w-32 shrink-0 font-semibold">{a.name}</span>
                <span className="w-24 shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  {bandOf(a).label}
                </span>
                <span className="min-w-0 flex-1 text-ink-soft">
                  {a.kind === "threat" ? "Pressure on the UK" : "What the UK can rely on"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel mt-5 p-5">
          <p className="eyebrow mb-3">Threat bands</p>
          <ul className="space-y-1.5">
            {RUSSIA_BANDS.map((band) => (
              <li key={band.label} className="flex flex-wrap items-baseline gap-x-3 text-[0.85rem]">
                <span className="w-16 shrink-0 font-semibold tabular">
                  {band.min}–{band.max}
                </span>
                <span className="w-24 shrink-0 font-semibold">{band.label}</span>
                <span className="min-w-0 flex-1 text-ink-soft">{band.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel mt-5 p-5">
          <p className="eyebrow mb-3">Alliance bands</p>
          <ul className="space-y-1.5">
            {PARTNERSHIP_BANDS.map((band) => (
              <li key={band.label} className="flex flex-wrap items-baseline gap-x-3 text-[0.85rem]">
                <span className="w-16 shrink-0 font-semibold tabular">
                  {band.min}&ndash;{band.max}
                </span>
                <span className="w-24 shrink-0 font-semibold">{band.label}</span>
                <span className="min-w-0 flex-1 text-ink-soft">{band.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-l-4 border-oxblood bg-oxblood/[0.05] p-5">
          <p className="text-[0.9rem] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-oxblood">
              This is our assessment, and nobody else&rsquo;s.
            </strong>{" "}
            It is not produced, endorsed or reviewed by the UK government, JTAC, MI5 or any
            intelligence agency, and it carries no official standing whatsoever. We built it because
            the official threat-level system covers terrorism, not state pressure, and readers
            deserve something more structured than a headline. Treat it as a way of organising
            public evidence — nothing more. The terrorism threat level published beside it is the
            genuine official figure, and we never adjust that.
          </p>
        </div>
      </section>

      {/* ── Corrections ─────────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="font-display text-3xl">Corrections</h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
          If a figure here is wrong or out of date, we want to fix it rather than defend it. Every
          number on this site carries a link to its source precisely so that errors are easy to
          catch. Sourced data is refreshed on a rolling basis and each section states the date it
          was last assessed.
        </p>
      </section>
    </div>
  );
}
