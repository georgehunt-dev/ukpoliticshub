import type { Source, ThreatFactor } from "@/lib/types";
import type { PhotoSlug } from "@/lib/photos";
import { russiaCaveat, RUSSIA_ASSESSED_ON } from "@/data/threat";
import { factorById, type Reading } from "@/data/threat-model";
import { READINGS_BY_SLUG } from "@/data/threat-readings";

/**
 * The shared model stores a score per question; the page renders a list of
 * named, weighted factors. This is the join between them — the name and the
 * weight come from the model, so a state cannot quietly carry its own.
 */
function factorsFrom(readings: Reading[]): ThreatFactor[] {
  return readings.map((reading) => {
    const definition = factorById(reading.factor);
    return {
      name: definition.name,
      score: reading.score,
      weight: definition.weight,
      evidence:
        reading.evidence ??
        "We hold no sourced evidence against this question for this state.",
      sources: reading.sources,
    };
  });
}

/**
 * The UK's threats and its alliances, on one scale each.
 *
 * The Russia score was the only state assessment on the site. This widens it,
 * using the same method: each factor scored 0–100 on its own evidence, then
 * weighted, weights summing to 100. Conservative throughout — documented
 * grey-zone activity is not an imminent-attack warning, and a strained
 * alliance is not a broken one.
 *
 * Two things keep this honest. Where the UK government has made a formal
 * designation we print it and score against it rather than around it: Russia
 * and Iran sit on the enhanced tier of the Foreign Influence Registration
 * Scheme and China does not, which is the clearest official signal available
 * about how the UK ranks them. And where the subject rejects the
 * characterisation, the rejection is printed next to the assessment.
 *
 * None of this is a government figure. The only official number on the threat
 * page is the JTAC terrorism level.
 */

export type Assessment = {
  slug: string;
  name: string;
  /**
   * A civic landmark, not anything loaded. A threat assessment illustrated
   * with soldiers or flags editorialises before a word has been read.
   */
  photo: PhotoSlug;
  photoAlt: string;
  /** "threat" scores pressure on the UK; "partnership" scores what the UK can rely on. */
  kind: "threat" | "partnership";
  /** One sentence for the index row. */
  summary: string;
  /** The fuller read, shown on the assessment itself. */
  standfirst: string;
  factors: ThreatFactor[];
  assessedOn: string;
  /** A formal UK designation, where one exists. Official, not ours. */
  official?: { label: string; detail: string; source: Source };
  /** The subject's own rejection of the characterisation, where it has made one. */
  dispute?: { text: string; source?: Source };
};

export const THREAT_BANDS = [
  { min: 0, max: 19, label: "Low", note: "No sustained state-level pressure evident." },
  { min: 20, max: 39, label: "Moderate", note: "Persistent hostile activity, largely routine in scale." },
  { min: 40, max: 59, label: "Elevated", note: "Sustained grey-zone pressure across several domains." },
  { min: 60, max: 79, label: "High", note: "Intensifying activity with direct risk to UK interests." },
  { min: 80, max: 100, label: "Severe", note: "Pressure approaching or crossing into open confrontation." },
] as const;

export const PARTNERSHIP_BANDS = [
  { min: 0, max: 19, label: "Broken", note: "Cooperation has effectively stopped." },
  { min: 20, max: 39, label: "Strained", note: "Working relations only, with real friction." },
  { min: 40, max: 59, label: "Functional", note: "Solid where it is institutionalised, uneven elsewhere." },
  { min: 60, max: 79, label: "Strong", note: "Deep commitments, honoured in practice." },
  { min: 80, max: 100, label: "Very strong", note: "Integrated to the point of interdependence." },
] as const;

/* ── Threats ──────────────────────────────────────────────────────────── */

/* ── Partnerships ─────────────────────────────────────────────────────── */

