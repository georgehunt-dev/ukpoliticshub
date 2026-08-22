import type { Source, ThreatFactor } from "@/lib/types";
import { factorById } from "@/data/threat-model";
import { russiaReadings } from "@/data/threat-readings";

/* ── 1. The official figure ────────────────────────────────────────────────
   Set by the Joint Terrorism Analysis Centre and MI5. We publish it as-is and
   never adjust it. This is the only threat number on the site that is
   authoritative rather than editorial.
   ------------------------------------------------------------------------ */

export const OFFICIAL_LEVELS = [
  { level: "Low", meaning: "an attack is highly unlikely" },
  { level: "Moderate", meaning: "an attack is possible but not likely" },
  { level: "Substantial", meaning: "an attack is likely" },
  { level: "Severe", meaning: "an attack is highly likely" },
  { level: "Critical", meaning: "an attack is highly likely in the near future" },
] as const;

export const officialTerrorismThreat = {
  level: "Severe" as const,
  meaning: "an attack is highly likely",
  scope: "United Kingdom (England, Wales, Scotland and Northern Ireland)",
  setBy: "Joint Terrorism Analysis Centre (JTAC) and MI5",
  source: {
    label: "GOV.UK — Terrorism threat levels",
    url: "https://www.gov.uk/terrorism-national-emergency/terrorism-threat-levels",
    date: "2026-08-14",
  } satisfies Source,
};

/* ── 2. Our Russia assessment ──────────────────────────────────────────────
   This is ukpoliticshub's own editorial score, not a government figure, and
   it is labelled as such everywhere it appears. It measures sustained
   state-level pressure on the United Kingdom — espionage, sabotage, cyber
   operations and activity around UK infrastructure — not the likelihood of
   open war, which remains low.

   Each factor is scored 0–100 on its own evidence, then weighted. Weights sum
   to 100. We deliberately score conservatively: grey-zone activity that is
   real and documented should not be inflated into an imminent-attack warning.
   ------------------------------------------------------------------------ */

export const RUSSIA_BANDS = [
  { min: 0, max: 19, label: "Low", note: "No sustained state-level pressure evident." },
  { min: 20, max: 39, label: "Moderate", note: "Persistent hostile activity, largely routine in scale." },
  { min: 40, max: 59, label: "Elevated", note: "Sustained grey-zone pressure across several domains." },
  { min: 60, max: 79, label: "High", note: "Intensifying activity with direct risk to UK infrastructure." },
  { min: 80, max: 100, label: "Severe", note: "Pressure approaching or crossing into open confrontation." },
] as const;

/**
 * Russia's six readings in the shape the pages render. Derived from the shared
 * model rather than written here, so this file and /threat cannot drift into
 * quoting two different Russia scores.
 */
export const russiaFactors: ThreatFactor[] = russiaReadings.map((reading) => {
  const definition = factorById(reading.factor);
  return {
    name: definition.name,
    score: reading.score,
    weight: definition.weight,
    evidence: reading.evidence ?? "We hold no sourced evidence against this question.",
    sources: reading.sources,
  };
});

export const russiaScore = Math.round(
  russiaFactors.reduce((total, f) => total + f.score * f.weight, 0) / 100
);

export const russiaBand =
  RUSSIA_BANDS.find((b) => russiaScore >= b.min && russiaScore <= b.max) ?? RUSSIA_BANDS[0];

export const RUSSIA_ASSESSED_ON = "2026-08-14";

export const russiaSummary =
  "Sustained, documented grey-zone pressure — survey and submarine activity around UK undersea cables, a high tempo of naval transits shadowed in UK waters, and continuing sabotage and cyber activity. It is not a warning of imminent attack: the Ukraine war still absorbs most Russian conventional capacity, and no UK national threat level has been raised on account of Russia.";

export const russiaCaveat =
  "This score is ukpoliticshub's own editorial assessment. It is not produced, endorsed or reviewed by the UK government, JTAC, MI5 or any intelligence agency. The only official figure on this page is the terrorism threat level above.";
