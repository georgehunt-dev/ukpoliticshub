import type { Source, ThreatFactor } from "@/lib/types";

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

export const russiaFactors: ThreatFactor[] = [
  {
    name: "Ukraine trajectory and Russian force commitment",
    score: 28,
    weight: 20,
    evidence:
      "The war continues to absorb the bulk of Russian conventional capacity. Two short truces in 2026 — 32 hours at Orthodox Easter in April, and 9–11 May for Victory Day — were humanitarian pauses, not settlements. Talks remain stalled on territory and Western security guarantees. A negotiated end would free capacity and raise this score materially; that has not happened.",
    sources: [
      {
        label: "Wikipedia — 2026 Russo-Ukrainian truce",
        url: "https://en.wikipedia.org/wiki/2026_Russo-Ukrainian_truce",
        date: "2026-05-11",
      },
      {
        label: "Euronews — Zelenskyy on the June peace-deal deadline",
        url: "https://www.euronews.com/embed/2868494",
        date: "2026-02-08",
      },
    ],
  },
  {
    name: "Undersea infrastructure and the shadow fleet",
    score: 58,
    weight: 22,
    evidence:
      "UK defence officials say Russian submarines have been deployed alongside the survey vessel Yantar — part of Russia's GUGI deep-sea unit — to map and potentially sabotage cables and pipelines near the UK, including the Britain–Ireland gas interconnector. The government has stood up an Undersea Infrastructure Security Oversight Board in response. Russia's embassy calls the claims \"completely groundless\".",
    sources: [
      {
        label: "Breaking Defense — UK accuses Russia of covert submarine operation threatening undersea cables",
        url: "https://breakingdefense.com/2026/04/uk-accuses-russia-of-covert-submarine-operation-threatening-undersea-cables/",
        date: "2026-04-01",
      },
      {
        label: "CNN — Russian spy ship enters British waters and directs lasers at military pilots",
        url: "https://www.cnn.com/2025/11/19/uk/russia-spy-ship-yantar-lasers-britain-intl",
        date: "2025-11-19",
      },
    ],
  },
  {
    name: "Naval and air activity around the United Kingdom",
    score: 40,
    weight: 15,
    evidence:
      "The Royal Navy was activated 116 times during 2025–26 to shadow 61 Russian warships and 28 Russian merchant vessels inside the UK Exclusive Economic Zone, under Operation ADDISON — against a roughly 30% rise in Russian naval activity over two years. High tempo, but this is monitored, routine transit rather than escalation.",
    sources: [
      {
        label: "UK Defence Journal — Royal Navy shadowed 61 Russian warships around UK waters",
        url: "https://ukdefencejournal.org.uk/royal-navy-shadowed-61-russian-warships-around-uk-waters/",
        date: "2026-06-01",
      },
      {
        label: "Royal Navy — UK shadows Russian vessels through the English Channel",
        url: "https://www.royalnavy.mod.uk/news/2026/march/05/20260305-uk-shadows-russian-vessels-through-the-english-channel",
        date: "2026-03-05",
      },
    ],
  },
  {
    name: "Sabotage, arson and espionage on UK soil",
    score: 48,
    weight: 18,
    evidence:
      "A continuing pattern of state-linked recruitment of proxies for arson and surveillance in the UK and across Europe, prosecuted through the courts. Serious and sustained, but disrupted repeatedly rather than escalating in scale.",
    sources: [
      {
        label: "National Security News — UK faces \"civil collapse\" if undersea cables are attacked",
        url: "https://nationalsecuritynews.com/2025/10/uk-faces-civil-collapse-if-undersea-cables-are-attacked/",
        date: "2025-10-01",
      },
    ],
  },
  {
    name: "Cyber operations against critical national infrastructure",
    score: 50,
    weight: 15,
    evidence:
      "Persistent Russian state and state-tolerated criminal activity against UK energy, water, health and telecoms networks. Steady-state pressure rather than a step change in the last quarter.",
    sources: [
      {
        label: "Computer Weekly — UK needs better defences to protect undersea internet cables from Russian sabotage",
        url: "https://www.computerweekly.com/news/366631462/UK-needs-better-defences-to-protect-undersea-internet-cables-from-Russian-sabotage",
        date: "2026-01-01",
      },
    ],
  },
  {
    name: "Official UK posture and rhetoric",
    score: 40,
    weight: 10,
    evidence:
      "Ministers have moved to explicit public attribution — \"We see you, we know what you're doing, and we will not shy away from robust action to protect this country\" — and stood up new oversight machinery. But no formal national threat level has been raised on account of Russia, which is the strongest available signal that the UK does not assess an attack as imminent.",
    sources: [
      {
        label: "Yahoo News / Reuters — UK monitors Russian spy ship, steps up undersea cable protection",
        url: "https://www.yahoo.com/news/uk-monitors-russian-spy-ship-141154948.html",
        date: "2025-11-19",
      },
    ],
  },
];

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
