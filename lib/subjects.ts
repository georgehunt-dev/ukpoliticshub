import { outletById } from "@/data/news";
import { type Subject, subjects } from "@/data/subjects";
import { normalise } from "@/lib/ask-intent";
import type { NewsItem } from "@/lib/types";

/**
 * Matching stories to subjects, and grouping them into storylines.
 *
 * Two rules keep this honest. A story only reaches a subject page because one
 * of that subject's own terms, or its linked party's, appears in the headline
 * or summary, and where it arrived through the link, the page says so. And
 * where a storyline has nothing from one side, the page says we could not
 * detect coverage rather than that none exists: grouping misses re-worded
 * headlines, so absence here is a limit of ours, not a finding about a paper.
 */

/**
 * Below this many stories a subject page is asking Google to rank almost
 * nothing. A cluster of near-empty templated pages is read as low quality and
 * the judgement is applied site-wide, so thin subjects are noindexed and kept
 * out of the sitemap until the papers give them something. Nine of nineteen
 * subjects were under this bar on the day it was written.
 */
export const MIN_INDEXABLE = 3;

export type Lean = "left" | "centre" | "right";

export function leanOf(bias: number): Lean {
  if (bias <= -3) return "left";
  if (bias >= 3) return "right";
  return "centre";
}

export const LEAN_LABEL: Record<Lean, string> = {
  left: "Left of centre",
  centre: "Centre",
  right: "Right of centre",
};

export type MatchedStory = NewsItem & {
  outletName: string;
  bias: number;
  lean: Lean;
  /** "own" when the subject was named; "linked" when its party or leader was. */
  via: "own" | "linked";
  /** What the link was, for the "via Reform UK" label. */
  viaName?: string;
};

export type Storyline = {
  id: string;
  stories: MatchedStory[];
  left: number;
  centre: number;
  right: number;
  latest: string;
};

export type SubjectCoverage = {
  subject: Subject;
  stories: MatchedStory[];
  storylines: Storyline[];
  /** Everything only one outlet carried, grouped by lean. */
  singles: Record<Lean, MatchedStory[]>;
  own: number;
  linked: number;
};

/**
 * Does the text name this subject?
 *
 * `exclude` is cut out first rather than used to veto the story, so a piece
 * that says both "electoral reform" and "Reform UK" still counts while one
 * that only says the former does not. Several party names are ordinary
 * English: a labour market, a conservative estimate, electoral reform. Without
 * this, "British conservative influencer detained by ICE" filed itself under
 * the Conservative Party.
 */
function mentions(haystack: string, terms: string[], exclude: string[] = []): boolean {
  const text = exclude.reduce((acc, phrase) => acc.split(phrase).join(" "), haystack);
  return terms.some((term) => text.includes(` ${term} `) || text.includes(` ${term}s `));
}

/* ── Grouping stories that are about the same event ─────────────────────── */

const STOP = new Set(
  ("the a an and or of to in on for is are was were as at by with from that this it its his her " +
   "their you your we our not but he she they will would could been have has had says said after " +
   "over into more most new who what when why how than then them there here about")
    .split(" ")
);

function keyOf(title: string): Set<string> {
  return new Set(
    normalise(title).split(" ").filter((w) => w.length > 3 && !STOP.has(w))
  );
}

function overlap(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  for (const word of a) if (b.has(word)) shared += 1;
  return shared / (a.size + b.size - shared || 1);
}

/**
 * Deliberately cautious. A lower bar merges stories that only share a subject,
 * which would put unrelated headlines side by side as though they were the
 * same event: the failure this whole design exists to avoid.
 */
const SAME_STORY = 0.3;

/**
 * A neutral name for a storyline.
 *
 * Using one masthead's headline as the title would hand that paper the framing
 * for the whole group: the exact thing this page exists to expose. So the
 * label is built from the words every headline in the group shares, which
 * belongs to none of them. Where they share too little to be readable, the
 * shortest headline is used and the reader can see it is a headline.
 */
export type StorylineLabel =
  /** Words every headline in the group shares, so the phrase belongs to none of them. */
  | { text: string; kind: "shared" }
  /** No usable shared phrase, so one paper's headline stands in, named as theirs. */
  | { text: string; kind: "headline"; outletName: string };

