import type { Source } from "@/lib/types";

/**
 * The daily briefing.
 *
 * Written from the data already on this site and nothing else — the same rule
 * the assistant follows. Every claim here traces to a figure or citation that
 * appears elsewhere on the page, so a reader can check any sentence of it.
 */

export const BRIEFING_DATE = "2026-08-14";

/**
 * This briefing is a dated edition, not a live feed.
 *
 * The prose below is written by hand and does not regenerate — the scheduled
 * refresh rebuilds the page, but the words stay put. So the site states the
 * edition date plainly and flags when the reader is looking at an old one,
 * rather than implying freshness it does not have. Avoid relative time words
 * ("yesterday", "this week") in here for the same reason: they are correct for
 * about a day and quietly wrong afterwards.
 */
export const BRIEFING_IS_DATED_EDITION = true;

/** Whole days between the edition date and now, for the staleness notice. */
export function briefingAgeInDays(today: Date = new Date()): number {
  const written = new Date(`${BRIEFING_DATE}T00:00:00Z`);
  const now = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.max(0, Math.round((now - written.getTime()) / 86_400_000));
}

export const briefing = {
  headline: "Farage holds a seat nobody contested, while Burnham's honeymoon holds",
  paragraphs: [
    "Nigel Farage was returned for Clacton on 13 August on 63.3%, in a by-election he called on himself while under parliamentary scrutiny over undeclared gifts and a reported £5m donation. Labour, the Conservatives, the Liberal Democrats, the Greens and Restore Britain all stood aside, which left the novelty candidate Count Binface as runner-up on 26.9% and turnout down 13.6 points. It is a large number that tells you very little about a competitive contest.",
    "The national picture is genuinely three-way. The rolling average has Labour on 25.4%, Reform UK on 23.6% and the Conservatives on 20.7% — a spread of under five points between first and third. Labour's recovery is the real movement of the summer: YouGov's latest has the party at 24%, eight points above the 16% it recorded as recently as May.",
    "Andy Burnham, four weeks into the job at the time of writing, is the best-rated leader in both major approval series — net +16 with Opinium, 50% approval with Ipsos, and a 21-point lead over Farage on who could best run the country. His government is doing less well than he is: Ipsos finds the public divided on its direction and unconvinced on immigration and the cost of living.",
    "On security, the official terrorism threat level remains Severe, meaning an attack is highly likely. Our own Russia assessment sits at 45 out of 100 — sustained grey-zone pressure rather than a warning of imminent attack, with the Ukraine war still absorbing most Russian conventional capacity.",
  ],
  /**
   * Deliberately balanced pairs: where a claim favours one side, the framing
   * that cuts the other way is printed beside it.
   */
  bothSides: [
    {
      question: "Was Clacton a triumph or a stunt?",
      left:
        "No major party stood, turnout collapsed by nearly 14 points, and a candidate in a bin costume took more than a quarter of the vote. A safe seat held under those conditions proves nothing about national standing, and the by-election was triggered by scrutiny of the member's own finances.",
      right:
        "Farage put his seat on the line voluntarily and was returned with a majority of 12,784 on 63.3%. Every rival party declined to face him. Whatever the framing, the electorate that knows him best re-elected him decisively.",
    },
    {
      question: "Is Labour's recovery real?",
      left:
        "Eight points of recovery since May, a clear lead in the averages, and the most popular leader in the country. Changing leader has demonstrably worked.",
      right:
        "A 25% lead is the lowest winning share in modern polling, the government's ratings lag its leader's badly, and honeymoons are the easiest thing in politics to mistake for a trend. Burnham has not yet faced an election as Prime Minister.",
    },
  ],
  followUps: [
    {
      question: "Who is actually leading the polls right now?",
      answer:
        "Labour, on 25.4% in the 7-poll rolling average as of 13 August, with Reform UK on 23.6% and the Conservatives on 20.7%. Individual polls disagree on the order: YouGov's 2–3 August poll had Reform ahead of Labour, and its 9–10 August poll had Labour ahead. The lead is well inside the margin of error, so 'three-way tie' is a fairer description than 'Labour leads'.",
    },
    {
      question: "Why is the Russia threat score 45 and not higher?",
      answer:
        "Because the evidence supports sustained grey-zone pressure, not imminent attack. The two highest-scoring factors are undersea infrastructure activity (58) and cyber operations (50). The lowest is the Ukraine trajectory at 28 — the war continues to absorb the bulk of Russian conventional capacity, and the truces in April and May 2026 were humanitarian pauses rather than a settlement. Critically, no UK national threat level has been raised on account of Russia, which is the strongest available signal that the government does not assess an attack as imminent.",
    },
    {
      question: "When is the next general election?",
      answer:
        "No later than 15 August 2029, under the Dissolution and Calling of Parliament Act 2022, though a Prime Minister may call one at any point before that. The next scheduled national contests are the local elections on 6 May 2027, expected to be held alongside the Northern Ireland Assembly election.",
    },
    {
      question: "How many parties are realistically in contention?",
      answer:
        "Three on vote share — Labour, Reform UK and the Conservatives are separated by under five points. But first-past-the-post is not proportional: the Greens poll around 12% with five MPs, and Restore Britain polls around 4% with one. Vote share and seats diverge sharply, which is why we publish the vote-share average rather than a seat projection.",
    },
  ],
  sources: [
    {
      label: "PollCheck — 7-poll moving average, 13 August 2026",
      url: "https://www.pollcheck.co.uk/gb-polls",
      date: "2026-08-13",
    },
    {
      label: "Wikipedia — 2026 Clacton by-election",
      url: "https://en.wikipedia.org/wiki/2026_Clacton_by-election",
      date: "2026-08-13",
    },
    {
      label: "GOV.UK — Terrorism threat levels",
      url: "https://www.gov.uk/terrorism-national-emergency/terrorism-threat-levels",
      date: "2026-08-14",
    },
  ] satisfies Source[],
};
