import type { NewsItem } from "@/lib/types";
import type { PhotoSlug } from "@/lib/photos";

/**
 * News topics.
 *
 * Stories arrive from RSS with no useful category field, so we sort them by
 * keyword into the handful of subjects British politics actually turns on.
 * The matcher is deliberately simple and readable: anything it cannot place
 * confidently goes to "Westminster" rather than being forced into a topic it
 * does not belong in.
 */

export type Topic = {
  id: string;
  name: string;
  /** One line a reader with no background knowledge can understand. */
  blurb: string;
  photo: PhotoSlug;
  alt: string;
  match: RegExp;
};

export const TOPICS: Topic[] = [
  {
    id: "immigration",
    name: "Immigration & asylum",
    blurb:
      "Channel crossings, the asylum backlog, hotels and removals — the issue polling consistently puts in the public's top three.",
    photo: "dover",
    alt: "The white cliffs and the Strait of Dover",
    match:
      /\b(immigration|migrant|migration|asylum|small boat|channel crossing|deport|refugee|border force|home office|visa|smuggl)/i,
  },
  {
    id: "economy",
    name: "Economy & tax",
    blurb:
      "The Budget, inflation, wages, borrowing and tax — what the government can afford and who pays for it.",
    photo: "economy",
    alt: "The Bank of England and the City of London",
    match:
      /\b(econom|budget|tax|inflation|chancellor|treasury|spending|fiscal|borrowing|interest rate|cost of living|wage|growth|gdp|obr|bank of england)/i,
  },
  {
    id: "health",
    name: "Health & the NHS",
    blurb:
      "Waiting lists, staffing, social care and the funding settlement — consistently among the issues voters rank most important.",
    photo: "health",
    alt: "St Thomas' Hospital on the Thames",
    match: /\b(nhs|health|hospital|doctor|gp |nurse|waiting list|social care|patient|ambulance|dentist)/i,
  },
  {
    id: "security",
    name: "Defence & security",
    blurb:
      "Defence spending, Ukraine, Russia, terrorism and the intelligence services — where the state's hard power is argued over.",
    photo: "royal-navy",
    alt: "A Royal Navy frigate at sea",
    match:
      /\b(defence|defense|military|army|navy|raf|nato|ukraine|russia|putin|terror|mi5|mi6|security service|spy|cyber|missile|troops|war)/i,
  },
  {
    id: "justice",
    name: "Law & order",
    blurb:
      "Policing, prisons, sentencing and the courts — including the prison-capacity pressure running through this Parliament.",
    photo: "justice",
    alt: "The Royal Courts of Justice",
    match:
      /\b(police|policing|crime|prison|sentenc|court|judge|justice|jail|offender|knife|criminal|law and order)/i,
  },
  {
    id: "energy",
    name: "Energy & environment",
    blurb:
      "Net zero, energy bills, and the argument over how fast Britain decarbonises and at whose expense.",
    photo: "energy",
    alt: "Offshore wind turbines",
    match:
      /\b(energy|net zero|climate|carbon|renewable|wind farm|solar|nuclear|electricity|gas bill|environment|water compan|sewage)/i,
  },
  {
    id: "elections",
    name: "Elections & polling",
    blurb:
      "By-elections, local and devolved contests, and the polling that everyone in Westminster reads every morning.",
    photo: "polling-station",
    alt: "A polling station sign",
    match: /\b(poll|by-election|byelection|election|ballot|vote share|voting intention|candidate|constituency|seat)/i,
  },
  {
    id: "westminster",
    name: "Westminster",
    blurb:
      "The parties, the leaders, reshuffles, resignations and everything else that happens inside the Palace and No.10.",
    photo: "westminster",
    alt: "The Palace of Westminster",
    match: /.*/,
  },
];

export const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** First topic whose pattern matches title + summary; Westminster catches the rest. */
export function classify(item: NewsItem): Topic {
  const haystack = `${item.title} ${item.summary ?? ""}`;
  return TOPICS.find((topic) => topic.id !== "westminster" && topic.match.test(haystack)) ?? topicById.westminster;
}

export type GroupedNews = { topic: Topic; items: NewsItem[] }[];

/** Groups stories by topic, largest topic first, dropping empty ones. */
export function groupByTopic(items: NewsItem[]): GroupedNews {
  const buckets = new Map<string, NewsItem[]>();
  for (const item of items) {
    const topic = classify(item);
    const list = buckets.get(topic.id) ?? [];
    list.push(item);
    buckets.set(topic.id, list);
  }
  return TOPICS.filter((t) => buckets.has(t.id))
    .map((topic) => ({ topic, items: buckets.get(topic.id) as NewsItem[] }))
    .sort((a, b) => b.items.length - a.items.length);
}
