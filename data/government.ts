import type { Source } from "@/lib/types";

/** The sitting Prime Minister and how the country rates him and his government. */

export const primeMinister = {
  slug: "andy-burnham",
  name: "Andy Burnham",
  party: "labour" as const,
  office: "Prime Minister of the United Kingdom",
  seat: "MP for Makerfield",
  since: "2026-07-20",
  sinceLabel: "20 July 2026",
  precis:
    "Mayor of Greater Manchester for nine years and a cabinet minister under Blair and Brown, Burnham became the UK's seventh Prime Minister in a decade after Keir Starmer resigned in June 2026. He returned to the Commons through the Makerfield by-election in order to be eligible, then took the Labour leadership unopposed on 379 nominations, more than 94% of the parliamentary party.",
  sources: [
    {
      label: "NPR, Andy Burnham succeeds Keir Starmer as the UK's 7th prime minister in 10 years",
      url: "https://www.npr.org/2026/07/19/nx-s1-5895993/andy-burnham-prime-minister-keir-starmer",
      date: "2026-07-19",
    },
    {
      label: "Wikipedia, 2026 Labour Party leadership election",
      url: "https://en.wikipedia.org/wiki/2026_Labour_Party_leadership_election",
      date: "2026-07-17",
    },
  ] satisfies Source[],
};

export type Rating = {
  label: string;
  approve: number;
  disapprove?: number;
  net?: number;
  pollster: string;
  fieldwork: string;
  note?: string;
  source: Source;
};

export const primeMinisterRatings: Rating[] = [
  {
    label: "Approval of Burnham as Prime Minister",
    approve: 37,
    disapprove: 21,
    net: 16,
    pollster: "Opinium",
    fieldwork: "5–8 August 2026",
    note: "The most positively rated political leader Opinium tested.",
    source: {
      label: "Opinium, Voting intention and approval, August 2026",
      url: "https://www.opinium.com/resource-center/voting-intention-5-august-2026/",
      date: "2026-08-08",
    },
  },
  {
    label: "Approval of Burnham as Prime Minister",
    approve: 50,
    pollster: "Ipsos / PoliticsHome",
    fieldwork: "30 July – 4 August 2026",
    note: "Highest of all party leaders tested in this poll.",
    source: {
      label: "Ipsos, Burnham favourability tracking",
      url: "https://www.ipsos.com/en-uk/andy-burnham-and-wes-streetings-national-favourability-ratings-fall-ahead-makerfield-election",
      date: "2026-08-04",
    },
  },
];

/** "Best Prime Minister" head-to-head: the clearest read on the leadership contest. */
export const bestPrimeMinister = {
  question: "Most capable of running the country",
  pollster: "Ipsos / PoliticsHome",
  fieldwork: "30 July – 4 August 2026",
  options: [
    { name: "Andy Burnham", party: "labour" as const, pct: 36 },
    { name: "Nigel Farage", party: "reform" as const, pct: 15 },
    { name: "Kemi Badenoch", party: "conservative" as const, pct: 13 },
  ],
  source: {
    label: "Ipsos / PoliticsHome political monitor",
    url: "https://www.ipsos.com/en-uk/andy-burnham-and-wes-streetings-national-favourability-ratings-fall-ahead-makerfield-election",
    date: "2026-08-04",
  } satisfies Source,
};

/**
 * How the Labour government as a whole is faring. Kept deliberately
 * qualitative where no clean published number exists. We would rather print
 * a sourced sentence than invent a percentage.
 */
export const governmentStanding = {
  party: "labour" as const,
  label: "The Labour government",
  inOfficeSince: "5 July 2024",
  voteShare: 25.4,
  assessment:
    "Burnham's personal ratings are strong and he holds a wide lead on 'best Prime Minister', but the public remains divided on the government's overall direction and unconvinced it will deliver on immigration and the cost of living.",
  source: {
    label: "Ipsos / PoliticsHome political monitor, August 2026",
    url: "https://www.ipsos.com/en-uk/andy-burnham-and-wes-streetings-national-favourability-ratings-fall-ahead-makerfield-election",
    date: "2026-08-04",
  } satisfies Source,
};
