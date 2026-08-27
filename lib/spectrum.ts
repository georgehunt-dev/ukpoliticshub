import { parties } from "@/data/parties";

/**
 * Turning a placement into the word a reader sees.
 *
 * "Furthest right" is deliberately relative rather than a fixed threshold. It
 * describes where a party sits against the other five, which is a claim we can
 * make; a threshold would have silently dropped the label the moment the
 * highest-placed party moved below it. Where two parties tie at the top,
 * neither gets it, only one party can be furthest right.
 *
 * It also reads "Furthest right" rather than "Far right" on purpose: the first
 * describes where we have placed a party against the other five, which is ours
 * to say; the second is a contested classification. Where that classification
 * is relevant it appears on the party's own page, attributed to the people
 * making it and printed alongside the party's rejection of it.
 *
 * Everything else is a band on the scale. The bands are ours and are explained
 * at /how-we-work#spectrum.
 */

export function spectrumBand(value: number, all: number[] = allPlacements()): string {
  const max = Math.max(...all);
  const soleMax = all.filter((v) => v === max).length === 1;
  if (value === max && soleMax && value > 0) return "Furthest right";

  if (value <= -7) return "Left";
  if (value <= -3) return "Centre-left";
  if (value <= 2) return "Centre";
  if (value <= 5) return "Centre-right";
  return "Right";
}

export function allPlacements(): number[] {
  return parties.map((party) => party.spectrum);
}

/** The site's organising spine: left to right by our placement. */
export function partiesLeftToRight() {
  return [...parties].sort((a, b) => a.spectrum - b.spectrum);
}
