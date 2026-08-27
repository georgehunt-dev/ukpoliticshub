import type { PartySlug, PolicyArea } from "@/lib/types";

/**
 * What the question is actually about.
 *
 * The first version of the ask bar scored questions by word overlap against a
 * bag of text. It answered "what is the Conservatives' immigration policy?"
 * with Labour on energy, because "conservatives" never matched "conservative",
 * no stemming, while "policy" matched the area name "Defence & foreign
 * policy" and half the policy summaries. One generic word decided the answer.
 *
 * So the question is now read for what it names: a party, a subject, a figure
 * we track, a constituency, and the answer is looked up rather than ranked.
 * A reader asking about one party's position on one subject gets exactly that
 * passage, and nothing is stitched together across subjects.
 */

/** Words that carry no signal in a question about British politics. */
export const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "was", "were",
  "what", "whats", "which", "who", "whom", "how", "why", "when", "where", "do", "does", "did",
  "can", "i", "my", "me", "we", "our", "you", "your", "it", "its", "they", "their", "them",
  "this", "that", "about", "with", "from", "at", "by", "be", "been", "have", "has", "had",
  "as", "if", "so", "much", "many", "any", "all", "s", "uk", "britain", "british", "politics",
  // Generic in this domain, and previously the words doing the damage.
  "policy", "policies", "stance", "stances", "position", "positions", "view", "views",
  "think", "thinks", "say", "says", "said", "believe", "believes", "plan", "plans",
  "party", "parties", "government", "please", "tell", "explain", "know",
]);

/** Crude but sufficient: "conservatives" and "conservative" must be one word. */
export function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("es") && !word.endsWith("ses")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

/** Normalised form of a whole question, for phrase matching. */
export function normalise(text: string): string {
  return ` ${text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()} `;
}

/* ── What names a party ─────────────────────────────────────────────────── */

/**
 * Three party names are also ordinary English words, and the first version of
 * this read all three wrong: "Labour's NHS reform plan" was answered as Labour
 * versus Reform, "Labour's green energy policy" as Labour versus the Greens,
 * and "the pros and cons of net zero" as a Conservative policy question: the
 * abbreviation "cons".
 *
 * So the abbreviations are gone, and where a party's name doubles as a common
 * word it is only read as the party when the surrounding words don't give it
 * away as the ordinary sense.
 */
const PARTY_ALIASES: { slug: PartySlug; phrases: string[] }[] = [
  { slug: "labour", phrases: ["labour", "starmer", "burnham"] },
  {
    slug: "conservative",
    phrases: ["conservative", "conservatives", "tory", "tories", "badenoch"],
  },
  { slug: "reform", phrases: ["reform", "reform uk", "farage"] },
  {
    slug: "liberal-democrats",
    phrases: [
      "lib dem", "lib dems", "libdem", "libdems", "liberal democrat", "liberal democrats",
      "liberal", "davey",
    ],
  },
  { slug: "green", phrases: ["green", "greens", "green party", "polanski"] },
  { slug: "restore-britain", phrases: ["restore", "restore britain", "lowe"] },
];

/**
 * Where a bare name is the English word rather than the party. Each entry
 * gives the words that, sitting either side of it, settle the question.
 */
const ORDINARY_SENSE: { word: string; before?: string[]; after?: string[] }[] = [
  {
    word: "reform",
    before: [
      "nhs", "health", "welfare", "planning", "lords", "tax", "benefits", "immigration",
      "asylum", "education", "constitutional", "electoral", "social care", "prison",
    ],
    after: ["plan", "plans", "bill", "bills", "agenda", "package", "programme", "act"],
  },
  {
    word: "green",
    before: ["labour", "conservative", "tory", "national"],
    after: [
      "energy", "jobs", "belt", "levy", "levies", "transition", "hydrogen", "industry",
      "growth", "investment", "steel", "technology",
    ],
  },
  {
    word: "restore",
    after: ["funding", "trust", "confidence", "order", "faith", "services", "the"],
  },
];

/** True when this occurrence of the word is plainly the everyday one. */
function readsAsOrdinaryWord(haystack: string, word: string): boolean {
  const rule = ORDINARY_SENSE.find((r) => r.word === word);
  if (!rule) return false;
  for (const before of rule.before ?? []) {
    if (haystack.includes(` ${before} ${word} `)) return true;
  }
  for (const after of rule.after ?? []) {
    if (haystack.includes(` ${word} ${after} `)) return true;
  }
  return false;
}

export function partiesIn(question: string): PartySlug[] {
  const haystack = normalise(question);
  const found: PartySlug[] = [];

  for (const { slug, phrases } of PARTY_ALIASES) {
    // An unambiguous phrase ("reform uk", "polanski") always counts. A bare
    // name counts only if it doesn't read as the everyday word.
    const matched = phrases.some((phrase) => {
      if (!haystack.includes(` ${phrase} `)) return false;
      const isBareName = !phrase.includes(" ");
      return !(isBareName && readsAsOrdinaryWord(haystack, phrase));
    });
    if (matched) found.push(slug);
  }

  return found;
}