export function labelFor(storyline: Storyline): StorylineLabel | null {
  const keys = storyline.stories.map((line) => keyOf(line.title));
  let shared = [...keys[0]];
  for (const key of keys.slice(1)) shared = shared.filter((word) => key.has(word));

  const byLength = [...storyline.stories].sort((a, b) => a.title.length - b.title.length);
  const shortest = byLength[0];
  const clean = shortest.title.replace(/\s*[–: -]\s*as it happened.*$/i, "");

  /**
   * Only an unbroken run of shared words is used.
   *
   * Picking out the shared words and closing the gaps reads well and is
   * sometimes false: three headlines about a temporary ban on data centres
   * share "temporary", "data" and "centres" but not "ban", and the phrase
   * that comes back is "temporary data centres", which is a different
   * subject. Anything dropped from the middle of a phrase can invert it, so
   * nothing is dropped from the middle of a phrase.
   */
  const words = clean.split(/\s+/);
  const isShared = (word: string) =>
    shared.includes(normalise(word).trim().replace(/\s+/g, ""));

  let best: string[] = [];
  let run: string[] = [];
  for (const word of words) {
    if (isShared(word)) {
      run.push(word);
      if (run.length > best.length) best = [...run];
    } else {
      run = [];
    }
  }

  if (best.length >= 2 && best.length <= 8) {
    const phrase = best
      .join(" ")
      .replace(/^[^\p{L}\p{N}]+/u, "")
      .replace(/[^\p{L}\p{N}'’]+$/u, "");
    if (phrase) {
      return { text: phrase.charAt(0).toUpperCase() + phrase.slice(1), kind: "shared" };
    }
  }

  /**
   * The documented fallback, which was never actually implemented: the
   * shortest headline, shown as a headline and attributed. Returning null
   * instead left almost every group titled "One story, 3 mastheads", because
   * the old span ran from the first shared word to the last and swept up
   * everything between them, so a subject named at the start and a key noun
   * at the end blew past the cap every time.
   */
  return { text: clean, kind: "headline", outletName: shortest.outletName };
}

export function coverageFor(subject: Subject, items: NewsItem[]): SubjectCoverage {
  const matched: MatchedStory[] = [];

  for (const item of items) {
    const haystack = normalise(`${item.title} ${item.summary ?? ""}`);
    const own = mentions(haystack, subject.own, subject.exclude);
    /**
     * A person's page carries only what names them.
     *
     * The linked half of a leader/party pair still works the other way round:
     * a story naming Burnham belongs on Labour's page, because he leads it.
     * The reverse does not hold. Every Labour story is not an Andy Burnham
     * story, and filing "Migrants invading Britain, Labour and leftie
     * judiciary" under his name says we think it is about him. Twelve of the
     * forty-eight stories on his page arrived that way.
     */
    const linked =
      !own &&
      subject.kind !== "person" &&
      subject.linked.length > 0 &&
      mentions(haystack, subject.linked, subject.exclude);
    if (!own && !linked) continue;

    const outlet = outletById[item.outlet];
    const bias = outlet?.bias ?? 0;
    matched.push({
      ...item,
      outletName: outlet?.name ?? item.outlet,
      bias,
      lean: leanOf(bias),
      via: own ? "own" : "linked",
      viaName: own ? undefined : subject.linkedName,
    });
  }

  // Group into storylines.
  const keyed = matched.map((story) => ({ story, key: keyOf(story.title) }));
  const taken = new Set<number>();
  const groups: MatchedStory[][] = [];

  for (let i = 0; i < keyed.length; i += 1) {
    if (taken.has(i)) continue;
    const group = [keyed[i].story];
    taken.add(i);
    for (let j = i + 1; j < keyed.length; j += 1) {
      if (taken.has(j)) continue;
      if (overlap(keyed[i].key, keyed[j].key) >= SAME_STORY) {
        group.push(keyed[j].story);
        taken.add(j);
      }
    }
    groups.push(group);
  }

  const storylines: Storyline[] = groups
    .filter((group) => group.length > 1)
    .map((group) => ({
      id: group[0].url,
      stories: group.sort((a, b) => a.bias - b.bias),
      left: group.filter((s) => s.lean === "left").length,
      centre: group.filter((s) => s.lean === "centre").length,
      right: group.filter((s) => s.lean === "right").length,
      latest: group.map((s) => s.publishedAt).sort().reverse()[0],
    }))
    .sort((a, b) => b.stories.length - a.stories.length);

  const singleStories = groups.filter((g) => g.length === 1).map((g) => g[0]);
  const singles: Record<Lean, MatchedStory[]> = { left: [], centre: [], right: [] };
  for (const story of singleStories) singles[story.lean].push(story);
  for (const lean of ["left", "centre", "right"] as Lean[]) {
    singles[lean].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  }

  return {
    subject,
    stories: matched,
    storylines,
    singles,
    own: matched.filter((s) => s.via === "own").length,
    linked: matched.filter((s) => s.via === "linked").length,
  };
}

/** Every subject with a count, for the index. Cheap: one pass per subject. */
export function subjectCounts(items: NewsItem[]) {
  return subjects
    .map((subject) => ({ subject, count: coverageFor(subject, items).stories.length }))
    .sort((a, b) => b.count - a.count);
}
