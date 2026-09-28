import type { Poll, PollEntry, Source } from "@/lib/types";

/**
 * The Race for No.10.
 *
 * Headline figures are a rolling average of published British Polling Council
 * members' voting-intention polls. We report an existing published average
 * rather than computing our own, so the number on the front page is one a
 * reader can independently check.
 */

export const POLL_AVERAGE_AS_OF = "2026-09-26";

export const POLL_AVERAGE_SOURCE: Source = {
  label: "PollCheck, 7-poll moving average",
  url: "https://www.pollcheck.co.uk/gb-polls",
  date: "2026-09-26",
};

export const pollAverage: PollEntry[] = [
  { party: "labour", pct: 26.1, change: 0 },
  { party: "reform", pct: 22.9, change: 0 },
  { party: "conservative", pct: 20.3, change: 0 },
  { party: "green", pct: 10.6, change: 0 },
  { party: "liberal-democrats", pct: 10.3, change: 0 },
  /* Not on the same basis as the five above, and the source says so: it is a
     7-poll average of only those pollsters that offer Restore Britain as a
     named option, currently a minority of them. It is listed here because
     leaving the party off the front page entirely would be the larger
     distortion, but it is not a like-for-like comparison and any note written
     about the gap between it and the others has to say that. */
  { party: "restore-britain", pct: 4.4, change: 0 },
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
      "YouGov's 20-21 September poll put Reform UK on 21%, which YouGov says is the lowest share it has recorded for the party since it restarted its voting intention tracker in January 2025.",
    source: {
      label: "YouGov, Voting intention, 20-21 September 2026",
      url: "https://yougov.com/en-gb/articles/55596-voting-intention-20-21-september-2026-lab-23-con-21-ref-21-grn-14-ld-12",
      date: "2026-09-22",
    },
  },
  {
    text:
      "Opinium's poll of 23-25 September had Labour up one to 28%, Reform UK unchanged on 24% and the Conservatives down one to 17%.",
    source: {
      label: "Opinium, Voting intention, 23rd September 2026",
      url: "https://www.opinium.com/resource-center/voting-intention-23rd-september-2026/",
      date: "2026-09-26",
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
 * left empty and renders as an em dash. Opinium's write-up does not name a
 * Restore Britain figure, so that cell is empty rather than borrowed from an
 * aggregator.
 */
export const recentPolls: Poll[] = [
  {
    pollster: "Opinium",
    fieldwork: "23-25 September 2026",
    sampleSize: 2050,
    url: "https://www.opinium.com/resource-center/voting-intention-23rd-september-2026/",
    results: {
      labour: 28,
      reform: 24,
      conservative: 17,
      "liberal-democrats": 10,
      green: 10,
    },
  },
  {
    pollster: "YouGov",
    fieldwork: "20-21 September 2026",
    url: "https://yougov.com/en-gb/articles/55596-voting-intention-20-21-september-2026-lab-23-con-21-ref-21-grn-14-ld-12",
    results: {
      labour: 23,
      conservative: 21,
      reform: 21,
      green: 14,
      "liberal-democrats": 12,
      "restore-britain": 4,
    },
  },
  {
    pollster: "YouGov",
    fieldwork: "13-14 September 2026",
    url: "https://yougov.com/en-gb/articles/55556-voting-intention-13-14-september-2026-lab-23-ref-23-con-20-ld-13-grn-11",
    results: {
      labour: 23,
      reform: 23,
      conservative: 20,
      "liberal-democrats": 13,
      green: 11,
      "restore-britain": 3,
    },
  },
];
