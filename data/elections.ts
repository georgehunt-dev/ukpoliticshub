import type { PhotoSlug } from "@/lib/photos";
import type { ElectionEvent, Source } from "@/lib/types";

export const upcomingElections: ElectionEvent[] = [
  {
    name: "Local elections",
    date: "2027-05-06",
    certainty: "scheduled",
    // The Assembly election used to be noted here too. It is now its own entry
    // on the same polling-day card, so saying it twice reads as an error.
    detail:
      "All local authorities in Northern Ireland, Scotland and Wales, a tranche of English councils, and several directly elected English mayoralties.",
    source: {
      label: "Wikipedia, 2027 United Kingdom local elections",
      url: "https://en.wikipedia.org/wiki/2027_United_Kingdom_local_elections",
    },
  },
  {
    name: "Northern Ireland Assembly election",
    date: "2027-05-06",
    certainty: "expected",
    detail: "Expected to be held alongside the 2027 local elections.",
    source: {
      label: "Wikipedia, 2027 United Kingdom local elections",
      url: "https://en.wikipedia.org/wiki/2027_United_Kingdom_local_elections",
    },
  },
  {
    name: "United Kingdom general election",
    date: "2029-08-15",
    certainty: "deadline",
    detail:
      "The latest possible date under the Dissolution and Calling of Parliament Act 2022. A Prime Minister may call one at any point before this.",
    source: {
      label: "BritPolls, When is the next UK election?",
      url: "https://britpolls.co.uk/news/uk-2029-election-date/",
    },
  },
];

/**
 * What to show beside a past contest. A portrait is of the person, not of the
 * night: captioned as a portrait so it is never read as press photography of
 * the count itself. Where no one figure carries the story, a photograph does.
 */
export type ResultImage =
  | { kind: "portrait"; slug: string; name: string; caption: string }
  | { kind: "photo"; slug: PhotoSlug; alt: string; caption: string };

/** Contests already held in this Parliament that tell you something. */
export const recentResults: {
  name: string;
  date: string;
  headline: string;
  detail: string;
  image: ResultImage;
  source: Source;
}[] = [
  {
    name: "Clacton by-election",
    date: "2026-08-13",
    headline: "Farage holds Clacton on 63.3%",
    detail:
      "Nigel Farage resigned his seat on 8 July amid scrutiny of his personal finances and undeclared gifts, then re-contested it. Labour, the Conservatives, the Liberal Democrats, the Greens and Restore Britain all stood aside, leaving the novelty candidate Count Binface as runner-up on 26.9%. Turnout fell 13.6 points to 44.4%; majority 12,784.",
    image: {
      kind: "portrait",
      slug: "nigel-farage",
      name: "Nigel Farage",
      caption: "Nigel Farage, returned for Clacton",
    },
    source: {
      label: "Wikipedia, 2026 Clacton by-election",
      url: "https://en.wikipedia.org/wiki/2026_Clacton_by-election",
      date: "2026-08-13",
    },
  },
  {
    name: "Makerfield by-election",
    date: "2026-06-18",
    headline: "Burnham returns to the Commons",
    detail:
      "Held so Andy Burnham could re-enter Parliament and stand for the Labour leadership, party rules requiring any candidate to be an MP. Restore Britain took 6.8% and third place, ahead of the Conservatives.",
    image: {
      kind: "portrait",
      slug: "andy-burnham",
      name: "Andy Burnham",
      caption: "Andy Burnham, returned for Makerfield",
    },
    source: {
      label: "Wikipedia, 2026 Makerfield by-election",
      url: "https://en.wikipedia.org/wiki/2026_Makerfield_by-election",
      date: "2026-06-18",
    },
  },
  {
    name: "Gorton and Denton by-election",
    date: "2026-02-26",
    headline: "Greens win their first ever Westminster by-election",
    detail:
      "Hannah Spencer took the seat on 41% with a majority above 4,000: the party had never previously exceeded 10% in a by-election. Reform UK second, Labour third. Green membership passed 200,000 within days.",
    image: {
      kind: "portrait",
      slug: "hannah-spencer",
      name: "Hannah Spencer",
      caption: "Hannah Spencer, the Greens' by-election winner",
    },
    source: {
      label: "Wikipedia, 2026 in United Kingdom politics and government",
      url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
      date: "2026-02-26",
    },
  },
  {
    name: "Local, Scottish Parliament and Senedd elections",
    date: "2026-05-07",
    headline: "Three sets of elections on one day",
    detail:
      "UK local elections were held alongside the Scottish Parliament and Welsh Senedd elections: the first nationwide test of the post-2024 party landscape.",
    // No single figure carries a three-nation polling day, so this one gets a
    // polling station rather than a portrait.
    image: {
      kind: "photo",
      slug: "polling-station",
      alt: "A bilingual polling station sign outside a Welsh polling place",
      caption: "A polling station in Swansea",
    },
    source: {
      label: "Wikipedia, 2026 United Kingdom local elections",
      url: "https://en.wikipedia.org/wiki/2026_United_Kingdom_local_elections",
      date: "2026-05-07",
    },
  },
];
