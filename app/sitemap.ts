import type { MetadataRoute } from "next";
import { parties, PARTIES_AS_OF } from "@/data/parties";
import { allCompareSlugs } from "@/lib/compare";
import { allBallots, BYELECTIONS_FETCHED_AT } from "@/lib/byelections";
import { CONSTITUENCIES, CONSTITUENCIES_FETCHED_AT } from "@/lib/constituencies";
import { assessments } from "@/data/states";
import { subjects } from "@/data/subjects";
import { outlets } from "@/data/news";
import { OUTLET_COVERAGE_UPDATED_AT } from "@/lib/outlet-coverage";
import { coverageFor, MIN_INDEXABLE } from "@/lib/subjects";
import { getNews } from "@/lib/news";

const BASE = "https://ukpoliticshub.com";

export const revalidate = 900;

/**
 * Every `lastModified` here is the date the page's own data last changed.
 *
 * It used to be `new Date()` for all but the news routes, which meant 737 of
 * the 752 URLs carried an identical timestamp that moved every fifteen minutes
 * as this route revalidated. Google treats a lastmod it finds unreliable as
 * absent, and an unreliable one across the whole sitemap spends crawl budget
 * re-fetching 650 seat pages that had not changed since the last visit. The
 * field is worth having only if it is true, so each block below is wired to
 * the fetch date, review date or assessment date behind that route.
 *
 * Where no honest date exists the field is omitted rather than guessed.
 * `lastModified` is optional in the protocol, and a missing date costs less
 * than a wrong one: the wrong one teaches a crawler to ignore the whole file.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seatData = new Date(CONSTITUENCIES_FETCHED_AT);
  const partyData = new Date(PARTIES_AS_OF);
  const ballotData = new Date(BYELECTIONS_FETCHED_AT);
  const coverageData = new Date(OUTLET_COVERAGE_UPDATED_AT);

  let newestStory: Date | undefined;
  try {
    const { items } = await getNews();
    const newest = items
      .map((item) => Date.parse(item.publishedAt))
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => b - a)[0];
    if (newest) newestStory = new Date(newest);
  } catch {
    // Feeds down: leave the news routes undated rather than stamping them now.
  }

  /**
   * The pages that carry no dated data of their own. They change when someone
   * edits the copy, which nothing in the build can observe, so they go in
   * without a date instead of claiming one.
   */
  const undated: MetadataRoute.Sitemap = [
    { url: `${BASE}/mission`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/how-we-work`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/colophon`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: newestStory, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/news`, lastModified: newestStory, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/parties`, lastModified: partyData, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: partyData, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/elections`, lastModified: ballotData, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${BASE}/constituencies`,
      lastModified: seatData,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${BASE}/threat`, lastModified: newestAssessment(), changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${BASE}/constituencies/all`,
      lastModified: seatData,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/elections/by-elections`,
      lastModified: ballotData,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const partyRoutes: MetadataRoute.Sitemap = parties.map((party) => ({
    url: `${BASE}/parties/${party.slug}`,
    lastModified: partyData,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // The 25 comparison pages are built entirely from the party dossiers, so
  // they change exactly when those do.
  const compareRoutes: MetadataRoute.Sitemap = allCompareSlugs().map((slug) => ({
    url: `${BASE}/compare/${slug}`,
    lastModified: partyData,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  /**
   * All 650 seats. Most carry the dataset's fetch date, but a seat that has
   * since voted changed on polling day, and saying so is the difference
   * between a crawler finding something new and finding what it already had.
   */
  const constituencyRoutes: MetadataRoute.Sitemap = CONSTITUENCIES.map((seat) => {
    const voted = seat.byElection?.date ? new Date(seat.byElection.date) : null;
    return {
      url: `${BASE}/constituencies/${seat.slug}`,
      lastModified: voted && voted > seatData ? voted : seatData,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  /**
   * One page per by-election. The candidate list moves until nominations
   * close and the result lands after the poll, so these track the fetch that
   * last brought either in.
   */
  const byElectionRoutes: MetadataRoute.Sitemap = allBallots().map(({ ballot }) => ({
    url: `${BASE}/elections/${ballot.slug}`,
    lastModified: ballotData,
    changeFrequency: "daily",
    priority: 0.6,
  }));

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
   * answer does not decay the way a story page does. What does change nightly
   * is the coverage count each page reports, which is what this date tracks.
   */
  const outletRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/news/outlets`,
      lastModified: coverageData,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...outlets.map((outlet) => ({
      url: `${BASE}/news/outlets/${outlet.id}`,
      lastModified: coverageData,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];

  // Each assessment carries the date it was actually reviewed, and they are
  // reviewed separately.
  const assessmentRoutes: MetadataRoute.Sitemap = assessments.map((a) => ({
    url: `${BASE}/threat/${a.slug}`,
    lastModified: new Date(a.assessedOn),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...undated,
    ...partyRoutes,
    ...compareRoutes,
    ...constituencyRoutes,
    ...byElectionRoutes,
    ...assessmentRoutes,
    ...subjectRoutes,
    ...outletRoutes,
  ];
}

/** The index page changes whenever any single assessment on it does. */
function newestAssessment(): Date {
  return assessments
    .map((a) => new Date(a.assessedOn))
    .reduce((newest, date) => (date > newest ? date : newest));
}
