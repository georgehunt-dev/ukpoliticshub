import type { FactorId, Reading, ScoreChange } from "@/data/threat-model";

/**
 * Each state's answer to the same six questions.
 *
 * Evidence is carried over from the previous per-state assessments wherever it
 * genuinely answers the shared question. Where we hold nothing, the factor
 * still appears, scores low, and says the evidence is absent, because the old
 * model's real fault was letting each state be judged only on the questions it
 * happened to have answers for.
 *
 * Two of these gaps are findings rather than omissions. We hold no sourced
 * evidence of Chinese-directed sabotage or plots against people in Britain, and
 * none of Iranian military activity against UK waters or airspace. Those are
 * genuine differences between the states, and scoring them low is the point.
 */

const FIRS_ENHANCED = {
  label: "Home Office, Foreign Influence Registration Scheme, enhanced tier",
  url: "https://www.gov.uk/government/collections/foreign-influence-registration-scheme",
  date: "2025-07-01",
};

export const russiaReadings: Reading[] = [
  {
    factor: "uk-soil",
    score: 48,
    evidence:
      "A continuing pattern of state-linked recruitment of proxies for arson and surveillance in the UK and across Europe, prosecuted through the courts. Serious and sustained, but disrupted repeatedly rather than escalating in scale.",
    sources: [
      {
        label: 'National Security News, UK faces "civil collapse" if undersea cables are attacked',
        url: "https://nationalsecuritynews.com/2025/10/uk-faces-civil-collapse-if-undersea-cables-are-attacked/",
        date: "2025-10-01",
      },
    ],
  },
  {
    factor: "institutions",
    score: 35,
    evidence:
      "The documented Russian activity we hold concerns recruitment of proxies for physical operations rather than penetration of Parliament, government or universities. We hold no UK assessment of Russian institutional recruitment comparable to the MI5 alert issued about Chinese approaches to parliamentarians. Scored below China on that basis, not on a judgement that it does not happen.",
    sources: [
      {
        label: "Yahoo News / Reuters, UK monitors Russian spy ship, steps up undersea cable protection",
        url: "https://www.yahoo.com/news/uk-monitors-russian-spy-ship-141154948.html",
        date: "2025-11-19",
      },
    ],
  },
  {
    factor: "cyber",
    score: 58,
    evidence:
      "Persistent Russian state and state-tolerated criminal activity against UK energy, water, health and telecoms networks. Steady-state pressure rather than a step change in the last quarter. Through 2026 the activity has been repeatedly attributed on the record rather than inferred, and in July the UK sanctioned the FSB's 16th Centre and the Turla group for cyber espionage and sabotage against European networks.",
    sources: [
      {
        label: "Help Net Security, EU and UK blacklist Russia's cyber operators over efforts to destabilise Europe",
        url: "https://www.helpnetsecurity.com/2026/07/13/eu-uk-russia-cyber-activity-sanctions/",
        date: "2026-07-13",
      },
      {
        label:
          "Computer Weekly. UK needs better defences to protect undersea internet cables from Russian sabotage",
        url: "https://www.computerweekly.com/news/366631462/UK-needs-better-defences-to-protect-undersea-internet-cables-from-Russian-sabotage",
        date: "2026-01-01",
      },
    ],
  },
  {
    factor: "military",
    score: 64,
    evidence:
      "UK defence officials say Russian submarines have been deployed alongside the survey vessel Yantar (part of Russia's GUGI deep-sea unit) to map and potentially sabotage cables and pipelines near the UK, including the Britain–Ireland gas interconnector, and the government has stood up an Undersea Infrastructure Security Oversight Board in response. Separately the Royal Navy was activated 116 times during 2025–26 to shadow 61 Russian warships and 28 merchant vessels inside the UK Exclusive Economic Zone. The naval activity is monitored routine transit; the undersea mapping is not. Russia's embassy calls the cable claims “completely groundless”. On 27 August 2026 the Russian Foreign Ministry threatened for the first time to strike UK military targets \u201cinside and outside Ukraine\u201d, after Britain declassified Storm Shadow component designs for Ukrainian production. This is declared posture rather than action, and nothing has been struck, which is why the score moves well short of the top of the band.",
    sources: [
      {
        label: "Al Jazeera, Russia warns it could target UK in response to Kyiv firing British missiles",
        url: "https://www.aljazeera.com/news/2026/8/27/russia-warns-it-could-target-uk-in-response-to-kyiv-firing-british-missiles",
        date: "2026-08-27",
      },
      {
        label: "LBC, Russia threatens UK military targets as Kremlin says Britain is playing with fire",
        url: "https://www.lbc.co.uk/article/russia-uk-ukraine-military-5HjdgZk_2/",
        date: "2026-08-27",
      },
      {
        label:
          "Breaking Defense. UK accuses Russia of covert submarine operation threatening undersea cables",
        url: "https://breakingdefense.com/2026/04/uk-accuses-russia-of-covert-submarine-operation-threatening-undersea-cables/",
        date: "2026-04-01",
      },
      {
        label: "CNN, Russian spy ship enters British waters and directs lasers at military pilots",
        url: "https://www.cnn.com/2025/11/19/uk/russia-spy-ship-yantar-lasers-britain-intl",
        date: "2025-11-19",
      },
      {
        label: "UK Defence Journal, Royal Navy shadowed 61 Russian warships around UK waters",
        url: "https://ukdefencejournal.org.uk/royal-navy-shadowed-61-russian-warships-around-uk-waters/",
        date: "2026-06-01",
      },
    ],
  },
  {
    factor: "designation",
    score: 74,
    evidence:
      "Russia is a specified foreign power under the enhanced tier of the Foreign Influence Registration Scheme, one of only two states so designated. Ministers have moved to explicit public attribution: “We see you, we know what you're doing, and we will not shy away from robust action to protect this country”, and stood up new oversight machinery. No national threat level has been raised on account of Russia, which is the strongest available signal that the UK does not assess an attack as imminent. On 13 July 2026 the UK designated 24 individuals and entities over Russian cyber operations, alongside the EU's largest round of individual designations since 2022.",
    sources: [
      {
        label: "Help Net Security, EU and UK blacklist Russia's cyber operators over efforts to destabilise Europe",
        url: "https://www.helpnetsecurity.com/2026/07/13/eu-uk-russia-cyber-activity-sanctions/",
        date: "2026-07-13",
      },
      FIRS_ENHANCED,
      {
        label: "Yahoo News / Reuters, UK monitors Russian spy ship, steps up undersea cable protection",
        url: "https://www.yahoo.com/news/uk-monitors-russian-spy-ship-141154948.html",
        date: "2025-11-19",
      },
    ],
  },
  {
    factor: "direction",
    score: 70,
    evidence:
      "Russian naval activity around the UK is up roughly 30% over two years, and the government has created new machinery to watch undersea infrastructure. Against that, the war in Ukraine continues to absorb the bulk of Russian conventional capacity, and two short truces in 2026 were humanitarian pauses rather than settlements. Intensifying around Britain specifically, without a step change. That trajectory sharpened in August 2026: an explicit threat against UK military targets, Britain told it was \u201cone step away\u201d from legal complicity and warned of \u201ccatastrophic consequences\u201d.",
    sources: [
      {
        label: "Al Jazeera, Russia warns it could target UK in response to Kyiv firing British missiles",
        url: "https://www.aljazeera.com/news/2026/8/27/russia-warns-it-could-target-uk-in-response-to-kyiv-firing-british-missiles",
        date: "2026-08-27",
      },
      {
        label: "LBC, Russia threatens UK military targets as Kremlin says Britain is playing with fire",
        url: "https://www.lbc.co.uk/article/russia-uk-ukraine-military-5HjdgZk_2/",
        date: "2026-08-27",
      },
      {
        label: "UK Defence Journal, Royal Navy shadowed 61 Russian warships around UK waters",
        url: "https://ukdefencejournal.org.uk/royal-navy-shadowed-61-russian-warships-around-uk-waters/",
        date: "2026-06-01",
      },
      {
        label: "Wikipedia, 2026 Russo-Ukrainian truce",
        url: "https://en.wikipedia.org/wiki/2026_Russo-Ukrainian_truce",
        date: "2026-05-11",
      },
    ],
  },
];

