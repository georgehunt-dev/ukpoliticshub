import type { MetadataRoute } from "next";
import { parties } from "@/data/parties";

const BASE = "https://ukpoliticshub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/briefing`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/parties`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/elections`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/how-we-work`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/colophon`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const partyRoutes: MetadataRoute.Sitemap = parties.map((party) => ({
    url: `${BASE}/parties/${party.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...partyRoutes];
}
