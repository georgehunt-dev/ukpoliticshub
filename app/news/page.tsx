import type { Metadata } from "next";
import BiasScale from "@/components/BiasScale";
import OutletMark from "@/components/OutletMark";
import SectionImage from "@/components/SectionImage";
import { NewsStructuredData } from "@/components/StructuredData";
import { SectionHeading, formatShortDate } from "@/components/ui";
import { outletById, outlets } from "@/data/news";
import { getNews } from "@/lib/news";
import { groupByTopic } from "@/lib/topics";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "The news, by topic",
  description:
    "Today's British politics coverage from across the press, sorted by subject, with every masthead's left–right position shown alongside its stories.",
};

export default async function NewsPage() {
  const { items, live, usingFallback, fetchedAt } = await getNews();
  const groups = groupByTopic(items);

  const spread = { left: 0, centre: 0, right: 0 };
  items.forEach((item) => {
    const bias = outletById[item.outlet]?.bias ?? 0;
    if (bias <= -3) spread.left += 1;
    else if (bias < 3) spread.centre += 1;
    else spread.right += 1;
  });

  return (
    <div className="shell py-11">
      <NewsStructuredData items={items} dateModified={fetchedAt} />
      <SectionHeading
        as="h1"
        eyebrow="The papers"
        title="The news, by topic"
        standfirst="Everything British politics is arguing about today, sorted by subject. Each story shows which masthead ran it and where that masthead sits on the political spectrum — so you can read the same event from both directions."
      />

      {/* Balance + freshness */}
      <div className="mt-6 grid gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-4">
        {[
          { label: "Stories today", value: String(items.length) },
          { label: "Left of centre", value: String(spread.left) },
          { label: "Centre", value: String(spread.centre) },
          { label: "Right of centre", value: String(spread.right) },
        ].map((cell) => (
          <div key={cell.label} className="bg-[color:var(--paper-raised)] px-4 py-3">
            <p className="eyebrow">{cell.label}</p>
            <p className="mt-1 font-display text-3xl font-bold leading-none tabular">{cell.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.82rem] text-ink-faint">
        {usingFallback ? (
          <>Live feeds are unavailable — showing verified recent stories.</>
        ) : (
          <>
            Pulled from {live.length} politics feeds, last updated{" "}
            {new Date(fetchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.
            Refreshes every 10 minutes.
          </>
        )}
      </p>

      {/* Topic jump links */}
      <nav aria-label="Topics" className="mt-6 flex flex-wrap gap-2 border-y border-rule py-3">
        {groups.map(({ topic, items: topicItems }) => (
          <a
            key={topic.id}
            href={`#${topic.id}`}
            className="border border-rule bg-[color:var(--paper-raised)] px-3 py-1.5 text-[0.78rem] font-semibold transition-colors hover:border-oxblood hover:text-oxblood"
          >
            {topic.name}
            <span className="ml-1.5 text-ink-faint tabular">{topicItems.length}</span>
          </a>
        ))}
      </nav>

      {/* Topics */}
      <div className="mt-10 space-y-12">
        {groups.map(({ topic, items: topicItems }) => (
          <section key={topic.id} id={topic.id} className="scroll-mt-24">
            <SectionImage
              photo={topic.photo}
              eyebrow={`${topicItems.length} ${topicItems.length === 1 ? "story" : "stories"}`}
              title={topic.name}
              standfirst={topic.blurb}
              alt={topic.alt}
              height="h-44 sm:h-52"
            />

            <ol className="mt-4 divide-y divide-[color:var(--rule)] border-b border-rule">
              {topicItems.map((item) => {
                const outlet = outletById[item.outlet];
                return (
                  <li key={item.url} className="grid gap-x-6 gap-y-2 py-4 lg:grid-cols-[190px_1fr_auto]">
                    <div className="flex flex-col gap-2">
                      <OutletMark id={item.outlet} size="sm" />
                      <BiasScale value={outlet?.bias ?? 0} label={outlet?.name ?? item.outlet} width={96} />
                    </div>

                    <div className="min-w-0">
                      <h3>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display text-[1.2rem] leading-snug transition-colors hover:text-oxblood"
                        >
                          {item.title}
                        </a>
                      </h3>
                      {item.summary ? (
                        <p className="measure mt-1 line-clamp-2 text-[0.86rem] leading-relaxed text-ink-soft">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>

                    <span className="whitespace-nowrap text-[0.78rem] text-ink-faint tabular lg:text-right">
                      {formatShortDate(item.publishedAt)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {/* Where each masthead sits */}
      <section className="mt-14">
        <SectionHeading
          eyebrow="The mastheads"
          title="Who is telling you the story"
          standfirst="Ratings describe the masthead, not the individual article — a right-leaning paper regularly runs stories that damage the right, and vice versa."
        />
        <div className="mt-5 grid gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-2">
          {[...outlets]
            .sort((a, b) => a.bias - b.bias)
            .map((outlet) => (
              <div
                key={outlet.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-[color:var(--paper-raised)] px-4 py-2.5"
              >
                <OutletMark id={outlet.id} size="sm" className="w-40 shrink-0" />
                <BiasScale value={outlet.bias} label={outlet.name} width={100} />
                <span className="ml-auto font-display text-base font-bold tabular">
                  {outlet.bias > 0 ? "+" : ""}
                  {outlet.bias}
                </span>
              </div>
            ))}
        </div>
        <p className="measure mt-3 text-[0.82rem] leading-relaxed text-ink-soft">
          The Times and The Spectator publish no open feed, so they are rated here but carry no
          stories. Headlines and links belong to their publishers; we neither host nor edit their
          copy.
        </p>
      </section>
    </div>
  );
}
