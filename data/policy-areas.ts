import type { PolicyArea } from "@/lib/types";

/**
 * The ten questions every party is asked, in the order a reader with no
 * background would want them. Each carries a plain-English framing so the
 * grid works for someone who has never read a manifesto.
 */
export const POLICY_AREAS: {
  id: PolicyArea;
  name: string;
  /** What the argument is actually about, for a newcomer. */
  question: string;
}[] = [
  {
    id: "immigration",
    name: "Immigration & asylum",
    question: "Who gets to come here, who gets to stay, and what happens to people who arrive without permission.",
  },
  {
    id: "economy",
    name: "Tax & the economy",
    question: "Who pays what, and what the state can afford as a result.",
  },
  {
    id: "health",
    name: "NHS & social care",
    question: "How healthcare and care for older and disabled people are funded and delivered.",
  },
  {
    id: "housing",
    name: "Housing",
    question: "Whether enough homes get built, who builds them, and who can afford one.",
  },
  {
    id: "crime",
    name: "Crime & justice",
    question: "Policing, sentencing and prisons: how much punishment, and how much prevention.",
  },
  {
    id: "energy",
    name: "Energy & net zero",
    question: "How fast Britain cuts carbon emissions, what it costs, and who bears the cost.",
  },
  {
    id: "education",
    name: "Education",
    question: "Schools, universities and skills, funding, standards and who pays for what.",
  },
  {
    id: "defence",
    name: "Defence & foreign policy",
    question: "Military spending, NATO, the nuclear deterrent and Britain's alliances.",
  },
  {
    id: "europe",
    name: "Europe & the constitution",
    question: "The relationship with the EU, membership of international courts, and how power is distributed within the UK.",
  },
  {
    id: "culture",
    name: "Media & culture",
    question: "The BBC, broadcasting, and contested questions of national identity and religious practice.",
  },
];

export const policyAreaById = Object.fromEntries(POLICY_AREAS.map((a) => [a.id, a]));

/**
 * Shown wherever we have not been able to source a current position.
 *
 * Worded carefully: an empty row may mean the party has published little on
 * the subject, or it may mean we have not found what they have published.
 * Claiming the former when it might be the latter would be an overclaim, and
 * this site does not get to make those.
 */
export const NO_POSITION =
  "No current published position located. This may mean the party has said little on the subject, or that we have not found what it has said. We would rather show the gap than fill it with inference.";