const usFactors: ThreatFactor[] = [
  {
    name: "Intelligence sharing",
    score: 85,
    weight: 25,
    evidence:
      "The Five Eyes partnership remains the deepest and most institutionalised part of the relationship, and continued to operate jointly through 2026 — the partners issued a joint bulletin on Chinese intelligence recruitment in June 2026. Nothing in the public record suggests the political friction below has reached it.",
    sources: [
      {
        label: "House of Commons Library — Chinese state threat activities in the UK",
        url: "https://commonslibrary.parliament.uk/research-briefings/cbp-10417/",
        date: "2026-06-03",
      },
    ],
  },
  {
    name: "Defence and nuclear ties",
    score: 80,
    weight: 20,
    evidence:
      "The nuclear and defence-industrial relationship is treaty-based and long-run, and is the part of the partnership least exposed to a change of administration.",
    sources: [
      {
        label: "Institute for Government — The US-UK special relationship",
        url: "https://www.instituteforgovernment.org.uk/explainer/us-uk-special-relationship",
        date: "2026-01-01",
      },
    ],
  },
  {
    name: "Trade terms",
    score: 45,
    weight: 20,
    evidence:
      "The Economic Prosperity Deal agreed in May 2025 capped most additional US tariffs on UK goods at 10% and gave relief on steel and cars. In 2026 the President warned that the deal could be torn up. A deal that exists but is publicly conditional is worth less than one that is settled.",
    sources: [
      {
        label: "Congressional Research Service — US-UK trade relations",
        url: "https://www.congress.gov/crs-product/R49037",
        date: "2026-01-01",
      },
      {
        label: "CNBC — The US-UK special relationship sours ahead of royal visit to Washington",
        url: "https://www.cnbc.com/2026/04/18/us-uk-special-relationship-trump-starmer-king-charles.html",
        date: "2026-04-18",
      },
    ],
  },
  {
    name: "Political alignment",
    score: 30,
    weight: 20,
    evidence:
      "The President has criticised NATO allies over Iran and singled out the UK, denigrating its military and its domestic and foreign policies and questioning its loyalty. Rhetoric is not policy, but sustained public criticism from the head of the allied government is a real cost to the relationship and is scored as one.",
    sources: [
      {
        label: "CNBC — The US-UK special relationship sours ahead of royal visit to Washington",
        url: "https://www.cnbc.com/2026/04/18/us-uk-special-relationship-trump-starmer-king-charles.html",
        date: "2026-04-18",
      },
    ],
  },
  {
    name: "Operational alignment",
    score: 45,
    weight: 15,
    evidence:
      "The UK declined to join offensive US and Israeli action against Iran in late February 2026, then provided defensive support for UK bases and allies in the region from early March. Divergence on the offensive question, convergence on defence of shared assets.",
    sources: [
      {
        label: "CNBC — The US-UK special relationship sours ahead of royal visit to Washington",
        url: "https://www.cnbc.com/2026/04/18/us-uk-special-relationship-trump-starmer-king-charles.html",
        date: "2026-04-18",
      },
    ],
  },
];

