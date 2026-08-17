import type { Metadata } from "next";
import Link from "next/link";
import Storyline from "@/components/Storyline";
import SubjectFinder from "@/components/SubjectFinder";
import { NewsStructuredData } from "@/components/StructuredData";
import { outletById } from "@/data/news";
import { subjects } from "@/data/subjects";
import { getNews } from "@/lib/news";
import { coverageFor, labelFor, leanOf, subjectCounts } from "@/lib/subjects";

export const metadata: Metadata = {
  // Written for what people search, not for what we call the feature.
  title: "UK political news from the left and the right, side by side",
  description:
    "The same story as the left and the right reported it. Every headline from 13 UK mastheads, sorted by where each paper sits on the political spectrum — by person, party or issue.",
};

export const revalidate = 600;

export default async function NewsPage() {
  const { items, live, usingFallback, fetchedAt } = await getNews();

  const counts = subjectCounts(items);
  const covered = counts.filter((c) => c.count > 0);

  // The best storylines across every subject, for the front of the desk.
  const seen = new Set<string>();
  const featured = covered
    .slice(0, 8)
    .flatMap(({ subject }) =>
      coverageFor(subject, items)
        .storylines.filter((line) => line.right > 0 && line.left + line.centre > 0)
        .map((line) => ({ line, subject }))
    )
    .filter(({ line }) => {
      if (seen.has(line.id)) return false;
      seen.add(line.id);
      return true;
    })
    .sort((a, b) => b.line.stories.length - a.line.stories.length)
    .slice(0, 3);

  const spread = { left: 0, centre: 0, right: 0 };
  for (const item of items) spread[leanOf(outletById[item.outlet]?.bias ?? 0)] += 1;

  return (
    <div className="shell py-9">
      <NewsStructuredData items={items} dateModified={fetchedAt} />

      <h1 className="font-display text-4xl leading-none sm:text-5xl">
        The same story, from both sides
      </h1>
      <p className="measure mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
        Pick a person, a party or an issue and see how the left and the right have covered it —
        the same events, in their own words, with every masthead marked for where it sits.
      </p>

      <div className="mt-6">
        <SubjectFinder
          subjects={counts.map(({ subject, count }) => ({
            slug: subject.slug,
            name: subject.name,
            role: subject.role,
            count,
          }))}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-4">
        {[
          { label: "Stories now", value: items.length },
          { label: "Left of centre", value: spread.left },
          { label: "Centre", value: spread.centre },
          { label: "Right of centre", value: spread.right },
        ].map((cell) => (
          <div key={cell.label} className="bg-[color:var(--paper-raised)] px-4 py-3">
            <p className="eyebrow">{cell.label}</p>
            <p className="mt-1 font-display text-3xl font-bold leading-none tabular">
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2.5 text-[0.8rem] text-ink-faint">
        {usingFallback ? (
          <>Live feeds are unavailable — showing verified recent stories.</>
        ) : (
          <>
            Pulled from {live.length} politics feeds, refreshed every 10 minutes.
          </>
        )}
      </p>

      {featured.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl leading-tight sm:text-3xl">
            Covered from both sides today
          </h2>
          <p className="measure mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">
            Where the left and the right are both running the same event — and wording it
            differently.
          </p>
          {featured.map(({ line, subject }) => (
            <div key={line.id}>
              <Storyline storyline={line} title={labelFor(line)} />
              <p className="mt-1.5 text-[0.75rem] text-ink-faint">
                From{" "}
                <Link href={`/news/${subject.slug}`} className="link-underline font-medium">
                  {subject.name}
                </Link>
              </p>
            </div>
          ))}
        </section>
      ) : null}

      <section className="mt-11">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">Every subject we track</h2>
        <p className="measure mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">
          Leaders, parties and the issues they argue about. The number is how many stories the
          current feeds carry.
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-px border border-rule bg-[color:var(--rule)] sm:grid-cols-3 lg:grid-cols-4">
          {counts.map(({ subject, count }) => (
            <li key={subject.slug} className="bg-[color:var(--paper-raised)]">
              <Link
                href={`/news/${subject.slug}`}
                className="group flex h-full flex-col px-3.5 py-3 transition-colors hover:bg-[color:var(--paper-sunk)]"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-lg leading-tight group-hover:text-oxblood">
                    {subject.name}
                  </span>
                  <span className="shrink-0 font-body text-[0.78rem] tabular text-ink-faint">
                    {count}
                  </span>
                </span>
                <span className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-ink-faint">
                  {subject.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 border-t border-rule pt-4">
        <p className="measure text-[0.84rem] leading-relaxed text-ink-soft">
          Headlines, summaries and thumbnails belong to the publishers and link back to them.
          Where a masthead sits is a fixed rating, the same for every story it runs, and is
          explained at{" "}
          <Link href="/how-we-work" className="link-underline font-medium">
            how we work
          </Link>
          . {subjects.length} subjects tracked.
        </p>
      </footer>
    </div>
  );
}