/* ── What names a subject ───────────────────────────────────────────────── */

const AREA_ALIASES: { area: PolicyArea; phrases: string[] }[] = [
  {
    area: "immigration",
    phrases: [
      "immigration", "immigrant", "immigrants", "asylum", "migrant", "migrants", "migration",
      "small boats", "border", "borders", "deport", "deportation", "deportations", "ilr",
      "indefinite leave", "refugee", "refugees", "visa", "visas",
    ],
  },
  {
    area: "economy",
    phrases: [
      "economy", "economic", "tax", "taxes", "taxation", "taxing", "spending", "fiscal",
      "budget", "growth", "debt", "borrowing", "wages", "cost of living", "inflation",
      "income tax", "national insurance", "vat",
    ],
  },
  {
    area: "health",
    phrases: [
      "nhs", "health", "healthcare", "health care", "social care", "hospital", "hospitals",
      "gp", "gps", "doctors", "nurses", "waiting list", "waiting lists", "dentist", "dentists",
    ],
  },
  {
    area: "housing",
    phrases: [
      "housing", "house building", "housebuilding", "homes", "home ownership", "planning",
      "rent", "rents", "renters", "landlord", "landlords", "leasehold", "mortgage",
      "mortgages", "homeless", "homelessness",
    ],
  },
  {
    area: "crime",
    phrases: [
      "crime", "crimes", "criminal", "police", "policing", "justice", "prison", "prisons",
      "sentencing", "sentences", "courts", "shoplifting", "knife crime", "antisocial",
    ],
  },
  {
    area: "energy",
    phrases: [
      "energy", "net zero", "climate", "climate change", "electricity", "energy bills",
      "renewable", "renewables", "wind", "solar", "nuclear power", "oil", "gas", "emissions",
      "north sea",
    ],
  },
  {
    area: "education",
    phrases: [
      "education", "school", "schools", "university", "universities", "tuition", "student",
      "students", "teachers", "childcare", "nursery", "private schools", "vat on school fees",
    ],
  },
  {
    area: "defence",
    phrases: [
      "defence", "defense", "military", "army", "navy", "raf", "armed forces", "nato",
      "ukraine", "foreign policy", "foreign affairs", "trident", "nuclear deterrent",
      "defence spending",
    ],
  },
  {
    area: "europe",
    phrases: [
      "europe", "european", "echr", "european convention", "human rights", "eu", "brexit",
      "rejoin", "single market", "customs union", "constitution", "supreme court",
    ],
  },
  {
    area: "culture",
    phrases: [
      "culture", "media", "bbc", "broadcasting", "licence fee", "license fee", "free speech",
      "speech", "arts", "trans", "gender", "woke", "culture war",
    ],
  },
];

export function areasIn(question: string): PolicyArea[] {
  const haystack = normalise(question);
  const found: PolicyArea[] = [];
  for (const { area, phrases } of AREA_ALIASES) {
    if (phrases.some((phrase) => haystack.includes(` ${phrase} `))) found.push(area);
  }
  return found;
}

/* ── What names a figure we track ───────────────────────────────────────── */

export type FigureKey =
  | "polls"
  | "terrorism"
  | "russia"
  | "crossings"
  | "pm-approval"
  | "election-date";

const FIGURE_ALIASES: { key: FigureKey; phrases: string[] }[] = [
  {
    key: "polls",
    phrases: [
      "poll", "polls", "polling", "polling average", "rolling average", "race for no 10",
      "race for number 10", "who is leading", "who is winning", "who is ahead", "standings",
      "vote share", "voting intention",
    ],
  },
  {
    key: "terrorism",
    phrases: ["terrorism", "terror", "terrorist", "threat level", "terror threat"],
  },
  {
    key: "russia",
    phrases: ["russia", "russian", "moscow", "putin", "russia pressure", "sabotage"],
  },
  {
    key: "crossings",
    phrases: [
      "channel crossings", "channel crossing", "crossings", "boat arrivals", "how many crossed",
      "small boat arrivals",
    ],
  },
  {
    key: "pm-approval",
    phrases: [
      "prime minister", "pm approval", "approval rating", "approval ratings", "net approval",
      "how popular",
    ],
  },
  {
    key: "election-date",
    phrases: [
      "next election", "next general election", "general election", "when is the election",
      "election due", "election date", "go to the polls",
    ],
  },
];

export function figuresIn(question: string): FigureKey[] {
  const haystack = normalise(question);
  const found: FigureKey[] = [];
  for (const { key, phrases } of FIGURE_ALIASES) {
    if (phrases.some((phrase) => haystack.includes(` ${phrase} `))) found.push(key);
  }
  return found;
}
