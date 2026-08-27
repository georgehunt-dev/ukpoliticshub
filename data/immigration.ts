import type { Source } from "@/lib/types";

/**
 * Irregular migration tracker.
 *
 * Terminology note, because it matters here more than anywhere else on the
 * site: the government's own statistical term is "irregular migration", and
 * arriving to claim asylum is not in itself a criminal offence. Much of the
 * press and several parties say "illegal immigration". We use the official
 * term in our own words, explain it plainly, and quote whichever term a
 * source used. That is a neutrality decision, not a political one.
 *
 * Every figure below is a published Home Office or Commons Library statistic.
 * We do not model, project or estimate anything on this page.
 */

export const IMMIGRATION_AS_OF = "2026-08-14";

const YEAR_TO_DATE_TOTAL = 15242;

/**
 * Percentage change from a published same-point figure to this year's, in
 * whole points. Derived rather than stored: all three numbers are printed
 * side by side, so a reader can check the arithmetic in their head, and a
 * hand-written percentage silently stops matching the totals it describes the
 * first time one of them is refreshed without the other. This is arithmetic on
 * two published figures, not a figure of our own.
 */
function changeOnSamePoint(previous: number): number {
  return Math.round(((YEAR_TO_DATE_TOTAL - previous) / previous) * 100);
}

export const crossingsYearToDate = {
  total: YEAR_TO_DATE_TOTAL,
  label: "People arriving by small boat in 2026 so far",
  provisional: true,
  comparisons: [
    { label: "Same point in 2025", value: 25436, change: changeOnSamePoint(25436) },
    { label: "Same point in 2024", value: 16903, change: changeOnSamePoint(16903) },
  ],
  note: "Boats successfully crossing are down 49% on last year: a bigger fall than the fall in people, meaning the boats that do cross are more crowded.",
  source: {
    label: "Home Office, small boat activity in the English Channel",
    url: "https://www.gov.uk/government/publications/migrants-detected-crossing-the-english-channel-in-small-boats",
    date: "2026-08-13",
  } satisfies Source,
};

/** Final Home Office totals for each completed calendar year, as published.
 *  The type still allows null so a year can be left blank rather than guessed
 *  if a clean figure is ever genuinely unavailable. */
export const crossingsByYear: { year: number; total: number | null; note?: string }[] = [
  { year: 2022, total: 45774, note: "Record year" },
  { year: 2023, total: 29437, note: "Down 36% on 2022" },
  { year: 2024, total: 36816, note: "Up 25% on 2023" },
  { year: 2025, total: 41472, note: "Up 13% on 2024: second highest on record" },
  { year: 2026, total: 15242, note: "Year to date, provisional" },
];

export const crossingsByYearSource: Source = {
  label: "House of Commons Library, statistics on small boat Channel crossings",
  url: "https://commonslibrary.parliament.uk/research-briefings/cbp-10590/",
  date: "2026-08-01",
};

export const crossingsYearNote =
  "Each completed year is the Home Office's final total for that calendar year. The 2026 row is a running year-to-date count and is not comparable with the full years above it: the two are easy to confuse, and a part-year tally read as an annual total is the mistake to watch for. The wider irregular-migration figure is larger than the small-boat figure in every year, because small boats are roughly 89% of detected irregular arrivals rather than all of them.";

/** The wider system, so the headline number is not read in isolation. */
export const asylumSystem: {
  label: string;
  value: string;
  change?: string;
  detail: string;
  source: Source;
}[] = [
  {
    label: "Awaiting an initial asylum decision",
    value: "48,758",
    change: "−55% year on year",
    detail:
      "At the end of March 2026, down from 109,536 a year earlier as the Home Office cleared initial decisions faster.",
    source: {
      label: "Migration Observatory, asylum accommodation in the UK",
      url: "https://migrationobservatory.ox.ac.uk/resources/briefings/asylum-accommodation-in-the-uk/",
      date: "2026-03-31",
    },
  },
  {
    label: "Housed in asylum hotels",
    value: "20,885",
    change: "−35% year on year",
    detail:
      "21% of the 98,000 people in asylum accommodation at the end of March 2026, down from 42% in hotels in March 2023.",
    source: {
      label: "Migration Observatory, asylum accommodation in the UK",
      url: "https://migrationobservatory.ox.ac.uk/resources/briefings/asylum-accommodation-in-the-uk/",
      date: "2026-03-31",
    },
  },
  {
    label: "Asylum-related returns",
    value: "11,631",
    change: "+23% year on year",
    detail: "31% of all returns from the UK in 2026: people removed or leaving after a refused claim.",
    source: {
      label: "Migration Observatory, returns and removals",
      url: "https://migrationobservatory.ox.ac.uk/resources/briefings/asylum-accommodation-in-the-uk/",
      date: "2026-06-30",
    },
  },
];

/** Context a newcomer needs before reading any of the numbers above. */
export const plainEnglish = [
  {
    q: "What counts as “irregular” arrival?",
    a: "Arriving without prior permission: overwhelmingly by small boat across the Channel, plus smaller numbers detected at ports or arriving by air without adequate documents. In 2025 small boats were about 89% of all such detections.",
  },
  {
    q: "Is claiming asylum illegal?",
    a: "No. Claiming asylum is lawful under the Refugee Convention regardless of how someone entered, which is why official statistics say “irregular” rather than “illegal”. Entering without permission can be a separate offence, and whether it should be prosecuted is a live political argument.",
  },
  {
    q: "Why do the numbers jump around so much?",
    a: "Crossings are highly weather-dependent: a single calm week can produce more arrivals than a stormy month. Day-to-day figures are close to meaningless; the year-to-date comparison is the number worth watching.",
  },
];

/** How each of the six parties would handle it, in their own stated terms. */
export const partyPositions: { party: string; position: string }[] = [
  {
    party: "labour",
    position:
      "Enforcement co-operation with France and faster asylum processing to cut the backlog and hotel use. Points to the year-on-year fall shown above as evidence the approach is working.",
  },
  {
    party: "reform",
    position:
      "Treats crossings as the central issue in British politics and calls for sharply tougher deterrence and removals; argues falls are weather and French enforcement rather than government policy.",
  },
  {
    party: "conservative",
    position:
      "Argues the fall does not go far enough and that a removals-based deterrent is needed, having pursued that approach in government to 2024.",
  },
  {
    party: "liberal-democrats",
    position:
      "Emphasises safe and legal routes and faster decision-making, arguing that deterrence-first policy has repeatedly failed to reduce crossings.",
  },
  {
    party: "green",
    position:
      "Opposes deterrence-based policy outright, favouring expanded safe routes and an end to hotel-based accommodation.",
  },
  {
    party: "restore-britain",
    position:
      "The furthest-reaching position of the six: large-scale deportation of people in the UK without permission, and a net-negative immigration target overall.",
  },
];

export const trackerCaveat =
  "Figures are official Home Office and Commons Library statistics, reproduced as published. Daily small-boat data is provisional and revised. We publish no estimate, projection or figure of our own on this page.";