export const chinaReadings: Reading[] = [
  {
    factor: "uk-soil",
    score: 22,
    evidence:
      "We hold no sourced evidence of Chinese-directed sabotage, arson or plots against people in the United Kingdom. What is documented concerns approaches to individuals and interference in institutions, which is scored under the next factor. This is a real difference from Russia and Iran rather than a gap we have failed to fill, and it is the main reason China scores below both on the composite.",
    sources: [],
  },
  {
    factor: "institutions",
    score: 60,
    evidence:
      "MI5 issued an espionage alert to parliamentarians in November 2025 over Chinese intelligence officers approaching them through professional networking sites. In June 2026 the Five Eyes partners issued a joint bulletin warning that Chinese military intelligence officers pose as recruiters and consultants for cover companies registered outside China, targeting people with access to classified or privileged information. Parliament debated foreign interference arrests connected to China in March 2026.",
    sources: [
      {
        label: "CNN, Chinese spies using LinkedIn to target British lawmakers, MI5 warns",
        url: "https://www.cnn.com/2025/11/12/uk/mi5-china-spy-warning-uk-parliament-intl",
        date: "2025-11-12",
      },
    ],
  },
  {
    factor: "cyber",
    score: 55,
    evidence:
      "Chinese state-linked cyber activity against UK institutions is described by the government as continual, and directed at obtaining information on UK policy and on individuals of interest.",
    sources: [
      {
        label: "CNN, Chinese spies using LinkedIn to target British lawmakers, MI5 warns",
        url: "https://www.cnn.com/2025/11/12/uk/mi5-china-spy-warning-uk-parliament-intl",
        date: "2025-11-12",
      },
    ],
  },
  {
    factor: "military",
    score: 10,
    evidence:
      "We hold no sourced evidence of Chinese naval or air activity against UK waters, UK airspace or the undersea infrastructure Britain depends on. Chinese military activity of concern to the UK is documented in the Indo-Pacific, which this factor does not measure. It asks about pressure on UK territory.",
    sources: [],
  },
  {
    factor: "designation",
    score: 30,
    evidence:
      "China is not on the enhanced tier of the Foreign Influence Registration Scheme. Russia and Iran were specified from 1 July 2025; the government has repeatedly declined to add China, which is the clearest official signal available that it does not place China in the same category.",
    sources: [FIRS_ENHANCED],
  },
  {
    factor: "direction",
    score: 55,
    evidence:
      "The MI5 director general said in October 2025 that state threat activity had risen by around a third in a year and was now comparable to, or greater than, the terrorism caseload. The Five Eyes bulletin of June 2026 points the same way.",
    sources: [
      {
        label: "CNN, Chinese spies using LinkedIn to target British lawmakers, MI5 warns",
        url: "https://www.cnn.com/2025/11/12/uk/mi5-china-spy-warning-uk-parliament-intl",
        date: "2025-11-12",
      },
    ],
  },
];

