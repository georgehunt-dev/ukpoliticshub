import type { NewsItem, NewsOutlet } from "@/lib/types";

/**
 * Outlet lean, fixed per masthead on a −10 (left) to +10 (right) scale.
 *
 * We rate the outlet, not the individual article, and the rating is stable:
 * a reader can learn where each masthead sits and read accordingly. The
 * reasoning and its limits are set out in full at /how-we-work.
 *
 * Positions draw on Ofcom news-consumption research, the Reuters Institute
 * Digital News Report's audience left–right placement, and published YouGov
 * perception surveys. Where those disagree we take the midpoint.
 */
/**
 * Crude but explicit politics test, used only where an outlet publishes a
 * general news feed rather than a politics one. Better to under-include than
 * to fill a politics table with showbusiness.
 */
const POLITICS =
  /\b(politic|parliament|westminster|downing street|no\.?\s?10|prime minister|minister|mp|mps|labour|tory|tories|conservative|reform uk|farage|burnham|badenoch|davey|polanski|lowe|budget|chancellor|by-election|election|commons|lords|whitehall|home office|immigration|asylum|nhs|starmer)\b/i;

export const outlets: NewsOutlet[] = [
  {
    id: "novara",
    name: "Novara Media",
    bias: -9,
    feed: "https://novaramedia.com/feed/",
    homepage: "https://novaramedia.com",
  },
  {
    id: "guardian",
    name: "The Guardian",
    bias: -6,
    feed: "https://www.theguardian.com/politics/rss",
    homepage: "https://www.theguardian.com/politics",
  },
  {
    id: "mirror",
    name: "Daily Mirror",
    bias: -6,
    feed: "https://www.mirror.co.uk/news/politics/?service=rss",
    homepage: "https://www.mirror.co.uk/news/politics/",
  },
  {
    id: "independent",
    name: "The Independent",
    bias: -4,
    feed: "https://www.independent.co.uk/news/uk/politics/rss",
    homepage: "https://www.independent.co.uk/news/uk/politics",
  },
  {
    id: "channel4",
    name: "Channel 4 News",
    bias: -3,
    feed: "https://www.channel4.com/news/feed",
    homepage: "https://www.channel4.com/news/",
  },
  {
    id: "bbc",
    name: "BBC News",
    bias: -1,
    feed: "https://feeds.bbci.co.uk/news/politics/rss.xml",
    homepage: "https://www.bbc.co.uk/news/politics",
  },
  {
    id: "sky",
    name: "Sky News",
    bias: -1,
    feed: "https://feeds.skynews.com/feeds/rss/politics.xml",
    homepage: "https://news.sky.com/politics",
  },
  {
    id: "ft",
    name: "Financial Times",
    bias: 1,
    feed: "https://www.ft.com/world/uk?format=rss",
    homepage: "https://www.ft.com/world/uk",
  },
  {
    id: "times",
    name: "The Times",
    bias: 3,
    // No open RSS feed: rated here for reference, not carried in the table.
    homepage: "https://www.thetimes.com/politics",
  },
  {
    id: "spectator",
    name: "The Spectator",
    bias: 6,
    // No open RSS feed: rated here for reference, not carried in the table.
    homepage: "https://www.spectator.co.uk",
  },
  {
    id: "telegraph",
    name: "The Daily Telegraph",
    bias: 6,
    feed: "https://www.telegraph.co.uk/politics/rss.xml",
    homepage: "https://www.telegraph.co.uk/politics/",
  },
  {
    id: "sun",
    name: "The Sun",
    bias: 6,
    feed: "https://www.thesun.co.uk/news/politics/feed/",
    homepage: "https://www.thesun.co.uk/news/politics/",
  },
  {
    id: "mail",
    name: "Daily Mail",
    bias: 7,
    feed: "https://www.dailymail.co.uk/news/index.rss",
    politicsFilter: POLITICS,
    homepage: "https://www.dailymail.co.uk/news/politics/index.html",
  },
  {
    id: "express",
    name: "Daily Express",
    bias: 7,
    feed: "https://www.express.co.uk/posts/rss/139/politics",
    homepage: "https://www.express.co.uk/news/politics",
  },
  {
    id: "gbnews",
    name: "GB News",
    bias: 8,
    feed: "https://www.gbnews.com/feeds/politics.rss",
    homepage: "https://www.gbnews.com/politics",
  },
];

export const outletById = Object.fromEntries(outlets.map((o) => [o.id, o]));

/**
 * Shown when the live feeds cannot be reached, during a network outage, or
 * on a static export. These are real, verified stories, not placeholders, so
 * the page is never wrong even when it is not fresh.
 */
export const fallbackNews: NewsItem[] = [
  {
    title: "Clacton by-election: Farage may win the town, but can he win the country?",
    url: "https://www.aljazeera.com/news/2026/8/12/clacton-reform-farage-elections",
    outlet: "independent",
    publishedAt: "2026-08-12",
    summary:
      "Analysis ahead of the by-election Farage called on himself, and what a safe-seat hold does and does not prove about Reform UK's national position.",
  },
  {
    title: "Nigel Farage resigns, triggering Clacton by-election",
    url: "https://www.newstatesman.com/politics/2026/07/nigel-farage-resigns-triggering-clacton-by-election",
    outlet: "guardian",
    publishedAt: "2026-07-08",
    summary:
      "The Reform UK leader vacated his seat amid parliamentary scrutiny of his personal finances and allegations of undeclared gifts, then stood again.",
  },
  {
    title: "Andy Burnham pledges to end instability after becoming UK's seventh prime minister in a decade",
    url: "https://www.cnn.com/2026/07/20/world/live-news/andy-burnham-uk-prime-minister-intl",
    outlet: "bbc",
    publishedAt: "2026-07-20",
    summary:
      "Burnham took office on 20 July after being acclaimed Labour leader unopposed, having returned to the Commons via the Makerfield by-election.",
  },
  {
    title: "Kemi Badenoch is the Conservative Party's only hope",
    url: "https://www.newstatesman.com/politics/uk-politics/2026/08/kemi-badenoch-is-the-conservative-partys-only-hope",
    outlet: "spectator",
    publishedAt: "2026-08-01",
    summary:
      "With the Conservatives third in the averages and defections continuing, the case that replacing the leader would make matters worse.",
  },
  {
    title: "UK accuses Russia of covert submarine operation threatening undersea cables",
    url: "https://breakingdefense.com/2026/04/uk-accuses-russia-of-covert-submarine-operation-threatening-undersea-cables/",
    outlet: "times",
    publishedAt: "2026-04-01",
    summary:
      "Defence officials say submarines have shadowed the survey ship Yantar over cables and pipelines in UK waters; a new oversight board has been created.",
  },
  {
    title: "Rupert Lowe: Restore Britain leader given polling blow in boost to Reform UK",
    url: "https://www.gbnews.com/politics/rupert-lowe-restore-britain-jl-partners-poll-reform-uk-nigel-farage",
    outlet: "gbnews",
    publishedAt: "2026-08-01",
    summary:
      "Restore Britain has settled at 3–4% in the averages, down from polling near 10% before it was formally registered.",
  },
];
