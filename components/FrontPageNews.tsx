import Link from "next/link";
import Storyline from "@/components/Storyline";
import StoryRow from "@/components/StoryRow";
import { outletById } from "@/data/news";
import { subjects } from "@/data/subjects";
import { getNews } from "@/lib/news";
import { coverageFor, labelFor, leanOf, type MatchedStory } from "@/lib/subjects";

/**
 * The news block on the front page.
 *
 * It leads with one event told from both sides, because that is the whole
 * product and showing it beats describing it: a reader who sees "proposes"
 * against "vows to BAN" understands the site immediately.
 *
 * That needs a storyline several outlets are running across the spectrum, and
 * some days there isn't one: on the day this was written there were two in a
 * hundred and thirty-one stories. So when none exists the block falls back to
 * the balance of today's coverage and a headline from each side, which always
 * has something to show. The front page never carries an empty slot.
 */

function Balance({ items }: { items: MatchedStory[] }) {
  const spread = { left: 0, centre: 0, right: 0 };
  for (const item of items) spread[item.lean] += 1;
  const total = Math.max(items.length, 1);

  const one = (lean: MatchedStory["lean"]) => items.find((item) => item.lean === lean);
  const picks = [one("left"), one("centre"), one("right")].filter(Boolean) as MatchedStory[];

  return (
    <div className="mt-5">
      <span aria-hidden="true" className="flex h-2.5 w-full bg-ink/[0.08]">
        <span style={{ width: `${(spread.left / total) * 100}%`, background: "#2b4a7a" }} />
        <span style={{ width: `${(spread.centre / total) * 100}%`, background: "var(--ink-faint)" }} />
        <span style={{ width: `${(spread.right / total) * 100}%`, background: "var(--oxblood)" }} />
      </span>
      <p className="mt-2.5 text-[0.88rem] text-ink-soft">
        <strong className="font-display text-[1.05rem] text-ink">{items.length}</strong> stories
        now, {spread.left} left of centre, {spread.centre} centre, {spread.right} right of centre.
      </p>

      <ul className="mt-4 grid gap-x-6 sm:grid-cols-3">
        {picks.map((story) => (
          <StoryRow key={story.url} story={story} />
        ))}
      </ul>
    </div>
  );
}

export default async function FrontPageNews() {
  const { items } = await getNews();

  // The widest cross-spectrum storyline anywhere in today's subjects.
  let best: { line: ReturnType<typeof coverageFor>["storylines"][number]; subject: string } | null =
    null;
  for (const subject of subjects) {
    for (const line of coverageFor(subject, items).storylines) {
      const crossesSpectrum = line.right > 0 && line.left + line.centre > 0;
      if (!crossesSpectrum) continue;
      if (!best || line.stories.length > best.line.stories.length) {
        best = { line, subject: subject.name };
      }
    }
  }

  const enriched: MatchedStory[] = items.map((item) => {
    const outlet = outletById[item.outlet];
    const bias = outlet?.bias ?? 0;
    return {
      ...item,
      outletName: outlet?.name ?? item.outlet,
      bias,
      lean: leanOf(bias),
      via: "own" as const,
    };
  });

  return (
    <section id="news" className="scroll-mt-24">
      <div className="rule-gold flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pt-4">
        <div className="min-w-0">
          <p className="eyebrow">The papers</p>
          <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            {best ? "The same story, from both sides" : "Today, from left and right"}
          </h2>
          <p className="measure mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
            {best
              ? "One event, as the left and the right each worded it. Every masthead is marked for where it sits."
              : "Every headline from thirteen politics feeds, marked for where each masthead sits."}
          </p>
        </div>

        {/* A proper button, not a text link. Getting to the news desk was the
            least obvious route on the page, and a small chevron link at the
            end of a heading is not an instruction. */}
        <Link
          href="/news"
          className="group inline-flex shrink-0 items-center gap-2.5 border-2 border-ink bg-ink px-5 py-3 font-body text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[color:var(--paper)] transition-colors hover:bg-[color:var(--paper)] hover:text-ink"
        >
          Explore the news desk
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      {best ? (
        <>
          <Storyline storyline={best.line} title={labelFor(best.line)} />
          <p className="mt-2 text-[0.78rem] text-ink-faint">
            One of {items.length} stories in the feeds now. See every subject, and the rest of
            today&rsquo;s coverage, on the{" "}
            <Link href="/news" className="link-underline font-medium">
              news desk
            </Link>
            .
          </p>
        </>
      ) : (
        <Balance items={enriched} />
      )}
    </section>
  );
}
