import type { Poll, PollEntry, Source } from "@/lib/types";

/**
 * The Race for No.10.
 *
 * Headline figures are a rolling average of published British Polling Council
 * members' voting-intention polls. We report an existing published average
 * rather than computing our own, so the number on the front page is one a
 * reader can independently check.
 */

export const POLL_AVERAGE_AS_OF = "2026-08-27";

export const POLL_AVERAGE_SOURCE: Source = {
  label: "PollCheck, 7-poll moving average",
  url: "https://www.pollcheck.co.uk/gb-polls",
  date: "2026-08-27",
};

export const pollAverage: PollEntry[] = [
  { party: "labour", pct: 25.6, change: 0 },
  { party: "reform", pct: 24.9, change: 0 },
  { party: "conservative", pct: 19.9, change: 0 },
  { party: "green", pct: 10.7, change: 0 },
  { party: "liberal-democrats", pct: 10.1, change: 0 },
  /* Not on the same basis as the five above, and the source says so: it is a
     7-poll average of only those pollsters that offer Restore Britain as a
     named option, currently a minority of them. It is listed here because
     leaving the party off the front page entirely would be the larger
     distortion, but it is not a like-for-like comparison and any note written
     about the gap between it and the others has to say that. */
  { party: "restore-britain", pct: 3.0, change: 0 },
];

/** Everything not accounted for by the six parties above. */
export const pollOther = Number(
  (100 - pollAverage.reduce((total, entry) => total + entry.pct, 0)).toFixed(1)
);

/**
 * Movement worth flagging, stated only where a pollster has published the
 * comparison themselves. We do not compute our own change figures.
 */
export const trendNotes: { text: string; source: Source }[] = [
  {
    text:
      "Survation's 18 August poll had Labour and Reform UK tied on 26% each, at the end of Andy Burnham's first month as Prime Minister.",
    source: {
      label: "Survation, 30 days of Burnham: has the bounce continued?",
      url: "https://www.survation.com/30-days-of-burnham-has-the-bounce-continued/",
      date: "2026-08-20",
    },
  },
  {
    text:
      "YouGov's 23-24 August poll for The Times and Sky News had the three largest parties within three points of each other: Reform UK 23%, Labour 22% and the Conservatives 20%.",
    source: {
      label: "YouGov, Voting intention, 23-24 August 2026",
      url: "https://yougov.com/en-gb/articles/55427-voting-intention-23-24-august-2026-ref-23-lab-22-con-20-grn-13-ld-13",
      date: "2026-08-25",
    },
  },
];

/**
 * Individual polls behind the average, each linked to the pollster's own
 * write-up so any figure here can be checked at source.
 *
 * Not all seven in the current average appear. The list only carries polls
 * whose figures we could read on the pollster's own site: several of the
 * pollsters the average draws on publish to clients and aggregators without
 * putting a public write-up out, and listing those from an aggregator's table
 * would be citing a source that is not the one the number came from. The page
 * says as much rather than implying the list is the whole average.
 *
 * Where a pollster published a headline but no figure for a party, the cell is
 * left empty and renders as an em dash. Survation's 18 August release gave
 * Labour and Reform only in the write-up itself.
 */
export const recentPolls: Poll[] = [
  {
    pollster: "YouGov",
    fieldwork: "23-24 August 2026",
    url: "https://yougov.com/en-gb/articles/55427-voting-intention-23-24-august-2026-ref-23-lab-22-con-20-grn-13-ld-13",
    results: {
      reform: 23,
      labour: 22,
      conservative: 20,
      green: 13,
      "liberal-democrats": 13,
      "restore-britain": 3,
    },
  },
  {
    pollster: "Survation",
    fieldwork: "18 August 2026",
    sampleSize: 2013,
    url: "https://www.survation.com/30-days-of-burnham-has-the-bounce-continued/",
    results: {
      labour: 26,
      reform: 26,
    },
  },
  {
    pollster: "YouGov",
    fieldwork: "16-17 August 2026",
    url: "https://yougov.com/en-gb/articles/55381-voting-intention-16-17-august-2026-ref-24-lab-22-con-19-grn-13-ld-12",
    results: {
      reform: 24,
      labour: 22,
      conservative: 19,
      green: 13,
      "liberal-democrats": 12,
      "restore-britain": 4,
    },
  },
];
