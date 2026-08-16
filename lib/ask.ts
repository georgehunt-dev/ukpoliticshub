import { parties } from "@/data/parties";
import { POLICY_AREAS } from "@/data/policy-areas";
import { GLOSSARY } from "@/data/glossary";
import { CONSTITUENCIES } from "@/lib/constituencies";
import { pollAverage, POLL_AVERAGE_AS_OF, POLL_AVERAGE_SOURCE } from "@/data/polls";
import { officialTerrorismThreat, russiaBand, russiaScore } from "@/data/threat";
import { crossingsYearToDate } from "@/data/immigration";
import { primeMinisterRatings } from "@/data/government";

/**
 * The corpus behind the ask bar.
 *
 * Every entry is something the site already publishes, with the page it lives
 * on. Nothing is generated here and nothing is inferred: an answer is a
 * passage we already stand behind, handed back with the link that lets the
 * reader check it. Where nothing scores well enough, the caller says we do not
 * cover it — which is the whole point. A confident wrong answer on the front
 * page would undo the promise every other page keeps.
 */

export type Passage = {
  /** What this passage is about, used for matching. */
  terms: string;
  /** The sentence(s) handed back to the reader. */
  text: string;
  label: string;
  href: string;
};

function partyPassages(): Passage[] {
  const out: Passage[] = [];
  const areaName = new Map(POLICY_AREAS.map((a) => [a.id, a.name]));

  for (const party of parties) {
    out.push({
      terms: `${party.name} ${party.shortName} ${party.leader.name} leader party spectrum position`,
      text: `${party.name} is led by ${party.leader.name}. ${party.spectrumNote}`,
      label: `${party.shortName} — party page`,
      href: `/parties/${party.slug}`,
    });

    for (const policy of party.policies) {
      const area = areaName.get(policy.area) ?? policy.area;
      out.push({
        terms: `${party.name} ${party.shortName} ${area} ${policy.area} ${policy.summary}`,
        text: `${party.shortName} on ${area.toLowerCase()}: ${policy.position}`,
        label: `${party.shortName} — ${area}`,
        href: `/parties/${party.slug}`,
      });
    }
  }
  return out;
}

function areaPassages(): Passage[] {
  return POLICY_AREAS.map((area) => ({
    terms: `${area.name} ${area.id} compare parties side by side ${area.question}`,
    text: `${area.name}: ${area.question} Every party's position is set out side by side on the comparison page.`,
    label: `Compare — ${area.name}`,
    href: `/compare/${area.id}`,
  }));
}

function glossaryPassages(): Passage[] {
  return GLOSSARY.map((entry) => ({
    terms: `${entry.term} ${(entry.aliases ?? []).join(" ")} what is means definition`,
    text: `${entry.term}: ${entry.definition}`,
    label: `How we work — glossary`,
    href: "/how-we-work",
  }));
}

function constituencyPassages(): Passage[] {
  return CONSTITUENCIES.filter((seat) => seat.mp).map((seat) => {
    const who = `${seat.mp!.name}${seat.mp!.party ? ` (${seat.mp!.party})` : ""}`;

    /**
     * Where a by-election has been held, the sitting member is not the person
     * who won in 2024 — so the 2024 margin must not be hung off their name.
     * Six seats are in that position and each of them would otherwise read as
     * a plain falsehood.
     */
    let how = "";
    if (seat.byElection) {
      how = ` They were returned at a by-election held since the general election; the full result for both is on the seat's page.`;
    } else if (seat.election?.majorityPct != null) {
      how = ` They won the seat at the 2024 general election by ${seat.election.majorityPct.toFixed(1)} points.`;
    }

    return {
      terms: `${seat.name} constituency seat mp member of parliament who represents ${seat.mp!.name}`,
      text: `${seat.name} is represented by ${who}.${how}`,
      label: `${seat.name} constituency`,
      href: `/constituencies/${seat.slug}`,
    };
  });
}

