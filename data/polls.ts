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
      "Labour's 24% in YouGov's 9–10 August poll is its highest in that tracker since July 2025, and up eight points on the 16% low it recorded in May.",
    source: {
      label: "YouGov, Voting intention, 9–10 August 2026",
      url: "https://yougov.com/en-gb/articles/55331-voting-intention-9-10-august-2026-lab-24-ref-22-con-21-grn-12-ld-11",
      date: "2026-08-10",
    },
  },
  {
    text:
      "Opinium's 5 August poll had Labour unchanged on 27% with Reform UK up one to 25% and the Conservatives up one to 19%.",
    source: {
      label: "Opinium, Voting intention, 5 August 2026",
      url: "https://www.opinium.com/resource-center/voting-intention-5-august-2026/",
      date: "2026-08-05",
    },
  },
];

/** The individual polls behind the average, each linked to the pollster's own write-up. */
export const recentPolls: Poll[] = [
  {
    pollster: "YouGov",
    fieldwork: "9–10 August 2026",
    url: "https://yougov.com/en-gb/articles/55331-voting-intention-9-10-august-2026-lab-24-ref-22-con-21-grn-12-ld-11",
    results: {
      labour: 24,
      reform: 22,
      conservative: 21,
      green: 12,
      "liberal-democrats": 11,
    },
  },
  {
    pollster: "Opinium",
    fieldwork: "to 5 August 2026",
    url: "https://www.opinium.com/resource-center/voting-intention-5-august-2026/",
    results: {
      labour: 27,
      reform: 25,
      conservative: 19,
    },
  },
  {
    pollster: "YouGov",
    fieldwork: "2–3 August 2026",
    url: "https://yougov.com/en-gb/articles/55293-voting-intention-2-3-august-2026-ref-23-lab-22-con-19-grn-13-ld-12",
    results: {
      reform: 23,
      labour: 22,
      conservative: 19,
      green: 13,
      "liberal-democrats": 12,
    },
  },
];
