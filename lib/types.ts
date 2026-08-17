/** A citation. Nothing factual appears on this site without one attached. */
export type Source = {
  label: string;
  url: string;
  /** ISO date of publication or fieldwork end. */
  date?: string;
};

/**
 * The fixed set of policy areas every party is measured against, so positions
 * are comparable rather than each party being described on its own terms.
 * Where a party has no position we could source, the page says so — a thin
 * platform is itself a finding, not something to paper over.
 */
export type PolicyArea =
  | "immigration"
  | "economy"
  | "health"
  | "housing"
  | "crime"
  | "energy"
  | "education"
  | "defence"
  | "europe"
  | "culture";

export type Policy = {
  area: PolicyArea;
  /**
   * Eight to twelve words capturing the position, for the comparison grid.
   * Six full positions stacked is a wall of text; six of these is scannable
   * in fifteen seconds, with the full text one click away.
   */
  summary: string;
  /** The party's stated position, in two or three sentences. */
  position: string;
  /** Where it is contested, qualified, or short on detail. */
  caveat?: string;
  /**
   * The specific source behind *this* position, so a reader can go straight to
   * it rather than to a list of everything the party page draws on. Omitted
   * where we cannot attribute a policy precisely — the party-level sources
   * still apply, and pointing at an approximate link would be worse than
   * pointing at none.
   */
  source?: Source;
};

export type PartySlug =
  | "labour"
  | "conservative"
  | "reform"
  | "liberal-democrats"
  | "green"
  | "restore-britain";

export type Person = {
  slug: string;
  name: string;
  role: string;
  /** Commons seat or other office held. */
  seat?: string;
  /** Two or three sentences: who they are and where they came from. */
  background?: string;
  /** Track record a reader can weigh — offices held, results delivered. */
  credibility?: string;
  /** Documented controversies. Always attributed, never asserted as verdict. */
  concerns?: string;
  sources?: Source[];
};

export type Party = {
  slug: PartySlug;
  name: string;
  shortName: string;
  colour: string;
  /** Position on a −10 (left) to +10 (right) economic/social composite. */
  spectrum: number;
  spectrumNote: string;
  /**
   * One line for the spectrum strip on the front page — what the placement
   * means in practice. Shorter and plainer than spectrumNote, which is the
   * full reasoning on the party's own page.
   */
  spectrumGloss: string;
  founded: string;
  leader: Person;
  deputy?: Person;
  mps: number | string;
  membership?: string;
  membershipSource?: Source;
  councillors?: number | string;
  /** One-paragraph statement of what the party is, neutrally worded. */
  summary: string;
  ideology: string[];
  policies: Policy[];
  /** Where the policy positions above were drawn from. */
  policySources?: Source[];
  credibility: string[];
  concerns: string[];
  frontbench: Person[];
  recentNews: { headline: string; date: string; source: Source }[];
  sources: Source[];
};

export type PollEntry = {
  party: PartySlug;
  pct: number;
  /** Change in points since the previous published average. */
  change: number;
};

export type Poll = {
  pollster: string;
  fieldwork: string;
  sampleSize?: number;
  url: string;
  results: Partial<Record<PartySlug, number>>;
};

export type ThreatFactor = {
  name: string;
  /** 0–100 contribution score for this factor alone. */
  score: number;
  /** Weight in the composite, expressed in percentage points. Sums to 100. */
  weight: number;
  evidence: string;
  sources: Source[];
};

export type NewsOutlet = {
  id: string;
  name: string;
  /** −10 (left) to +10 (right). Fixed per outlet, see /how-we-work. */
  bias: number;
  /**
   * RSS endpoint used by the live news adapter. Omitted where an outlet
   * publishes no open feed — it still appears in the ratings table.
   */
  feed?: string;
  /**
   * Applied to title + summary + URL where the only available feed is a
   * general news one rather than a politics section feed.
   */
  politicsFilter?: RegExp;
  homepage: string;
};

export type NewsItem = {
  /**
   * The publisher's own thumbnail, taken from the feed. Feeds carry these for
   * syndication; we show them next to a link back to the original. Eleven of
   * the thirteen feeds provide one — Channel 4 and the FT do not, and those
   * fall back to a generic press photograph.
   */
  imageUrl?: string;
  title: string;
  url: string;
  outlet: string;
  publishedAt: string;
  summary?: string;
};

export type ElectionEvent = {
  name: string;
  date: string;
  /** Whether the date is fixed in law or a latest-possible deadline. */
  certainty: "scheduled" | "deadline" | "expected";
  detail: string;
  source: Source;
};
