import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverageBars from "@/components/CoverageBars";
import MastheadPlate from "@/components/MastheadPlate";
import EmailCapture from "@/components/EmailCapture";
import StoryRow from "@/components/StoryRow";
import { MoreLink, OurAssessment } from "@/components/ui";
import { outletById, outlets } from "@/data/news";
import { noteFor } from "@/data/outlet-notes";
import { getNews } from "@/lib/news";
import { coverageOf, ENOUGH_DAYS, withArticle } from "@/lib/outlet-coverage";
import { leanOf, LEAN_LABEL } from "@/lib/subjects";

export const revalidate = 600;

export function generateStaticParams() {
  return outlets.map((outlet) => ({ outlet: outlet.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/outlets/[outlet]">): Promise<Metadata> {
  const { outlet: id } = await params;
  const outlet = outletById[id];
  if (!outlet) return { title: "Outlet not found" };

  const leaning = leanOf(outlet.bias);
  const sign = outlet.bias > 0 ? "+" : "";
  // "Sky News is centre" is not a sentence. The centre gets its own wording.
  const verdict =
    leaning === "centre"
      ? "sits at the centre of our scale"
      : `is ${LEAN_LABEL[leaning].toLowerCase()}`;
  // withArticle gives "the Daily Mail", which is right mid-sentence and wrong
  // at the start of one.
  const opener = withArticle(outlet.name).replace(/^./, (c) => c.toUpperCase());

  return {
    // Worded as the question is typed. Search Console shows every one of this
    // site's page-one queries is "is X left or right" — the previous title
    // asked "is X biased?", which is a different question and a word nobody
    // searches for.
    title: `Is ${withArticle(outlet.name)} left or right? Where it sits on the spectrum`,
    description: `${opener} ${verdict}. We place it at ${sign}${outlet.bias} on a −10 to +10 scale, and measure what it actually covers against the rest of the UK press.`,
    alternates: { canonical: `/news/outlets/${outlet.id}` },
  };
}

function position(bias: number) {
  return ((bias + 10) / 20) * 100;
}

export default async function OutletPage({ params }: PageProps<"/news/outlets/[outlet]">) {
  const { outlet: id } = await params;
  const outlet = outletById[id];
  if (!outlet) notFound();

  const lean = leanOf(outlet.bias);
  const coverage = coverageOf(outlet.id);
  const { items } = await getNews();

  const theirs = items
    .filter((item) => item.outlet === outlet.id)
    .slice(0, 10)
    .map((item) => ({
      ...item,
      outletName: outlet.name,
      bias: outlet.bias,
      lean,
      via: "own" as const,
    }));

  const others = outlets.filter((o) => o.id !== outlet.id).sort((a, b) => a.bias - b.bias);

  const note = noteFor(outlet.id, withArticle(outlet.name));

  /**
   * Where it sits among the fifteen, said in words. Ties are common — three
   * outlets share +6 — so this counts how many are further out rather than
   * claiming a unique rank.
   */
  const furtherOut = outlets.filter((o) =>
    outlet.bias >= 0 ? o.bias > outlet.bias : o.bias < outlet.bias
  ).length;
  const rank =
    outlet.bias === 0
      ? null
      : furtherOut === 0
        ? `the furthest ${outlet.bias > 0 ? "right" : "left"} of the ${outlets.length} outlets we read`
        : furtherOut <= 2
          ? `among the furthest ${outlet.bias > 0 ? "right" : "left"} of the ${outlets.length} outlets we read`
          : null;

  /** The single most distinctive thing the measured coverage shows. */
  const top = coverage.more[0];
  const headline =
    top && coverage.stories > 0
      ? `Over the last ${coverage.days} ${coverage.days === 1 ? "day" : "days"} it covered ${top.name} at ${top.index.toFixed(1)}× the rate of the press as a whole.`
      : null;


  return (
    <div className="shell py-9">
      <nav className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.78rem] text-ink-soft">
        <Link href="/news" className="link-underline font-medium">
          The news desk
        </Link>
        <span aria-hidden="true" className="text-ink-faint">›</span>
        <Link href="/news/outlets" className="link-underline font-medium">
          Mastheads
        </Link>
        <span aria-hidden="true" className="text-ink-faint">›</span>
        <span>{outlet.name}</span>
      </nav>

      {/* The question as it is typed, answered in the first line, with the
          qualification directly beneath rather than buried or dropped. */}
      <div className="mt-4 grid gap-7 border-t-2 border-ink pt-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        <div className="min-w-0">
          <MastheadPlate id={outlet.id} name={outlet.name} />

          <h1 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
            Is {withArticle(outlet.name)} left or right?
          </h1>

          <p className="measure mt-3 text-[1.05rem] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-oxblood">
              {lean === "centre" ? "Centre-ground" : LEAN_LABEL[lean]}.
            </strong>{" "}
            We place{" "}
            {withArticle(outlet.name)} at{" "}
            <strong className="font-semibold text-ink tabular">
              {outlet.bias > 0 ? "+" : ""}
              {outlet.bias}
            </strong>{" "}
            on a scale from −10 (left) to +10 (right)
            {rank ? `, ${rank}` : ""}.
          </p>

          {/* This outlet alone on the scale. The other fourteen are linked
              lower down, where they do not crowd the answer. */}
          <div className="mt-6">
            <div className="relative h-9">
              <div className="absolute inset-x-0 top-5 h-px bg-ink/40" />
              <div className="absolute left-1/2 top-2 h-7 w-px bg-gold" />
              <div
                className="absolute top-[14px] -translate-x-1/2"
                style={{ left: `${position(outlet.bias)}%` }}
              >
                <span className="block h-[13px] w-[13px] bg-oxblood outline outline-2 outline-[color:var(--paper)]" />
              </div>
            </div>
            <div className="flex justify-between text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
              <span>Left −10</span>
              <span>Centre</span>
              <span>Right +10</span>
            </div>
          </div>
        </div>

        <aside className="border border-rule bg-[color:var(--paper-raised)] p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="eyebrow">In one line</p>
            <OurAssessment />
          </div>
          {note ? (
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{note}</p>
          ) : null}
          <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
            The placement is a judgement of ours, drawn from Ofcom&rsquo;s news-consumption
            research and the Reuters Institute&rsquo;s placement of news audiences, taking the
            midpoint where they disagree. It describes the masthead, not the article in front of
            you — a right-leaning paper runs stories that damage the right, and the reverse.
          </p>

          {headline ? (
            <>
              <p className="eyebrow mt-5">Measured, not judged</p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{headline}</p>
            </>
          ) : null}

          <p className="mt-4 text-[0.78rem]">
            <Link href="/how-we-work#bias" className="link-underline font-medium text-ink-soft">
              How we place outlets
            </Link>
          </p>
        </aside>
      </div>

      {/* Measured behaviour */}
      <section className="mt-9">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">
          What it actually covers
        </h2>
        <p className="measure mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">
          The share of {withArticle(outlet.name)}&rsquo;s politics stories touching each subject, divided by the
          share across every masthead we read. 2.0× means twice the attention the press as a whole
          gave it.
        </p>

        {coverage.provisional ? (
          <p className="measure mt-3 border-l-4 border-oxblood bg-oxblood/[0.05] px-4 py-3 text-[0.86rem] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">Provisional.</strong> This is built from{" "}
            {coverage.days} {coverage.days === 1 ? "day" : "days"} of recorded coverage and{" "}
            {coverage.stories} {coverage.stories === 1 ? "story" : "stories"}. Each feed carries
            about a dozen stories at a time, so on this little history a single article moves a
            share by several points. Read it as a snapshot, not a finding — it becomes meaningful
            at around {ENOUGH_DAYS} days, and we record every day from here.
          </p>
        ) : (
          <p className="mt-3 text-[0.82rem] text-ink-faint">
            Measured across {coverage.stories} stories over {coverage.days} days
            {coverage.from ? `, ${coverage.from} to ${coverage.to}` : ""}.
          </p>
        )}

        <div className="mt-5 grid gap-7 lg:grid-cols-2">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-oxblood">
              Covered more than the press average
            </p>
            <CoverageBars rows={coverage.more} tone="more" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
              Covered less than the press average
            </p>
            <CoverageBars rows={coverage.less} tone="less" />
          </div>
        </div>
      </section>

      {theirs.length > 0 ? (
        <section className="mt-9">
          <h2 className="font-display text-2xl leading-tight">
            What {withArticle(outlet.name)} is running now
          </h2>
          <ul className="mt-3 divide-y divide-rule/60">
            {theirs.map((story) => (
              <StoryRow key={story.url} story={story} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-9 border-t border-rule pt-5">
        <p className="eyebrow">Every masthead we read</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {others.map((other) => (
            <li key={other.id}>
              <Link
                href={`/news/outlets/${other.id}`}
                className="link-underline text-[0.88rem] text-ink-soft"
              >
                {other.name}{" "}
                <span className="tabular text-ink-faint">
                  {other.bias > 0 ? "+" : ""}
                  {other.bias}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <MoreLink href="/news/outlets">All of them, on one scale</MoreLink>
        </p>
      </section>

      <EmailCapture
        className="mt-10"
        heading="See the split every morning"
        blurb="The day's stories as the left and the right each told them, in one email before breakfast."
        reason="The morning email"
      />

      <footer className="mt-10 border-t border-rule pt-4">
        <p className="measure text-[0.84rem] leading-relaxed text-ink-soft">
          We are not affiliated with {withArticle(outlet.name)} and this page is not endorsed by them.
          Headlines and thumbnails are theirs and link back to their site. Coverage figures are
          counted from their own politics feed once a day; the placement is ours and the method
          is at{" "}
          <Link href="/how-we-work" className="link-underline font-medium">
            how we work
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
