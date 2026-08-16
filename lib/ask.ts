import { parties, partyBySlug } from "@/data/parties";
import { POLICY_AREAS } from "@/data/policy-areas";
import { GLOSSARY } from "@/data/glossary";
import { CONSTITUENCIES } from "@/lib/constituencies";
import { pollAverage, POLL_AVERAGE_AS_OF, POLL_AVERAGE_SOURCE } from "@/data/polls";
import { officialTerrorismThreat, russiaBand, russiaScore } from "@/data/threat";
import { crossingsYearToDate } from "@/data/immigration";
import { primeMinisterRatings } from "@/data/government";
import {
  areasIn,
  type FigureKey,
  figuresIn,
  normalise,
  partiesIn,
  tokenise,
} from "@/lib/ask-intent";
import type { PolicyArea } from "@/lib/types";

/**
 * Answering from what the site already publishes.
 *
 * The question is read for what it names — a party, a subject, a figure, a
 * constituency — and the answer is then looked up. Nothing is ranked by word
 * overlap and nothing is stitched together across subjects, because both of
 * those produced answers that were confidently about the wrong thing.
 *
 * Every branch returns the passage we already stand behind plus the page it
 * lives on. Where the question names nothing we hold, `covered` is false and
 * there is no answer at all.
 */

export type Source = { label: string; href: string };

export type Answer = {
  covered: boolean;
  answer: string;
  sources: Source[];
};

const areaName = new Map(POLICY_AREAS.map((a) => [a.id, a.name]));

const NOT_COVERED: Answer = {
  covered: false,
  answer:
    "We don't cover that yet. This bar only answers from pages we've already researched and sourced, so rather than guess at it we'd sooner say nothing — try asking about a party's position on an issue, a figure we track, or your own constituency.",
  sources: [],
};

/* ── Constituencies ─────────────────────────────────────────────────────── */

/**
 * Longest name first, so "Islington South and Finsbury" is matched before
 * "Islington North" can claim the "islington" in it.
 */
const SEATS_BY_LENGTH = [...CONSTITUENCIES]
  .filter((seat) => seat.mp)
  .sort((a, b) => b.name.length - a.name.length);

function seatIn(question: string) {
  const haystack = normalise(question);
  return SEATS_BY_LENGTH.find((seat) => haystack.includes(` ${normalise(seat.name).trim()} `));
}

function seatAnswer(seat: (typeof CONSTITUENCIES)[number]): Answer {
  const mp = seat.mp!;
  const who = `${mp.name}${mp.party ? ` (${mp.party})` : ""}`;

  // Where a by-election has intervened the sitting member did not win the 2024
  // margin, so it must not be hung off their name.
  let how = "";
  if (seat.byElection) {
    how = " They were returned at a by-election held since the general election.";
  } else if (seat.election?.majorityPct != null) {
    how = ` They won the seat at the 2024 general election by ${seat.election.majorityPct.toFixed(1)} points.`;
  }

  return {
    covered: true,
    answer: `${seat.name} is represented by ${who}.${how}`,
    sources: [{ label: `${seat.name} constituency`, href: `/constituencies/${seat.slug}` }],
  };
}

/* ── Figures ────────────────────────────────────────────────────────────── */

function figureAnswer(key: FigureKey): Answer {
  switch (key) {
    case "polls": {
      const lead = Number((pollAverage[0].pct - pollAverage[1].pct).toFixed(1));
      const top = pollAverage
        .slice(0, 3)
        .map((entry) => `${partyBySlug[entry.party].shortName} on ${entry.pct}%`)
        .join(", ");
      return {
        covered: true,
        answer: `As of ${POLL_AVERAGE_AS_OF}, the rolling average of British Polling Council polls puts ${top} — a lead of ${lead} points. Source: ${POLL_AVERAGE_SOURCE.label}.`,
        sources: [{ label: "The polls", href: "/polls" }],
      };
    }
    case "terrorism":
      return {
        covered: true,
        answer: `The official UK terrorism threat level is ${officialTerrorismThreat.level}, meaning an attack is highly likely. That is the Home Office's own figure and we do not adjust it.`,
        sources: [{ label: "Threat level", href: "/threat" }],
      };
    case "russia":
      return {
        covered: true,
        answer: `Our own six-factor read puts Russian pressure on the UK at ${russiaScore} out of 100 — ${russiaBand.label}. This is our assessment rather than an official figure, and the six factors behind it are set out in full.`,
        sources: [{ label: "Russia pressure", href: "/threat" }],
      };
    case "crossings": {
      const change = crossingsYearToDate.comparisons[0].change;
      return {
        covered: true,
        answer: `${crossingsYearToDate.total.toLocaleString("en-GB")} people have crossed the Channel in small boats so far in 2026, ${Math.abs(change)}% ${change < 0 ? "lower" : "higher"} than the same point in 2025. Home Office figures.`,
        sources: [{ label: "Immigration tracker", href: "/immigration" }],
      };
    }
    case "pm-approval": {
      const pm = primeMinisterRatings[0];
      return {
        covered: true,
        answer: `The Prime Minister's net approval is ${pm.net != null && pm.net > 0 ? "+" : ""}${pm.net}, with ${pm.approve}% approving and ${pm.disapprove}% disapproving.`,
        sources: [{ label: "The Prime Minister", href: "/prime-minister" }],
      };
    }
    case "election-date":
      return {
        covered: true,
        answer:
          "The next general election must be held by 15 August 2029 at the latest. The full timetable, and the other elections due before it, are on the elections page.",
        sources: [{ label: "Upcoming elections", href: "/elections" }],
      };
  }
}

