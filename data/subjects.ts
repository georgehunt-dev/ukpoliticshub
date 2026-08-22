import type { PhotoSlug } from "@/lib/photos";

/**
 * The subjects a reader can look up on the news desk.
 *
 * Each one carries two sets of terms. `own` is what makes a story directly
 * about the subject. `linked` is the other half of a leader/party pair — a
 * Reform UK policy story belongs on Nigel Farage's page too, because he leads
 * the party and drove the policy, but the reader is told it arrived that way
 * rather than being shown it as though he was named.
 *
 * That distinction exists because the first version of this quietly filed a
 * story about a Labour MP under Nigel Farage. Anything on a subject page now
 * has to be traceable to a term that put it there.
 */

export type SubjectKind = "person" | "party" | "issue";

export type Subject = {
  slug: string;
  name: string;
  /** Shown under the name — "Reform UK leader", "Party", "Issue". */
  role: string;
  kind: SubjectKind;
  /** Terms that make a story directly about this subject. */
  own: string[];
  /** Terms belonging to the linked party or leader. */
  linked: string[];
  /** How linked coverage is labelled: "via Reform UK". */
  linkedName?: string;
  /** Portrait slug for people, photo slug for issues. */
  portrait?: string;
  photo?: PhotoSlug;
};

const LEADERS: Subject[] = [
  {
    slug: "andy-burnham", name: "Andy Burnham", role: "Prime Minister", kind: "person",
    own: ["burnham"], linked: ["labour"], linkedName: "Labour", portrait: "andy-burnham",
  },
  {
    slug: "nigel-farage", name: "Nigel Farage", role: "Reform UK leader", kind: "person",
    own: ["farage"], linked: ["reform uk", "reform"], linkedName: "Reform UK", portrait: "nigel-farage",
  },
  {
    slug: "kemi-badenoch", name: "Kemi Badenoch", role: "Conservative leader", kind: "person",
    own: ["badenoch"], linked: ["conservative", "conservatives", "tory", "tories"],
    linkedName: "the Conservatives", portrait: "kemi-badenoch",
  },
  {
    slug: "zack-polanski", name: "Zack Polanski", role: "Green leader", kind: "person",
    own: ["polanski"], linked: ["green party", "greens"], linkedName: "the Greens", portrait: "zack-polanski",
  },
  {
    slug: "ed-davey", name: "Sir Ed Davey", role: "Liberal Democrat leader", kind: "person",
    own: ["davey"], linked: ["liberal democrat", "liberal democrats", "lib dem", "lib dems"],
    linkedName: "the Liberal Democrats", portrait: "ed-davey",
  },
  {
    slug: "rupert-lowe", name: "Rupert Lowe", role: "Restore Britain leader", kind: "person",
    own: ["lowe"], linked: ["restore britain"], linkedName: "Restore Britain", portrait: "rupert-lowe",
  },
];

const PARTIES: Subject[] = [
  {
    slug: "labour", name: "Labour", role: "Party", kind: "party",
    own: ["labour"], linked: ["burnham"], linkedName: "Andy Burnham", photo: "westminster",
  },
  {
    slug: "reform-uk", name: "Reform UK", role: "Party", kind: "party",
    own: ["reform uk", "reform"], linked: ["farage"], linkedName: "Nigel Farage", photo: "westminster",
  },
  {
    slug: "conservatives", name: "The Conservatives", role: "Party", kind: "party",
    own: ["conservative", "conservatives", "tory", "tories"], linked: ["badenoch"],
    linkedName: "Kemi Badenoch", photo: "westminster",
  },
  {
    slug: "green-party", name: "The Greens", role: "Party", kind: "party",
    own: ["green party", "greens"], linked: ["polanski"], linkedName: "Zack Polanski", photo: "energy",
  },
  {
    slug: "liberal-democrats", name: "Liberal Democrats", role: "Party", kind: "party",
    own: ["liberal democrat", "liberal democrats", "lib dem", "lib dems"], linked: ["davey"],
    linkedName: "Sir Ed Davey", photo: "westminster",
  },
];

const ISSUES: Subject[] = [
  {
    slug: "immigration", name: "Immigration & asylum", role: "Issue", kind: "issue",
    own: ["immigration", "asylum", "migrant", "migrants", "small boat", "small boats",
          "deport", "deportation", "channel crossing", "channel crossings", "visa", "refugee"],
    linked: [], photo: "dover",
  },
  {
    slug: "economy", name: "Tax & the economy", role: "Issue", kind: "issue",
    own: ["tax", "taxes", "taxation", "budget", "chancellor", "inflation", "economy",
          "borrowing", "public spending", "national insurance", "growth figures"],
    linked: [], photo: "economy",
  },
  {
    slug: "nhs", name: "NHS & health", role: "Issue", kind: "issue",
    own: ["nhs", "hospital", "hospitals", "social care", "waiting list", "waiting lists",
          "doctors", "nurses", "gp surgery"],
    linked: [], photo: "health",
  },
  {
    slug: "energy", name: "Energy & net zero", role: "Issue", kind: "issue",
    own: ["net zero", "energy bills", "climate", "renewable", "renewables", "north sea",
          "electricity", "emissions", "nuclear power"],
    linked: [], photo: "energy",
  },
  {
    slug: "crime", name: "Crime & justice", role: "Issue", kind: "issue",
    own: ["crime", "police", "policing", "prison", "prisons", "sentencing", "courts",
          "shoplifting", "knife crime"],
    linked: [], photo: "justice",
  },
  {
    slug: "housing", name: "Housing", role: "Issue", kind: "issue",
    own: ["housing", "housebuilding", "planning reform", "renters", "landlord", "landlords",
          "leasehold", "mortgage", "mortgages", "homelessness"],
    linked: [], photo: "london",
  },
  {
    slug: "defence", name: "Defence & foreign policy", role: "Issue", kind: "issue",
    own: ["defence", "nato", "ukraine", "armed forces", "military", "royal navy",
          "foreign policy", "defence spending"],
    linked: [], photo: "royal-navy",
  },
  /* The three states carrying a threat assessment. These exist so that
     coverage can be shown against the assessment — the score itself never
     moves on a headline. */
  {
    slug: "russia", name: "Russia", role: "State threat", kind: "issue",
    own: ["russia", "russian", "putin", "kremlin", "moscow"],
    linked: [], photo: "russia",
  },
  {
    slug: "china", name: "China", role: "State threat", kind: "issue",
    own: ["china", "chinese", "beijing", "xi jinping"],
    linked: [], photo: "china",
  },
  {
    slug: "iran", name: "Iran", role: "State threat", kind: "issue",
    own: ["iran", "iranian", "tehran", "irgc", "revolutionary guard"],
    linked: [], photo: "iran",
  },
  {
    slug: "europe", name: "Europe & the ECHR", role: "Issue", kind: "issue",
    own: ["echr", "european convention", "human rights act", "brexit", "european union",
          "eu deal", "rejoin"],
    linked: [], photo: "europe-eu",
  },
];

export const subjects: Subject[] = [...LEADERS, ...PARTIES, ...ISSUES];

export const subjectBySlug = Object.fromEntries(
  subjects.map((s) => [s.slug, s])
) as Record<string, Subject>;
