import type { MetadataRoute } from "next";
import { parties } from "@/data/parties";
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
    { url: `${BASE}/elections`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
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

  return [...staticRoutes, ...partyRoutes];
}
