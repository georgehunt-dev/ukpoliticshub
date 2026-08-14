import Link from "next/link";
import BiasScale from "@/components/BiasScale";
import OutletMark from "@/components/OutletMark";
import { MoreLink, SectionHeading, formatShortDate } from "@/components/ui";
import { outletById } from "@/data/news";
import { getNews } from "@/lib/news";
import { classify } from "@/lib/topics";

const SHOWN = 5;

/**
 * The landing page's news slot: a short digest, not a directory. The full
 * table, broken down by topic, lives at /news.
 */
export default async function NewsDigest() {
  const { items, live, usingFallback } = await getNews();
  const shown = items.slice(0, SHOWN);

  const spread = { left: 0, centre: 0, right: 0 };
  items.forEach((item) => {
    const bias = outletById[item.outlet]?.bias ?? 0;
    if (bias <= -3) spread.left += 1;
    else if (bias < 3) spread.centre += 1;
    else spread.right += 1;
  });

  return (
    <section id="news" className="scroll-mt-24">
      <SectionHeading
        eyebrow="The papers"
        title="Today, from left and right"
        standfirst="The main stories across the British press right now. Every masthead carries a fixed left–right rating so you can see who is telling you the story before you read it."
        action={<MoreLink href="/news">All {items.length} stories, by topic</MoreLink>}
      />

      <ol className="mt-5 divide-y divide-[color:var(--rule)] border-y border-rule">
        {shown.map((item) => {
          const outlet = outletById[item.outlet];
          const topic = classify(item);
          return (
            <li key={item.url} className="py-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <OutletMark id={item.outlet} />
                <Link
                  href={`/news#${topic.id}`}
                  className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint hover:text-oxblood"
                >
                  {topic.name}
                </Link>
                <span className="ml-auto text-[0.75rem] text-ink-faint tabular">
                  {formatShortDate(item.publishedAt)}
                </span>
              </div>

              <h3 className="mt-1.5">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-[1.3rem] leading-snug transition-colors hover:text-oxblood sm:text-[1.45rem]"
                >
                  {item.title}
                </a>
              </h3>

              {item.summary ? (
                <p className="mt-1.5 line-clamp-2 max-w-3xl text-[0.9rem] leading-relaxed text-ink-soft">
                  {item.summary}
                </p>
              ) : null}

              <div className="mt-2">
                <BiasScale value={outlet?.bias ?? 0} label={outlet?.name ?? item.outlet} width={110} />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem] text-ink-soft">
        <span>
          Across all {items.length} stories today:{" "}
          <strong className="font-semibold text-ink tabular">{spread.left}</strong> left of centre,{" "}
          <strong className="font-semibold text-ink tabular">{spread.centre}</strong> centre,{" "}
          <strong className="font-semibold text-ink tabular">{spread.right}</strong> right of centre.
        </span>
        <span className="text-ink-faint">
          {usingFallback ? "Live feeds unavailable" : `${live.length} feeds live`}
        </span>
      </div>
    </section>
  );
}