const natoFactors: ThreatFactor[] = [
  {
    name: "Spending against the agreed target",
    score: 60,
    weight: 25,
    evidence:
      "NATO members agreed in July 2025 to reach 5% of GDP by 2035 — 3.5% on core defence and 1.5% on related security. The UK spent 2.3% in 2024 and has committed to 2.5% by 2027, 3% in the next Parliament and 3.5% by 2035. On the core measure the UK is on a stated path to the target; it is not there yet, and the later commitments fall beyond this Parliament.",
    sources: [
      {
        label: "Institute for Government — UK defence spending",
        url: "https://www.instituteforgovernment.org.uk/explainer/uk-defence-spending",
        date: "2026-01-01",
      },
      {
        label: "House of Commons Library — UK defence spending",
        url: "https://commonslibrary.parliament.uk/research-briefings/cbp-8175/",
        date: "2026-01-01",
      },
    ],
  },
  {
    name: "Operational contribution",
    score: 75,
    weight: 25,
    evidence:
      "The UK remains one of the alliance's principal contributors of deployable capability, and its own naval activity around UK waters — 116 Royal Navy activations in 2025–26 — is conducted as part of that posture.",
    sources: [
      {
        label: "UK Defence Journal — Royal Navy shadowed 61 Russian warships around UK waters",
        url: "https://ukdefencejournal.org.uk/royal-navy-shadowed-61-russian-warships-around-uk-waters/",
        date: "2026-06-01",
      },
    ],
  },
  {
    name: "Alliance cohesion",
    score: 50,
    weight: 20,
    evidence:
      "Public criticism of allies by the US administration over the Iran conflict, and questions raised about the UK specifically, are a strain on cohesion at the political level even where military integration is unaffected.",
    sources: [
      {
        label: "CNBC — The US-UK special relationship sours ahead of royal visit to Washington",
        url: "https://www.cnbc.com/2026/04/18/us-uk-special-relationship-trump-starmer-king-charles.html",
        date: "2026-04-18",
      },
    ],
  },
  {
    name: "Nuclear contribution",
    score: 80,
    weight: 15,
    evidence:
      "The UK is one of the alliance's three nuclear powers and the deterrent is committed to NATO. This is the most stable element of the UK's contribution and the least sensitive to the year's politics.",
    sources: [
      {
        label: "Institute for Government — UK defence spending",
        url: "https://www.instituteforgovernment.org.uk/explainer/uk-defence-spending",
        date: "2026-01-01",
      },
    ],
  },
  {
    name: "Delivery against the Strategic Defence Review",
    score: 55,
    weight: 15,
    evidence:
      "The Strategic Defence Review set out capability ambitions on the argument that they can be delivered within the planned spending increase. Independent analysis has questioned whether the money covers the commitments. Stated intent is clear; delivery is not yet demonstrated.",
    sources: [
      {
        label: "IFS — UK defence spending: composition, commitments and challenges",
        url: "https://ifs.org.uk/publications/uk-defence-spending-composition-commitments-and-challenges",
        date: "2025-09-01",
      },
      {
        label: "Chatham House — Will Britain face up to its huge new defence bill?",
        url: "https://www.chathamhouse.org/publications/the-world-today/2026-03/will-britain-face-its-huge-new-defence-bill",
        date: "2026-03-01",
      },
    ],
  },
];

const europeFactors: ThreatFactor[] = [
  {
    name: "The Franco-British treaty framework",
    score: 75,
    weight: 25,
    evidence:
      "Defence cooperation with France runs on the 2010 Lancaster House treaties, the most structural part of the bilateral relationship, since modernised in a follow-on agreement. Treaty-based and durable across changes of government on both sides.",
    sources: [
      {
        label: "House of Commons Library — UK-French defence cooperation: a decade on from Lancaster House",
        url: "https://commonslibrary.parliament.uk/research-briefings/cbp-9743/",
        date: "2026-01-01",
      },
      {
        label: "House of Commons Library — UK relations with France",
        url: "https://commonslibrary.parliament.uk/research-briefings/cdp-2026-0005/",
        date: "2026-01-01",
      },
    ],
  },
  {
    name: "The EU Security and Defence Partnership",
    score: 60,
    weight: 25,
    evidence:
      "The UK and EU signed a Security and Defence Partnership at the first EU-UK summit on 19 May 2025, providing for regular cooperation on maritime, space and cyber security among other areas. A framework for talking, newly established and not yet long-tested.",
    sources: [
      {
        label: "ECFR — Channelling security: a new era for EU-UK defence cooperation",
        url: "https://ecfr.eu/article/channelling-security-a-new-era-for-eu-uk-defence-cooperation/",
        date: "2025-05-19",
      },
    ],
  },
  {
    name: "Defence-industrial integration",
    score: 35,
    weight: 20,
    evidence:
      "Talks on UK participation in the EU's €150bn SAFE defence-procurement instrument collapsed in November 2025, with the UK citing value for money, and the UK is not joining the EU's new defence fund. This is where the reset has most clearly not delivered, and it is the weakest part of the picture.",
    sources: [
      {
        label: "Chatham House — The UK will not join the EU's new defence fund",
        url: "https://www.chathamhouse.org/2025/12/uk-will-not-join-eus-new-defence-fund-can-uk-eu-security-reset-still-succeed",
        date: "2025-12-01",
      },
    ],
  },
  {
    name: "Practical cooperation",
    score: 60,
    weight: 15,
    evidence:
      "Cooperation on maritime security, undersea infrastructure and support to Ukraine continues at working level and is where most of the day-to-day value sits.",
    sources: [
      {
        label: "Parliament — The UK contribution to European security: government response",
        url: "https://publications.parliament.uk/pa/cm5901/cmselect/cmdfence/1658/report.html",
        date: "2026-01-01",
      },
    ],
  },
  {
    name: "Trajectory",
    score: 55,
    weight: 15,
    evidence:
      "A further EU-UK summit was scheduled for spring 2026 to take stock of the reset, including the areas where progress had not been made. Direction of travel is toward closer cooperation; the pace is disputed.",
    sources: [
      {
        label: "ECFR — Channelling security: a new era for EU-UK defence cooperation",
        url: "https://ecfr.eu/article/channelling-security-a-new-era-for-eu-uk-defence-cooperation/",
        date: "2025-05-19",
      },
    ],
  },
];

