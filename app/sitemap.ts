import type { MetadataRoute } from "next";
import { parties } from "@/data/parties";
import { allCompareSlugs } from "@/lib/compare";
import { allBallots } from "@/lib/byelections";
import { CONSTITUENCIES } from "@/lib/constituencies";
import { assessments } from "@/data/states";
import { subjects } from "@/data/subjects";
import { outlets } from "@/data/news";
import { coverageFor, MIN_INDEXABLE } from "@/lib/subjects";
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
    { url: `${BASE}/parties`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/elections`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/constituencies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/threat`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/constituencies/all`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/elections/by-elections`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/mission`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
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

  /**
   * One page per by-election. Declared daily because the candidate list moves
   * until nominations close and the result lands after the poll — and they
   * drop out of the sitemap entirely once the contest ages out of the data.
   */
  const byElectionRoutes: MetadataRoute.Sitemap = allBallots().map(({ ballot }) => ({
    url: `${BASE}/elections/${ballot.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  // The six state assessments, each on its own page.
  /**
   * Subject pages, but only the ones carrying enough coverage to be worth
   * ranking. A thin page in the sitemap is an invitation to be judged on it.
   */
  let subjectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { items } = await getNews();
    subjectRoutes = subjects
      .filter((subject) => coverageFor(subject, items).stories.length >= MIN_INDEXABLE)
      .map((subject) => ({
        url: `${BASE}/news/${subject.slug}`,
        lastModified: newestStory,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
  } catch {
    // Feeds down: omit rather than guess at which subjects are covered.
  }

  /**
   * Outlet pages. Evergreen: "is the BBC biased" is asked every day and the
   * answer does not decay the way a story page does.
   */
  const outletRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/news/outlets`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...outlets.map((outlet) => ({
      url: `${BASE}/news/outlets/${outlet.id}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];

  const assessmentRoutes: MetadataRoute.Sitemap = assessments.map((a) => ({
    url: `${BASE}/threat/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...partyRoutes,
    ...compareRoutes,
    ...constituencyRoutes,
    ...byElectionRoutes,
    ...assessmentRoutes,
    ...subjectRoutes,
    ...outletRoutes,
  ];
}
