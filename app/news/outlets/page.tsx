import type { Metadata } from "next";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import { OurAssessment } from "@/components/ui";
import { outlets } from "@/data/news";
import { HISTORY_DAYS } from "@/lib/outlet-coverage";
import { leanOf, LEAN_LABEL } from "@/lib/subjects";

export const metadata: Metadata = {
  title: "Which UK newspapers are left wing, and which are right",
  description:
    "Where every UK masthead we read sits on the political spectrum, from Novara Media to GB News — and what each one actually covers, counted from its own output.",
};

export const revalidate = 600;

function position(bias: number) {
  return ((bias + 10) / 20) * 100;
}

export default function OutletsPage() {
  const ordered = [...outlets].sort((a, b) => a.bias - b.bias);

  return (
    <div className="shell py-9">
      <h1 className="font-display text-4xl leading-none sm:text-5xl">
        Which papers are left wing, and which are right
      </h1>
      <p className="measure mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
        Every masthead whose politics feed we read, on one scale. The placement applies to the
        paper rather than to any single article — and each has a page showing what it actually
        chose to write about, measured against the rest of the press.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <OurAssessment />
        <p className="text-[0.82rem] text-ink-soft">
          Placements are ours. Coverage figures are counted from the outlets&rsquo; own output —
          {HISTORY_DAYS} {HISTORY_DAYS === 1 ? "day" : "days"} recorded so far.
        </p>
      </div>

      <ol className="mt-7 border-t border-rule">
        {ordered.map((outlet) => {
          const lean = leanOf(outlet.bias);
          return (
            <li key={outlet.id} className="border-b border-rule">
              <Link
                href={`/news/outlets/${outlet.id}`}
                className="group grid items-center gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr_auto]"
              >
                <span className="min-w-0">
                  <span className="block font-display text-xl leading-tight group-hover:text-oxblood">
                    {outlet.name}
                  </span>
                  <span className="block text-[0.62rem] font-bold uppercase tracking-[0.13em] text-ink-faint">
                    {LEAN_LABEL[lean]}
                  </span>
                </span>

                {/* One axis running down the list, so the spread reads at a glance. */}
                <span aria-hidden="true" className="relative block h-5">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-ink/20" />
                  <span className="absolute left-1/2 top-1 h-3 w-px bg-gold/70" />
                  <span
                    className="absolute top-[6px] -translate-x-1/2"
                    style={{ left: `${position(outlet.bias)}%` }}
                  >
                    <span className="block h-2.5 w-2.5 bg-oxblood outline outline-2 outline-[color:var(--paper)]" />
                  </span>
                </span>

                <span className="shrink-0 text-right font-display text-xl font-bold tabular">
                  {outlet.bias > 0 ? "+" : ""}
                  {outlet.bias}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex justify-between text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
        <span>−10 · Left</span>
        <span>Centre</span>
        <span>Right · +10</span>
      </div>

      <EmailCapture
        className="mt-10"
        heading="Both sides, before your first coffee"
        blurb="The day's stories as the left and the right each told them, in one email each morning."
        reason="The morning email"
      />

      <footer className="mt-10 border-t border-rule pt-4">
        <p className="measure text-[0.84rem] leading-relaxed text-ink-soft">
          These placements are ours, not a published dataset. We looked for one: the most-cited UK
          study covers eight national newspapers and was published in 2017, before several of the
          outlets on this list existed. Rather than dress a nine-year-old survey as current
          evidence, each page shows what the masthead is measurably covering now and leaves the
          placement flagged as the judgement it is. The method is at{" "}
          <Link href="/how-we-work" className="link-underline font-medium">
            how we work
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