/* ── The assessments ──────────────────────────────────────────────────── */

const ASSESSED_ON = "2026-08-16";

export const assessments: Assessment[] = [
  {
    slug: "russia",
    name: "Russia",
    photo: "russia",
    photoAlt: "The walls of the Moscow Kremlin and the Spasskaya Tower",
    kind: "threat",
    summary: "Sustained grey-zone pressure on infrastructure, at sea and online.",
    standfirst:
      "Survey and submarine activity around UK undersea cables, a high tempo of naval transits shadowed in UK waters, and continuing sabotage and cyber activity. Not a warning of imminent attack: the Ukraine war still absorbs most Russian conventional capacity, and no UK national threat level has been raised on account of Russia.",
    factors: factorsFrom(READINGS_BY_SLUG.russia),
    assessedOn: RUSSIA_ASSESSED_ON,
    official: {
      label: "Enhanced tier, Foreign Influence Registration Scheme",
      detail:
        "Specified from 1 July 2025 — one of two states so designated. Any arrangement to act in the UK for the Russian state must be registered, commercial or political.",
      source: {
        label: "Sullivan & Cromwell — UK Foreign Influence Registration Scheme goes live",
        url: "https://www.sullcrom.com/insights/memo/2025/July/UK-Foreign-Influence-Registration-Scheme-Goes-Live",
        date: "2025-07-01",
      },
    },
    dispute: {
      text: "Russia's embassy in London has called the undersea-cable allegations \"completely groundless\".",
      source: {
        label: "Breaking Defense — UK accuses Russia of covert submarine operation threatening undersea cables",
        url: "https://breakingdefense.com/2026/04/uk-accuses-russia-of-covert-submarine-operation-threatening-undersea-cables/",
        date: "2026-04-01",
      },
    },
  },
  {
    slug: "iran",
    name: "Iran",
    photo: "iran",
    photoAlt: "The Azadi Tower in Tehran",
    kind: "threat",
    summary: "The most direct pressure of the three: plots against people living here.",
    standfirst:
      "More than twenty Iran-backed plots presenting potentially lethal threats to British citizens and residents since 2022, run substantially through criminal proxies. Iran sits alongside Russia on the enhanced tier of the Foreign Influence Registration Scheme. The score is held down by the disruption record: these plots are known because they were stopped.",
    factors: factorsFrom(READINGS_BY_SLUG.iran),
    assessedOn: ASSESSED_ON,
    official: {
      label: "Enhanced tier, Foreign Influence Registration Scheme",
      detail:
        "Specified from 1 July 2025, alongside Russia. The Islamic Revolutionary Guard Corps is not proscribed as a terrorist organisation, which remains a live argument in Parliament.",
      source: {
        label: "Sullivan & Cromwell — UK Foreign Influence Registration Scheme goes live",
        url: "https://www.sullcrom.com/insights/memo/2025/July/UK-Foreign-Influence-Registration-Scheme-Goes-Live",
        date: "2025-07-01",
      },
    },
  },
  {
    slug: "china",
    name: "China",
    photo: "china",
    photoAlt: "The Great Hall of the People, Beijing",
    kind: "threat",
    summary: "Broad espionage and cyber activity — but no top-tier UK designation.",
    standfirst:
      "Espionage alerts to parliamentarians, a Five Eyes bulletin on intelligence officers posing as recruiters, prosecutions for foreign interference, and continual cyber activity. What holds the score below Russia and Iran is that the UK has not placed China on the enhanced tier of the Foreign Influence Registration Scheme, having considered specifying selected state-linked bodies instead.",
    factors: factorsFrom(READINGS_BY_SLUG.china),
    assessedOn: ASSESSED_ON,
    dispute: {
      text: "China's government has lodged formal representations with the UK rejecting the espionage allegations.",
      source: {
        label: "GlobalSecurity — China lodges stern representations with the UK over espionage claims",
        url: "https://www.globalsecurity.org/intell/library/news/2025/intell-251119-globaltimes01.htm",
        date: "2025-11-19",
      },
    },
  },
  {
    slug: "united-states",
    name: "United States",
    photo: "united-states",
    photoAlt: "The United States Capitol, Washington DC",
    kind: "partnership",
    summary: "Institutionally deep, politically strained.",
    standfirst:
      "The split runs down the middle of this one. Intelligence sharing and the nuclear and defence-industrial relationship are treaty-based and appear unaffected; trade terms are conditional and have been publicly threatened, and the President has criticised the UK's military and policies directly. The parts held together by institutions are holding; the parts held together by politics are not.",
    factors: usFactors,
    assessedOn: ASSESSED_ON,
  },
  {
    slug: "nato",
    name: "NATO",
    photo: "nato",
    photoAlt: "NATO headquarters, Brussels",
    kind: "partnership",
    summary: "A leading contributor on a stated path to the new spending target.",
    standfirst:
      "The UK is one of three nuclear powers in the alliance and a principal contributor of deployable capability. It spent 2.3% of GDP on defence in 2024 against a target of 3.5% on core defence by 2035, with staged commitments in between — a credible path on paper, most of it falling beyond this Parliament, and questioned by independent analysts on affordability.",
    factors: natoFactors,
    assessedOn: ASSESSED_ON,
  },
  {
    slug: "europe",
    name: "France & the EU",
    photo: "europe-eu",
    photoAlt: "The Berlaymont building, seat of the European Commission",
    kind: "partnership",
    summary: "Treaty ties with France hold; the EU reset has stalled on procurement.",
    standfirst:
      "Defence cooperation with France rests on the Lancaster House treaties and is the most durable part of the picture. The EU Security and Defence Partnership signed in May 2025 gave the relationship a framework, but talks on joining the EU's €150bn defence-procurement instrument collapsed in November 2025 over value for money — which is where the reset has most clearly not delivered.",
    factors: europeFactors,
    assessedOn: ASSESSED_ON,
  },
];

/* ── Scoring ──────────────────────────────────────────────────────────── */

export function scoreOf(assessment: Assessment): number {
  return Math.round(
    assessment.factors.reduce((total, f) => total + f.score * f.weight, 0) / 100
  );
}

export function bandOf(assessment: Assessment) {
  const score = scoreOf(assessment);
  const bands = assessment.kind === "threat" ? THREAT_BANDS : PARTNERSHIP_BANDS;
  return bands.find((b) => score >= b.min && score <= b.max) ?? bands[0];
}

/** Weights must sum to 100 or the composite is not what it claims to be. */
export function weightsAreSound(assessment: Assessment): boolean {
  return assessment.factors.reduce((total, f) => total + f.weight, 0) === 100;
}

export const threats = assessments
  .filter((a) => a.kind === "threat")
  .sort((a, b) => scoreOf(b) - scoreOf(a));

export const partnerships = assessments
  .filter((a) => a.kind === "partnership")
  .sort((a, b) => scoreOf(b) - scoreOf(a));

export const assessmentBySlug = Object.fromEntries(
  assessments.map((a) => [a.slug, a])
) as Record<string, Assessment>;

export const STATES_CAVEAT = russiaCaveat;