/* ── Parties and their positions ────────────────────────────────────────── */

function partyOnArea(slug: string, area: PolicyArea): Answer {
  const party = partyBySlug[slug as keyof typeof partyBySlug];
  const name = areaName.get(area) ?? area;
  const policy = party.policies.find((p) => p.area === area);

  if (!policy) {
    return {
      covered: true,
      answer: `We haven't been able to source a ${party.shortName} position on ${name.toLowerCase()} that we're confident enough to publish. The row is left blank on their page rather than filled with a guess — and that may be our gap as much as theirs.`,
      sources: [{ label: `${party.shortName} — party page`, href: `/parties/${party.slug}` }],
    };
  }

  const sources: Source[] = [
    { label: `${party.shortName} — ${name}`, href: `/parties/${party.slug}` },
  ];
  if (policy.source) sources.push({ label: policy.source.label, href: policy.source.url });

  return {
    covered: true,
    answer: `${party.shortName} on ${name.toLowerCase()}: ${policy.position}${
      policy.caveat ? ` Worth noting: ${policy.caveat}` : ""
    }`,
    sources,
  };
}

/** Every party on one subject — the comparison, in spectrum order. */
function allPartiesOnArea(area: PolicyArea): Answer {
  const name = areaName.get(area) ?? area;
  const ordered = [...parties].sort((a, b) => a.spectrum - b.spectrum);

  const lines = ordered.map((party) => {
    const policy = party.policies.find((p) => p.area === area);
    return `${party.shortName}: ${policy ? policy.summary : "no position we could source"}.`;
  });

  return {
    covered: true,
    answer: `${name}, party by party. ${lines.join(" ")}`,
    sources: [{ label: `Compare — ${name}`, href: `/compare/${area}` }],
  };
}

function partyOverview(slug: string): Answer {
  const party = partyBySlug[slug as keyof typeof partyBySlug];
  return {
    covered: true,
    answer: `${party.name} is led by ${party.leader.name}. ${party.spectrumNote}`,
    sources: [{ label: `${party.shortName} — party page`, href: `/parties/${party.slug}` }],
  };
}

/* ── Glossary ───────────────────────────────────────────────────────────── */

function glossaryIn(question: string) {
  const haystack = normalise(question);
  const entries = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length);
  return entries.find((entry) =>
    [entry.term, ...(entry.aliases ?? [])].some((term) =>
      haystack.includes(` ${normalise(term).trim()} `)
    )
  );
}

/**
 * "What is ILR?" wants the definition, not six parties' asylum policies —
 * even though ILR is also an immigration keyword. A question phrased as a
 * request for a meaning is answered from the glossary first.
 */
const DEFINITIONAL =
  /\b(what (is|are|does|do)|whats|meaning of|define|definition of|stands for|explain)\b/;

/* ── The router ─────────────────────────────────────────────────────────── */

export function answer(question: string): Answer {
  if (!tokenise(question).length) return NOT_COVERED;

  const seat = seatIn(question);
  const partySlugs = partiesIn(question);
  const areas = areasIn(question);
  const figures = figuresIn(question);

  // A named seat is the most specific thing a question can contain.
  if (seat) return seatAnswer(seat);

  // Asking what a term means, with no party in the question.
  if (DEFINITIONAL.test(normalise(question)) && !partySlugs.length) {
    const term = glossaryIn(question);
    if (term) {
      return {
        covered: true,
        answer: `${term.term}: ${term.definition}`,
        sources: [{ label: "How we work — glossary", href: "/how-we-work" }],
      };
    }
  }

  // A party and a subject together: exactly one passage, no stitching.
  if (partySlugs.length === 1 && areas.length >= 1) {
    return partyOnArea(partySlugs[0], areas[0]);
  }

  // Several parties named on one subject: the comparison.
  if (partySlugs.length > 1 && areas.length >= 1) {
    const name = areaName.get(areas[0]) ?? areas[0];
    const lines = partySlugs.map((slug) => {
      const party = partyBySlug[slug as keyof typeof partyBySlug];
      const policy = party.policies.find((p) => p.area === areas[0]);
      return `${party.shortName}: ${policy ? policy.summary : "no position we could source"}.`;
    });
    return {
      covered: true,
      answer: `${name}. ${lines.join(" ")}`,
      sources: [{ label: `Compare — ${name}`, href: `/compare/${areas[0]}` }],
    };
  }

  // A figure we track, asked about on its own.
  if (figures.length && !areas.length && partySlugs.length !== 1) {
    return figureAnswer(figures[0]);
  }

  // A subject with no party named: every party's position on it.
  if (areas.length) {
    // "How many Channel crossings" reads as immigration, but it is asking for
    // the number, not the politics.
    if (figures.length && figures[0] === "crossings") return figureAnswer("crossings");
    return allPartiesOnArea(areas[0]);
  }

  if (figures.length) return figureAnswer(figures[0]);

  // A party with no subject named.
  if (partySlugs.length === 1) return partyOverview(partySlugs[0]);

  // A term we define.
  const entry = glossaryIn(question);
  if (entry) {
    return {
      covered: true,
      answer: `${entry.term}: ${entry.definition}`,
      sources: [{ label: "How we work — glossary", href: "/how-we-work" }],
    };
  }

  return NOT_COVERED;
}
