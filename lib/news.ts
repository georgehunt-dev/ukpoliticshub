import { XMLParser } from "fast-xml-parser";
import { fallbackNews, outlets } from "@/data/news";
import type { NewsItem, NewsOutlet } from "@/lib/types";

/**
 * Live news adapter.
 *
 * Pulls each masthead's politics RSS feed on the server, revalidating every
 * 10 minutes, and merges the results into one chronological table. Any feed
 * that fails is skipped rather than breaking the page; if every feed fails we
 * fall back to a verified static set so the section is never empty and never
 * wrong.
 */

const REVALIDATE_SECONDS = 600;
const PER_OUTLET_LIMIT = 12;
/** Anything older than this is stale for a daily politics table. */
const MAX_AGE_DAYS = 21;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object" && "#text" in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)["#text"] ?? "");
  }
  return "";
}

/**
 * Feeds publish entities, and not the tidy subset we used to handle.
 *
 * The Sun's feed alone carries &#034;, &#038;, &#039;, &#8211;, &#8216; and
 * &#8217;, and the old list matched &#39; but not the zero-padded &#039;, so
 * twenty apostrophes a day reached the page as literal code. Headlines were
 * rendering as "faints &#8216;at sight of meat&#8217;".
 *
 * Numeric entities are decoded generically rather than enumerated, because
 * the next feed will use one nobody listed. &amp; is decoded last so that
 * decoding cannot manufacture a new entity from the text around it.
 */
function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    "&nbsp;": " ", "&rsquo;": "\u2019", "&lsquo;": "\u2018",
    "&ldquo;": "\u201c", "&rdquo;": "\u201d", "&quot;": '"',
    "&apos;": "'", "&ndash;": "\u2013", "&mdash;": "\u2014", "&hellip;": "\u2026",
    "&lt;": "<", "&gt;": ">",
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&[a-z]+;/gi, (entity) => named[entity.toLowerCase()] ?? entity)
    .replace(/&amp;/g, "&");
}

function stripHtml(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull the publisher's thumbnail out of a feed item.
 *
 * There is no single convention. Most use media:content or media:thumbnail,
 * Sky adds an enclosure, and the Mail embeds the image in the description
 * HTML, which is why an earlier check concluded, wrongly, that the Mail
 * published no images at all.
 */
function imageFrom(item: Record<string, unknown>): string | undefined {
  const candidates: string[] = [];
  const push = (value: unknown) => {
    if (typeof value === "string" && /^https?:\/\//.test(value)) candidates.push(value);
  };

  for (const key of ["media:content", "media:thumbnail", "enclosure"]) {
    const node = item[key];
    for (const entry of (Array.isArray(node) ? node : [node]).filter(Boolean)) {
      push((entry as Record<string, string>)?.["@_url"]);
    }
  }

  const described = `${text(item.description)}${text(item["content:encoded"])}`;
  const embedded = described.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (embedded) push(embedded[1]);

  return candidates[0];
}

function toIso(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function fetchOutlet(outlet: NewsOutlet): Promise<NewsItem[]> {
  const feedUrl = outlet.feed as string;
  const response = await fetch(feedUrl, {
    headers: {
      "User-Agent": "ukpoliticshub.com/1.0 (+https://ukpoliticshub.com)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const parsed = parser.parse(await response.text());

  // RSS 2.0 puts items at rss.channel.item; Atom uses feed.entry.
  const rawItems = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  const mapped: NewsItem[] = items
    .map((item: Record<string, unknown>) => {
      const link =
        text(item.link) ||
        (item.link as Record<string, string> | undefined)?.["@_href"] ||
        text(item.guid);
      return {
        title: stripHtml(text(item.title)),
        url: link,
        outlet: outlet.id,
        publishedAt: toIso(text(item.pubDate) || text(item.published) || text(item.updated)),
        summary: stripHtml(text(item.description) || text(item.summary)).slice(0, 220) || undefined,
        imageUrl: imageFrom(item),
      };
    })
    .filter((item: NewsItem) => item.title && item.url);

  // Only applied where the outlet publishes a general news feed rather than a
  // politics one: see the note on politicsFilter in data/news.ts.
  const relevant = outlet.politicsFilter
    ? mapped.filter((item) =>
        outlet.politicsFilter!.test(`${item.title} ${item.summary ?? ""} ${item.url}`)
      )
    : mapped;

  return relevant.slice(0, PER_OUTLET_LIMIT);
}

export type NewsResult = {
  items: NewsItem[];
  /** Outlet ids that returned usable stories on this pass. */
  live: string[];
  /** True when every feed failed and we are showing the verified static set. */
  usingFallback: boolean;
  fetchedAt: string;
};

export async function getNews(): Promise<NewsResult> {
  const withFeeds = outlets.filter((o) => o.feed);

  const settled = await Promise.allSettled(
    withFeeds.map((outlet) => fetchOutlet(outlet))
  );

  const items: NewsItem[] = [];
  const live: string[] = [];

  settled.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.length > 0) {
      live.push(withFeeds[index].id);
      items.push(...result.value);
    }
  });

  // Newest first, so the de-duplication below keeps the freshest copy of any
  // story that several mastheads are carrying at once.
  items.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  // Drop stale items: a politics front page showing three-week-old stories
  // reads as abandoned, and some feeds carry a long tail of old content. If
  // that would leave the table too thin, keep everything rather than show a
  // near-empty page.
  const cutoff = Date.now() - MAX_AGE_DAYS * 86_400_000;
  const fresh = items.filter((item) => Date.parse(item.publishedAt) >= cutoff);
  const usable = fresh.length >= 12 ? fresh : items;

  const seen = new Set<string>();
  const deduped = usable.filter((item) => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 70);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length === 0) {
    return {
      items: fallbackNews,
      live: [],
      usingFallback: true,
      fetchedAt: new Date().toISOString(),
    };
  }

  return { items: deduped, live, usingFallback: false, fetchedAt: new Date().toISOString() };
}