export const iranReadings: Reading[] = [
  {
    factor: "uk-soil",
    score: 65,
    evidence:
      "MI5 and police have responded to more than twenty Iran-backed plots presenting potentially lethal threats to British citizens and UK residents since the start of 2022. Iranian state actors have made extensive use of criminals as intermediaries (from international drug traffickers to low-level offenders), which widens reach while blurring attribution. The highest score any state carries on this factor.",
    sources: [
      {
        label: "MI5, Director General's annual threat lecture",
        url: "https://www.mi5.gov.uk/news/director-general-annual-threat-update",
        date: "2025-10-08",
      },
    ],
  },
  {
    factor: "institutions",
    score: 30,
    evidence:
      "The documented Iranian activity in the UK is overwhelmingly directed at individuals (dissidents, journalists and Jewish and Israeli-linked targets) through criminal proxies, rather than at recruiting inside Parliament, government or universities. Scored well below China on that basis.",
    sources: [
      {
        label: "MI5, Director General's annual threat lecture",
        url: "https://www.mi5.gov.uk/news/director-general-annual-threat-update",
        date: "2025-10-08",
      },
    ],
  },
  {
    factor: "cyber",
    score: 38,
    evidence:
      "Iranian cyber activity against UK targets is documented but sits well below the scale of Russian or Chinese operations against UK critical national infrastructure.",
    sources: [
      {
        label: "MI5, Director General's annual threat lecture",
        url: "https://www.mi5.gov.uk/news/director-general-annual-threat-update",
        date: "2025-10-08",
      },
    ],
  },
  {
    factor: "military",
    score: 12,
    evidence:
      "We hold no sourced evidence of Iranian naval or air activity against UK waters, UK airspace or UK undersea infrastructure. Iranian military activity of concern sits in the Gulf and the wider region, which this factor does not measure.",
    sources: [],
  },
  {
    factor: "designation",
    score: 70,
    evidence:
      "Iran has been a specified foreign power under the enhanced tier of the Foreign Influence Registration Scheme since 1 July 2025: one of only two states so designated, alongside Russia. The highest designation score available short of a raised national threat level.",
    sources: [FIRS_ENHANCED],
  },
  {
    factor: "direction",
    score: 52,
    evidence:
      "The UK declined to support offensive US and Israeli military action against Iran in late February 2026, then said in early March that it would provide defensive support to partners in the region. Regional escalation raises the risk of spillover onto UK soil, but the plot tempo reported by MI5 has not visibly stepped up in the period since.",
    sources: [
      {
        label: "MI5, Director General's annual threat lecture",
        url: "https://www.mi5.gov.uk/news/director-general-annual-threat-update",
        date: "2025-10-08",
      },
    ],
  },
];

