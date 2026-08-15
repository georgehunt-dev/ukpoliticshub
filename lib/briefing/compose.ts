import { getNews } from "@/lib/news";
import { groupByTopic } from "@/lib/topics";
import { outletById } from "@/data/news";
import { partyBySlug } from "@/data/parties";
import { POLL_AVERAGE_AS_OF, POLL_AVERAGE_SOURCE, pollAverage } from "@/data/polls";
import { bestPrimeMinister, primeMinister, primeMinisterRatings } from "@/data/government";
import {
  RUSSIA_ASSESSED_ON,
  officialTerrorismThreat,
  russiaBand,
  russiaFactors,
  russiaScore,
} from "@/data/threat";
import { IMMIGRATION_AS_OF, crossingsYearToDate } from "@/data/immigration";
import { upcomingElections } from "@/data/elections";
import type { Source } from "@/lib/types";

/**
 * Composes the briefing from data the site already holds.
 *
 * The point of doing it this way rather than writing prose is that every
 * sentence is a template wrapped around a figure that already carries a
 * citation. It cannot invent a number, it regenerates with the feeds so it
 * cannot go stale, and when the feeds are down it says so rather than
 * describing a quiet news day that may not exist.
 *
 * What it deliberately does not do is judge. It will tell you Reform held a
 * seat and that turnout collapsed; it will not tell you the result proves
 * nothing. That is what the dated editorial section underneath is for.
 */

export type BriefingSection = {
  id: string;
  title: string;
  body: string;
  sources: Source[];
};

export type ComposedBriefing = {
  generatedAt: string;
  /** False when the live feeds could not be reached. */
  feedsLive: boolean;
  headline: string;
  standfirst: string;
  sections: BriefingSection[];
  topics: { id: string; name: string; count: number }[];
  spread: { left: number; centre: number; right: number };
};

