import type { Source } from "@/lib/types";

/**
 * One scale for every state, so the scores can honestly sit side by side.
 *
 * The old model asked each state a different set of questions with a different
 * set of weights. That produced a composite for Russia of 44 against China's 51
 * and Iran's 56 — not a judgement that China presses harder on the UK than
 * Russia does, but an artefact of which questions were asked. A fifth of
 * Russia's score came from "Ukraine trajectory and Russian force commitment",
 * a factor no other state had and which measured Russian capacity being
 * absorbed elsewhere rather than pressure on Britain.
 *
 * Now every state answers the same six questions, and the same weights apply
 * to all of them. The weights are argued for once, here, rather than per
 * state — which is what stops them being tuned until the answer looks right.
 *
 * Where a state has no evidence against a factor, it scores low and says so.
 * It is not dropped. Dropping the inconvenient question is what broke the old
 * model.
 */

export type FactorId =
  | "uk-soil"
  | "institutions"
  | "cyber"
  | "military"
  | "designation"
  | "direction";

export type FactorDefinition = {
  id: FactorId;
  name: string;
  /** The question every state is scored against, worded once. */
  question: string;
  weight: number;
  /** Why it carries the weight it does. */
  rationale: string;
};

/**
 * Weights sum to 100 and are deliberately not equal. A plot to kill someone in
 * Britain and a twelve-month trend line are both real, and treating them as
 * equally important would be its own distortion. What matters for comparison
 * is that the same profile applies to every state.
 */
export const THREAT_FACTORS: FactorDefinition[] = [
  {
    id: "uk-soil",
    name: "Operations on UK soil",
    question:
      "Has the state directed sabotage, arson, surveillance or plots against people in the United Kingdom?",
    weight: 25,
    rationale:
      "Physical operations against people and property in Britain are the most direct form the pressure takes, and the hardest to characterise as anything else.",
  },
  {
    id: "institutions",
    name: "Espionage and interference in UK institutions",
    question:
      "Is the state working to recruit, penetrate or influence Parliament, government, universities or business?",
    weight: 20,
    rationale:
      "Sustained access to institutions compounds over years, and is the activity security services describe most consistently.",
  },
  {
    id: "cyber",
    name: "Cyber operations against UK networks",
    question:
      "Is the state conducting or tolerating cyber operations against UK critical infrastructure, government or business?",
    weight: 15,
    rationale:
      "Continual across all three states, which makes it a fair discriminator only in scale rather than in kind.",
  },
  {
    id: "military",
    name: "Military pressure on UK territory and infrastructure",
    question:
      "Is the state operating against UK waters, airspace or undersea infrastructure?",
    weight: 15,
    rationale:
      "Direct military proximity, including the cables and pipelines the UK depends on. Applies very unevenly between states, which is itself informative.",
  },
  {
    id: "designation",
    name: "Official UK designation and posture",
    question:
      "How has the UK government formally placed this state, and how plainly does it say so?",
    weight: 15,
    rationale:
      "The clearest official signal available, and the one part of this assessment that is not our judgement. The enhanced tier of the Foreign Influence Registration Scheme is the sharpest line the government draws.",
  },
  {
    id: "direction",
    name: "Direction of travel",
    question: "Over the last twelve months, is the pressure intensifying or easing?",
    weight: 10,
    rationale:
      "Weighted lowest on purpose. A trend is the least certain thing here and the easiest to read into a run of headlines.",
  },
];

export const FACTOR_WEIGHT_TOTAL = THREAT_FACTORS.reduce((sum, f) => sum + f.weight, 0);

/** One state's answer to one of the six questions. */
export type Reading = {
  factor: FactorId;
  score: number;
  /**
   * The evidence behind the score. Null where we hold none — the factor still
   * renders, scores low, and says the gap is ours.
   */
  evidence: string | null;
  sources: Source[];
};

/**
 * A dated change to a score, with the reason. Scores move when a person moves
 * them, never because coverage spiked: an assessment that rose whenever a
 * newspaper ran a scare story would be a number we invented.
 */
export type ScoreChange = {
  date: string;
  factor: FactorId;
  from: number;
  to: number;
  reason: string;
  source?: Source;
};

export function factorById(id: FactorId): FactorDefinition {
  const found = THREAT_FACTORS.find((f) => f.id === id);
  if (!found) throw new Error(`Unknown threat factor: ${id}`);
  return found;
}

/** Weighted composite across the six, on the shared profile. */
export function compositeOf(readings: Reading[]): number {
  const total = readings.reduce(
    (sum, reading) => sum + reading.score * factorById(reading.factor).weight,
    0
  );
  return Math.round(total / FACTOR_WEIGHT_TOTAL);
}

/** Every state must answer every question, or the composite is not comparable. */
export function readingsAreComplete(readings: Reading[]): boolean {
  const seen = new Set(readings.map((r) => r.factor));
  return THREAT_FACTORS.every((f) => seen.has(f.id)) && seen.size === THREAT_FACTORS.length;
}