/**
 * Every change to a score since the shared model was adopted, with the reason.
 *
 * This exists so that a score moving is visible rather than silent. Nothing
 * here is automated: coverage of a state can prompt a review, but only a person
 * changes a number, and the entry says who thought what and why.
 */
export const scoreChanges: Record<string, ScoreChange[]> = {
  russia: [
    {
      date: "2026-08-29",
      factor: "military",
      from: 52,
      to: 64,
      reason:
        "Russia threatened for the first time to strike UK military targets inside and outside Ukraine, after Britain declassified Storm Shadow component designs for Ukrainian production. Moved well short of the top of the band because this is declared posture, not action: nothing has been struck, and scoring a threat as though it were an attack is what discredits an index.",
      source: {
      label: "Al Jazeera, Russia warns it could target UK in response to Kyiv firing British missiles",
      url: "https://www.aljazeera.com/news/2026/8/27/russia-warns-it-could-target-uk-in-response-to-kyiv-firing-british-missiles",
      date: "2026-08-27",
    },
    },
    {
      date: "2026-08-29",
      factor: "direction",
      from: 55,
      to: 70,
      reason:
        "The August escalation is one-directional: an explicit threat against UK military targets, Britain told it is one step from legal complicity, and warnings of catastrophic consequences.",
      source: {
      label: "Al Jazeera, Russia warns it could target UK in response to Kyiv firing British missiles",
      url: "https://www.aljazeera.com/news/2026/8/27/russia-warns-it-could-target-uk-in-response-to-kyiv-firing-british-missiles",
      date: "2026-08-27",
    },
    },
    {
      date: "2026-08-29",
      factor: "designation",
      from: 68,
      to: 74,
      reason:
        "The UK designated 24 individuals and entities over Russian cyber operations in July, alongside the EU's largest round of individual designations since 2022. Official posture hardened materially.",
      source: {
      label: "Help Net Security, EU and UK blacklist Russia's cyber operators",
      url: "https://www.helpnetsecurity.com/2026/07/13/eu-uk-russia-cyber-activity-sanctions/",
      date: "2026-07-13",
    },
    },
    {
      date: "2026-08-29",
      factor: "cyber",
      from: 50,
      to: 58,
      reason:
        "Activity through 2026 has been attributed on the record rather than inferred, including the sanctioning of the FSB's 16th Centre and Turla for espionage and sabotage against European networks.",
      source: {
      label: "Help Net Security, EU and UK blacklist Russia's cyber operators",
      url: "https://www.helpnetsecurity.com/2026/07/13/eu-uk-russia-cyber-activity-sanctions/",
      date: "2026-07-13",
    },
    },
  ],
  china: [],
  iran: [],
};

export const READINGS_BY_SLUG: Record<string, Reading[]> = {
  russia: russiaReadings,
  china: chinaReadings,
  iran: iranReadings,
};

/** Factors carrying no evidence at all, for the honesty note on the page. */
export function gapsIn(readings: Reading[]): FactorId[] {
  return readings.filter((r) => !r.sources.length).map((r) => r.factor);
}