const pct = (n: number) => `${n.toFixed(1)}%`;

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00Z`).getTime();
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.round((target - today) / 86_400_000));
}

export async function composeBriefing(): Promise<ComposedBriefing> {
  const { items, usingFallback, fetchedAt } = await getNews();
  const groups = groupByTopic(items);

  const spread = { left: 0, centre: 0, right: 0 };
  items.forEach((item) => {
    const bias = outletById[item.outlet]?.bias ?? 0;
    if (bias <= -3) spread.left += 1;
    else if (bias < 3) spread.centre += 1;
    else spread.right += 1;
  });

  const lead = pollAverage[0];
  const second = pollAverage[1];
  const third = pollAverage[2];
  const leadParty = partyBySlug[lead.party];
  const secondParty = partyBySlug[second.party];
  const thirdParty = partyBySlug[third.party];
  const gap = Number((lead.pct - second.pct).toFixed(1));
  const topThreeSpread = Number((lead.pct - third.pct).toFixed(1));

  const topTopic = groups[0];
  const topStory = items[0];

  // "Westminster" is the catch-all every unclassified story falls into, so it
  // is frequently the largest group without that meaning anything. The
  // headline uses the largest genuinely specific subject instead.
  const headlineTopic = groups.find((g) => g.topic.id !== "westminster") ?? topTopic;

  /* ── Headline ─────────────────────────────────────────────────────────
     Composed from two facts, never a judgement: what the press is leading
     on, and how tight the race is. */
  const headline = usingFallback
    ? `${leadParty.shortName} lead the average by ${gap} points`
    : `${headlineTopic.topic.name} leads the coverage, ${leadParty.shortName} lead the average by ${gap} points`;

  const standfirst = usingFallback
    ? "Live feeds could not be reached, so the press summary below is unavailable. Every other figure on this page is current."
    : `Assembled from ${plural(items.length, "story", "stories")} across the British press and the figures published on this site. Regenerates with the feeds.`;

  const sections: BriefingSection[] = [];

  /* ── The papers ────────────────────────────────────────────────────── */
  if (!usingFallback && topTopic && topStory) {
    const others = groups.slice(1, 4).map((g) => `${g.topic.name.toLowerCase()} (${g.items.length})`);
    sections.push({
      id: "papers",
      title: "What the papers are leading on",
      body:
        `${topTopic.topic.name} is the largest subject in today's coverage with ${plural(topTopic.items.length, "story", "stories")}, ` +
        `followed by ${others.join(", ")}. ` +
        `The most recent story carried is "${topStory.title}" in ${outletById[topStory.outlet]?.name ?? topStory.outlet}. ` +
        `Across all ${items.length}, ${spread.left} are from outlets we rate left of centre, ${spread.centre} centre and ${spread.right} right of centre.` +
        (topTopic.topic.id === "westminster"
          ? " Westminster is the catch-all for stories that do not fall into a specific subject, so its size says little on its own."
          : ""),
      sources: [],
    });
  }

  /* ── The standings ─────────────────────────────────────────────────── */
  sections.push({
    id: "standings",
    title: "The standings",
    body:
      `${leadParty.shortName} lead the rolling average on ${pct(lead.pct)}, ahead of ${secondParty.shortName} on ${pct(second.pct)} ` +
      `and ${thirdParty.shortName} on ${pct(third.pct)} — a spread of ${topThreeSpread} points across the top three. ` +
      `The lead over second place is ${gap} points, which is inside the margin of error of a typical poll, so the order between them is not settled.`,
    sources: [POLL_AVERAGE_SOURCE],
  });

  /* ── Downing Street ────────────────────────────────────────────────── */
  const opinium = primeMinisterRatings[0];
  const bestPM = bestPrimeMinister.options[0];
  const runnerUp = bestPrimeMinister.options[1];
  sections.push({
    id: "downing-street",
    title: "Downing Street",
    body:
      `${primeMinister.name} has been Prime Minister since ${new Date(primeMinister.since).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. ` +
      `${opinium.pollster} puts approval of him at ${opinium.approve}% against ${opinium.disapprove}% disapproving, a net of ${opinium.net != null && opinium.net > 0 ? "+" : ""}${opinium.net}. ` +
      `On who could best run the country he leads on ${bestPM.pct}%, ${bestPM.pct - runnerUp.pct} points clear of ${runnerUp.name}.`,
    sources: [opinium.source, bestPrimeMinister.source],
  });

  /* ── Security ──────────────────────────────────────────────────────── */
  const topFactor = [...russiaFactors].sort((a, b) => b.score - a.score)[0];
  sections.push({
    id: "security",
    title: "Security",
    body:
      `The official UK terrorism threat level is ${officialTerrorismThreat.level}, meaning ${officialTerrorismThreat.meaning}. ` +
      `Our own assessment of Russian pressure on the UK stands at ${russiaScore} out of 100 — ${russiaBand.label.toLowerCase()} — ` +
      `with the highest-scoring factor being ${topFactor.name.toLowerCase()} at ${topFactor.score}. ` +
      `That is a measure of sustained grey-zone pressure, not of imminent attack, and it is ours rather than the government's.`,
    sources: [officialTerrorismThreat.source],
  });

  /* ── The Channel ───────────────────────────────────────────────────── */
  const comparison = crossingsYearToDate.comparisons[0];
  sections.push({
    id: "crossings",
    title: "The Channel",
    body:
      `${crossingsYearToDate.total.toLocaleString("en-GB")} people have arrived by small boat so far in 2026, ` +
      `${Math.abs(comparison.change)}% ${comparison.change < 0 ? "below" : "above"} the ${comparison.value.toLocaleString("en-GB")} recorded by the same point in 2025. ` +
      `The figure is provisional and revised as the Home Office publishes.`,
    sources: [crossingsYearToDate.source],
  });

  /* ── The ballot box ────────────────────────────────────────────────── */
  const nextScheduled = upcomingElections.find((e) => e.certainty !== "deadline");
  const deadline = upcomingElections.find((e) => e.certainty === "deadline");
  if (nextScheduled && deadline) {
    sections.push({
      id: "elections",
      title: "Next at the ballot box",
      body:
        `The next scheduled contest is the ${nextScheduled.name.toLowerCase()} in ${daysUntil(nextScheduled.date).toLocaleString("en-GB")} days. ` +
        `A general election must be held within ${daysUntil(deadline.date).toLocaleString("en-GB")} days, though one may be called at any point before that.`,
      sources: [nextScheduled.source],
    });
  }

  return {
    generatedAt: fetchedAt,
    feedsLive: !usingFallback,
    headline,
    standfirst,
    sections,
    topics: groups.slice(0, 6).map((g) => ({
      id: g.topic.id,
      name: g.topic.name,
      count: g.items.length,
    })),
    spread,
  };
}

/** Dates the curated figures the composer leans on, so the page can show them. */
export const COMPOSED_DATA_AS_OF = {
  polls: POLL_AVERAGE_AS_OF,
  russia: RUSSIA_ASSESSED_ON,
  crossings: IMMIGRATION_AS_OF,
};
