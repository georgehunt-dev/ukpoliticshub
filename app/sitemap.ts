import type { MetadataRoute } from "next";
import { parties } from "@/data/parties";
import { allCompareSlugs } from "@/lib/compare";
import { CONSTITUENCIES } from "@/lib/constituencies";
import { getNews } from "@/lib/news";

const BASE = "https://ukpoliticshub.com";

export const revalidate = 900;

/**
 * `lastModified` on the news-bearing routes reflects the newest story we are
 * actually carrying, not the time the file was generated. A sitemap that
 * claims every page changed the moment it was built teaches crawlers to
 * ignore the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let newestStory = now;
  try {
    const { items } = await getNews();
    const newest = items
      .map((item) => Date.parse(item.publishedAt))
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => b - a)[0];
    if (newest) newestStory = new Date(newest);
  } catch {
    // Feeds down: fall back to now rather than failing the sitemap.
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: newestStory, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/news`, lastModified: newestStory, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/briefing`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/parties`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/elections`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/constituencies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/constituencies/all`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/how-we-work`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/colophon`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const partyRoutes: MetadataRoute.Sitemap = parties.map((party) => ({
    url: `${BASE}/parties/${party.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // The 25 comparison pages: ten issues and fifteen pairings, each a real URL
  // with its own content rather than a client-side state of one page.
  const compareRoutes: MetadataRoute.Sitemap = allCompareSlugs().map((slug) => ({
    url: `${BASE}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // All 650 seats. These change only when a by-election is held or an MP
  // changes party, so they are declared as monthly rather than inflating the
  // whole sitemap with daily claims a crawler would learn to distrust.
  const constituencyRoutes: MetadataRoute.Sitemap = CONSTITUENCIES.map((seat) => ({
    url: `${BASE}/constituencies/${seat.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...partyRoutes, ...compareRoutes, ...constituencyRoutes];
}
