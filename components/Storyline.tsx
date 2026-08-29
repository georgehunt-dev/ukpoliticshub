import StoryRow from "@/components/StoryRow";
import { formatDate } from "@/components/ui";
import type { Storyline as StorylineType, StorylineLabel } from "@/lib/subjects";

/**
 * One event, as the left and the right told it.
 *
 * The wording where a column is empty matters more than it looks. Grouping
 * works on headline similarity, so a paper that covered the same story in
 * markedly different words falls out of the group. We have watched it happen.
 * Saying "the right did not cover this" would therefore have been false, and
 * false in a direction that reads as bias. So the page says only what it can
 * stand behind: we could not detect it.
 */
function Column({
  stories,
  heading,
  accent,
}: {
  stories: StorylineType["stories"];
  heading: string;
  accent: string;
}) {
  return (
    <div className="px-4 py-3.5 sm:px-5">
      <p
        className="text-[0.6rem] font-bold uppercase tracking-[0.14em]"
        style={{ color: accent }}
      >
        {heading}
      </p>
      {stories.length ? (
        <ul className="mt-1.5 divide-y divide-rule/60">
          {stories.map((story) => (
            <StoryRow key={story.url} story={story} />
          ))}
        </ul>
      ) : (
        <p className="mt-2.5 border border-dashed border-rule px-3 py-2.5 text-[0.82rem] italic leading-relaxed text-ink-faint">
          Our system was unable to detect coverage from this side of the political spectrum on
          this subject.
        </p>
      )}
    </div>
  );
}

export default function Storyline({
  storyline,
  title,
}: {
  storyline: StorylineType;
  /**
   * Null where no honest neutral label could be derived. Rather than promote
   * one masthead's headline to be the name of the whole group, which hands
   * that paper the framing: the header simply carries the date and the count,
   * and the headlines below speak for themselves.
   */
  title: StorylineLabel | null;
}) {
  const leftish = storyline.stories.filter((s) => s.lean !== "right");
  const rightish = storyline.stories.filter((s) => s.lean === "right");
  const total = storyline.stories.length;

  return (
    <article className="mt-4 border border-rule bg-[color:var(--paper-raised)]">
      <header className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-rule px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-[0.63rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
            {formatDate(storyline.latest.slice(0, 10))}
          </p>
          {/* A shared phrase belongs to no masthead and is set as a title. A
              borrowed headline is set in quotes and credited, so the reader
              can see whose words they are rather than taking them as ours. */}
          {title ? (
            <h3 className="mt-0.5 font-display text-xl leading-tight sm:text-[1.35rem]">
              {title.kind === "shared" ? (
                title.text
              ) : (
                <>
                  &ldquo;{title.text}&rdquo;{" "}
                  <span className="font-body text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    {title.outletName}&rsquo;s wording
                  </span>
                </>
              )}
            </h3>
          ) : (
            <p className="mt-0.5 font-display text-lg leading-tight text-ink-soft">
              One story, {storyline.stories.length} mastheads
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="flex h-[7px] w-28 bg-ink/[0.08]">
            <span style={{ width: `${(storyline.left / total) * 100}%`, background: "#2b4a7a" }} />
            <span
              style={{ width: `${(storyline.centre / total) * 100}%`, background: "var(--ink-faint)" }}
            />
            <span
              style={{ width: `${(storyline.right / total) * 100}%`, background: "var(--oxblood)" }}
            />
          </span>
          <span className="whitespace-nowrap text-[0.62rem] uppercase tracking-[0.1em] text-ink-faint">
            {total} outlets
          </span>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-rule">
        <Column stories={leftish} heading="From the left and centre" accent="#2b4a7a" />
        <Column stories={rightish} heading="From the right" accent="var(--oxblood)" />
      </div>
    </article>
  );
}
