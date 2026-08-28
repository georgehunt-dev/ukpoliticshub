import Link from "next/link";
import { getNews } from "@/lib/news";
import { formatDate } from "@/components/ui";
import { coverageFor } from "@/lib/subjects";
import { subjectBySlug } from "@/data/subjects";

/**
 * Recent coverage of a state, shown beside its assessment.
 *
 * This is the "adaptable to the news" half, and it is deliberately only half.
 * The stories update on their own; the score does not. A threat score that
 * rose because a newspaper ran a scare story would be a number we invented,
 * which is the one failure this site does not absorb, so coverage sits next
 * to the assessment as something for a person to weigh, with the date of the
 * last assessment stated so a reader can see whether it predates the news.
 */
export default async function AssessmentNews({
  slug,
  name,
  assessedOn,
}: {
  slug: string;
  name: string;
  assessedOn: string;
}) {
  const subject = subjectBySlug[slug];
  if (!subject) return null;

  const { items } = await getNews();
  const coverage = coverageFor(subject, items);
  const stories = coverage.stories.slice(0, 6);
  if (!stories.length) return null;

  const assessed = new Date(`${assessedOn}T00:00:00Z`);
  const newer = stories.filter((story) => new Date(story.publishedAt) > assessed).length;

  return (
    <section className="mt-12 border-t border-rule pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">
          {name} in the news
        </h2>
        <p className="text-[0.75rem] text-ink-faint">
          {coverage.stories.length} {coverage.stories.length === 1 ? "story" : "stories"} in the
          feeds we read
        </p>
      </div>

      <p className="measure mt-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
        These update on their own. The assessment above does not. It was last reviewed on{" "}
        {formatDate(assessedOn)},
        and only changes when someone changes it.
        {newer > 0 ? (
          <>
            {" "}
            <span className="font-semibold text-ink">
              {newer} of the stories below were published since then
            </span>{" "}
            and have not yet been weighed against the six questions.
          </>
        ) : null}
      </p>

      <ul className="mt-5 divide-y divide-[color:var(--rule)] border-y border-rule">
        {stories.map((story) => (
          <li key={story.url} className="py-3">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                  {story.outletName}
                </span>
                <span className="text-[0.68rem] text-ink-faint">
                  {new Date(story.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </span>
              <span className="mt-0.5 block text-[0.95rem] leading-snug text-ink group-hover:underline">
                {story.title}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[0.75rem] leading-snug text-ink-faint">
        Headlines are the publishers&rsquo; own and link to their reporting. We do not rewrite them,
        and their presence here is not our endorsement of the framing.{" "}
        <Link href={`/news/${subject.slug}`} className="link-underline">
          More on {name}
        </Link>
      </p>
    </section>
  );
}