function figurePassages(): Passage[] {
  const pm = primeMinisterRatings[0];
  const lead = Number((pollAverage[0].pct - pollAverage[1].pct).toFixed(1));
  const drop = Math.abs(crossingsYearToDate.comparisons[0].change);

  return [
    {
      terms: "poll polls polling average race for number 10 who is leading ahead standings",
      text: `As of ${POLL_AVERAGE_AS_OF}, the rolling average of British Polling Council polls puts ${pollAverage
        .slice(0, 3)
        .map((entry) => `${entry.party} on ${entry.pct}%`)
        .join(", ")} — a lead of ${lead} points. Source: ${POLL_AVERAGE_SOURCE.label}.`,
      label: "The polls",
      href: "/polls",
    },
    {
      terms: "terrorism threat level severe attack likely security",
      text: `The official UK terrorism threat level is ${officialTerrorismThreat.level}, meaning an attack is highly likely. This is the Home Office's own figure and we do not adjust it.`,
      label: "Threat level",
      href: "/threat",
    },
    {
      terms: "russia russian pressure threat score sabotage hybrid",
      text: `Our own six-factor read puts Russian pressure on the UK at ${russiaScore} out of 100 — ${russiaBand.label}. This is our assessment, not an official figure, and the six factors behind it are set out in full.`,
      label: "Russia pressure",
      href: "/threat",
    },
    {
      terms: "channel crossings small boats immigration asylum backlog how many",
      text: `${crossingsYearToDate.total.toLocaleString("en-GB")} people have crossed the Channel in small boats so far in 2026, ${drop}% ${
        crossingsYearToDate.comparisons[0].change < 0 ? "lower" : "higher"
      } than the same point in 2025. Home Office figures.`,
      label: "Immigration tracker",
      href: "/immigration",
    },
    {
      terms: "prime minister approval rating popular net approve disapprove",
      text: `The Prime Minister's net approval is ${pm.net != null && pm.net > 0 ? "+" : ""}${pm.net}, with ${pm.approve}% approving and ${pm.disapprove}% disapproving.`,
      label: "The Prime Minister",
      href: "/prime-minister",
    },
    {
      terms: "next general election when due date deadline days",
      text: "The next general election must be held by 15 August 2029 at the latest. The full timetable, and the other elections due before it, are on the elections page.",
      label: "Upcoming elections",
      href: "/elections",
    },
  ];
}

let cached: Passage[] | null = null;

export function corpus(): Passage[] {
  if (!cached) {
    cached = [
      ...figurePassages(),
      ...partyPassages(),
      ...areaPassages(),
      ...glossaryPassages(),
      ...constituencyPassages(),
    ];
  }
  return cached;
}

/** Words too common to carry meaning in a question about British politics. */
const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "was", "were",
  "what", "which", "who", "whom", "how", "why", "when", "where", "do", "does", "did", "can",
  "i", "my", "me", "we", "our", "you", "your", "it", "its", "they", "their", "this", "that",
  "about", "with", "from", "at", "by", "be", "been", "have", "has", "had", "as", "if", "so",
  "much", "many", "any", "all", "s", "uk", "britain", "british", "politics",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP.has(word));
}

export type Match = { passage: Passage; score: number };

/**
 * Plain term-overlap scoring, weighted toward rarer words.
 *
 * Deliberately simple and deliberately strict: it is better to decline a
 * question we could half-answer than to return a passage that merely shares
 * some vocabulary with it.
 */
export function search(question: string, limit = 3): Match[] {
  const asked = tokens(question);
  if (!asked.length) return [];

  const all = corpus();

  // Document frequency, so "labour" counts for less than "leasehold".
  const df = new Map<string, number>();
  for (const passage of all) {
    for (const word of new Set(tokens(passage.terms))) {
      df.set(word, (df.get(word) ?? 0) + 1);
    }
  }

  const scored: Match[] = [];
  for (const passage of all) {
    const bag = new Set(tokens(passage.terms));
    let score = 0;
    for (const word of asked) {
      if (!bag.has(word)) continue;
      const rarity = Math.log(all.length / (df.get(word) ?? all.length));
      score += Math.max(rarity, 0.2);
    }
    if (score > 0) scored.push({ passage, score: score / Math.sqrt(asked.length) });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * The bar below which we say we do not cover something. Set by hand against
 * real questions: high enough that a stray shared word cannot trigger an
 * answer, low enough that a plainly-worded question about our own content does.
 */
export const COVERAGE_THRESHOLD = 1.15;
