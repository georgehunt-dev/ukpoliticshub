import type { Party, PartySlug } from "@/lib/types";

/**
 * Party dossiers.
 *
 * Ground rules for this file, because it is the part of the site most likely
 * to be accused of bias:
 *   • "concerns" lists documented, attributable matters — court cases,
 *     regulator findings, published academic classification, reporting from
 *     named outlets. It never states a verdict of our own.
 *   • Where a party disputes a characterisation, the dispute is printed next
 *     to it.
 *   • Spectrum positions are editorial and explained at /how-we-work.
 *   • Seat counts state the basis on which they are given.
 */

export const parties: Party[] = [
  /* ── Labour ──────────────────────────────────────────────────────────── */
  {
    slug: "labour",
    name: "The Labour Party",
    shortName: "Labour",
    colour: "#e4003b",
    spectrum: -3,
    spectrumNote:
      "Centre-left. In office since 2024 on a broadly fiscally orthodox platform; the Burnham leadership is positioned to its predecessor's left on public ownership and devolution.",
    founded: "1900",
    mps: "411 seats won at the 2024 general election",
    summary:
      "The party of government since July 2024, and since 20 July 2026 led by Andy Burnham following Keir Starmer's resignation. Burnham inherited a party that had fallen to 16% in some polls in May 2026 and has recovered to the low-to-mid twenties, leading most published averages again.",
    ideology: ["Social democracy", "Democratic socialism (Labour left)", "Trade unionism"],
    policies: [
      {
        area: "Constitution and devolution",
        position:
          "Burnham's defining political project as Greater Manchester mayor was devolution of transport, housing and skills budgets out of Whitehall — the basis on which he campaigned for the leadership.",
      },
      {
        area: "Public health",
        position:
          "The Tobacco and Vapes Bill passed on 21 April 2026, making it illegal to sell cigarettes to anyone born after 2008 — a generational smoking ban.",
      },
      {
        area: "Stability",
        position:
          "Burnham's stated first priority on entering Downing Street was ending the instability of seven Prime Ministers in ten years.",
      },
    ],
    credibility: [
      "Won a Commons majority at the 2024 general election and has governed since.",
      "Burnham was elected Mayor of Greater Manchester three times and served as Health Secretary and Chief Secretary to the Treasury under Brown.",
      "He took the leadership on 379 nominations — over 94% of Labour MPs — and was unopposed.",
    ],
    concerns: [
      "Seven Prime Ministers in ten years, two of them Labour, is itself the instability Burnham says he was chosen to end.",
      "The Mandelson affair ran through the first half of 2026: he resigned from the party on 1 February and the Lords on 3 February over the Epstein files, and was arrested on 23 February on suspicion of misconduct in public office. Downing Street's chief of staff and communications director both resigned in the fallout.",
      "Ipsos finds the public divided on the government's direction and unconvinced it will deliver on immigration and the cost of living, despite Burnham's strong personal ratings.",
      "The Greens took Gorton and Denton from Labour in February 2026 — the first Green by-election gain in history — with Labour third.",
    ],
    leader: {
      slug: "andy-burnham",
      name: "Andy Burnham",
      role: "Leader and Prime Minister",
      seat: "MP for Makerfield",
      background:
        "MP for Leigh 2001–2017, Chief Secretary to the Treasury and Health Secretary under Gordon Brown, then Mayor of Greater Manchester from 2017 to 2026. Ran for the Labour leadership in 2010 and 2015, losing both times.",
      credibility:
        "Three mayoral election wins; ran Greater Manchester's devolved transport, housing and health budgets. Currently the highest-rated party leader in both Opinium and Ipsos polling.",
      concerns:
        "Was blocked from standing in the Gorton and Denton by-election in January 2026, and needed a second by-election, in Makerfield, to re-enter the Commons and become eligible for the leadership.",
      sources: [
        {
          label: "CFR — Andy Burnham: what to expect from the UK's new Prime Minister",
          url: "https://www.cfr.org/articles/andy-burnham-what-to-expect-from-the-uks-new-prime-minister",
        },
      ],
    },
    deputy: {
      slug: "louise-haigh",
      name: "Louise Haigh",
      role: "First Secretary of State",
      seat: "MP for Sheffield Heeley",
      background:
        "Appointed First Secretary of State on 20 July 2026. The office of Deputy Prime Minister is currently vacant.",
    },
    frontbench: [
      { slug: "john-healey", name: "John Healey", role: "Chancellor of the Exchequer", seat: "MP for Rawmarsh and Conisbrough" },
      { slug: "ed-miliband", name: "Ed Miliband", role: "Foreign Secretary", seat: "MP for Doncaster North", background: "Leader of the Labour Party 2010–2015 and Energy Secretary until July 2026." },
      { slug: "shabana-mahmood", name: "Shabana Mahmood", role: "Home Secretary", seat: "MP for Birmingham Ladywood" },
      { slug: "wes-streeting", name: "Wes Streeting", role: "Defence Secretary", seat: "MP for Ilford North", background: "Health Secretary from 2024 until the July 2026 reshuffle." },
      { slug: "yvette-cooper", name: "Yvette Cooper", role: "Health Secretary", seat: "MP for Pontefract, Castleford and Knottingley", background: "Home Secretary from 2024 to 2026." },
      { slug: "alex-norris", name: "Alex Norris", role: "Lord Chancellor and Justice Secretary", seat: "MP for Nottingham North and Kimberley" },
      { slug: "lucy-powell", name: "Lucy Powell", role: "Education Secretary", seat: "MP for Manchester Central" },
      { slug: "pat-mcfadden", name: "Pat McFadden", role: "Work and Pensions Secretary", seat: "MP for Wolverhampton South East" },
      { slug: "jonathan-reynolds", name: "Jonathan Reynolds", role: "Business, Science and Trade Secretary", seat: "MP for Stalybridge and Hyde" },
      { slug: "angela-rayner", name: "Angela Rayner", role: "Housing and Communities Secretary", seat: "MP for Ashton-under-Lyne", background: "Deputy Leader of the Labour Party and Deputy Prime Minister from 2024." },
      { slug: "heidi-alexander", name: "Heidi Alexander", role: "Transport Secretary", seat: "MP for Swindon South" },
      { slug: "miatta-fahnbulleh", name: "Miatta Fahnbulleh", role: "Energy and Net Zero Secretary", seat: "MP for Peckham" },
      { slug: "lisa-nandy", name: "Lisa Nandy", role: "Culture, Media and Sport Secretary", seat: "MP for Wigan" },
      { slug: "angela-eagle", name: "Angela Eagle", role: "Environment, Food and Rural Affairs Secretary", seat: "MP for Wallasey" },
      { slug: "chris-bryant", name: "Chris Bryant", role: "Northern Ireland Secretary", seat: "MP for Rhondda and Ogmore" },
      { slug: "douglas-alexander", name: "Douglas Alexander", role: "Scotland Secretary", seat: "MP for Lothian East" },
      { slug: "stephen-kinnock", name: "Stephen Kinnock", role: "Wales Secretary", seat: "MP for Aberafan Maesteg" },
    ],
    recentNews: [
      {
        headline: "Burnham becomes Prime Minister, pledging to end a decade of instability",
        date: "2026-07-20",
        source: {
          label: "CNN",
          url: "https://www.cnn.com/2026/07/20/world/live-news/andy-burnham-uk-prime-minister-intl",
          date: "2026-07-20",
        },
      },
      {
        headline: "Starmer announces his resignation after losing the confidence of Labour MPs",
        date: "2026-06-22",
        source: {
          label: "Wikipedia — 2026 Labour Party leadership election",
          url: "https://en.wikipedia.org/wiki/2026_Labour_Party_leadership_election",
          date: "2026-06-22",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Burnham ministry",
        url: "https://en.wikipedia.org/wiki/Burnham_ministry",
      },
      {
        label: "Wikipedia — 2026 in United Kingdom politics and government",
        url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
      },
    ],
  },

  /* ── Reform UK ───────────────────────────────────────────────────────── */
  {
    slug: "reform",
    name: "Reform UK",
    shortName: "Reform",
    colour: "#1eb8d0",
    spectrum: 8,
    spectrumNote:
      "Right to populist right. Restrictionist on immigration, opposed to net zero targets, and campaigning against both established parties.",
    founded: "2018 (as the Brexit Party; renamed 2021)",
    mps: "5 at the 2024 general election, since increased by defections from the Conservatives",
    summary:
      "Led by Nigel Farage, Reform UK topped national polls from early 2025 through much of 2026 and absorbed a run of senior Conservative defectors — Nadhim Zahawi, Robert Jenrick and Suella Braverman all crossed in January 2026. It has slipped behind Labour in the most recent averages.",
    ideology: ["Right-wing populism", "Immigration restrictionism", "Economic liberalism", "Anti-net zero"],
    policies: [
      {
        area: "Immigration",
        position:
          "The party's central issue: sharp reductions in legal migration and a hard line on illegal crossings. Rupert Lowe's departure was triggered in part by his claim that Reform was \"watering down\" deportation policy — placing Reform to the left of Restore Britain on this.",
      },
      {
        area: "Energy",
        position: "Opposition to net zero targets and the costs attached to them.",
      },
      {
        area: "The state",
        position:
          "Richard Tice heads a \"government efficiency\" brief; the party frames itself against the Westminster establishment and both main parties.",
      },
    ],
    credibility: [
      "Led national voting-intention polling from early 2025 into 2026.",
      "Attracted three former Conservative cabinet-rank figures in a single month in January 2026.",
      "Held Clacton on 63.3% at the August 2026 by-election, though with no major party standing against it.",
    ],
    concerns: [
      "Farage resigned his seat on 8 July 2026 amid parliamentary scrutiny of his personal finances and allegations of undeclared gifts and support, including a reported £5m donation from Christopher Harborne revealed in April 2026 for personal protection.",
      "The Clacton by-election he called on himself was uncontested by every major party, so the 63.3% result is not a competitive test.",
      "Turnout in that by-election fell 13.6 points, and the novelty candidate Count Binface took 26.9% — read by commentators as a protest at the exercise.",
      "The party has lost figures in both directions: Rupert Lowe was suspended in March 2025 over allegations of threatening behaviour and bullying, which he denied, and went on to found a rival party to its right.",
    ],
    leader: {
      slug: "nigel-farage",
      name: "Nigel Farage",
      role: "Leader",
      seat: "MP for Clacton",
      background:
        "Leader of UKIP for most of 2006–2016, an MEP for 20 years, and the leading public figure of the Leave campaign. Elected to the Commons at the eighth attempt in 2024, re-elected at the by-election he triggered himself in August 2026.",
      credibility:
        "Has built three separate political vehicles into national forces and led his party to the top of the polls for over a year.",
      concerns:
        "Resigned and re-contested his seat amid scrutiny of undeclared gifts and a £5m donation for personal protection.",
      sources: [
        {
          label: "Al Jazeera — Why has UK Reform's Nigel Farage resigned as MP?",
          url: "https://www.aljazeera.com/news/2026/7/8/why-has-uk-reforms-nigel-farage-resigned-as-mp-what-happens-next",
          date: "2026-07-08",
        },
      ],
    },
    deputy: {
      slug: "richard-tice",
      name: "Richard Tice",
      role: "Deputy Leader",
      seat: "MP for Boston and Skegness",
      background:
        "Led the Brexit Party and then Reform UK before handing the leadership back to Farage in 2024. Also holds the government efficiency brief, and would be Deputy Prime Minister were Reform to form a government.",
    },
    frontbench: [
      { slug: "robert-jenrick", name: "Robert Jenrick", role: "Treasury spokesman", seat: "MP for Newark", background: "Conservative Immigration Minister and 2024 leadership runner-up; lost the Conservative whip on 15 January 2026 and joined Reform the same day." },
      { slug: "suella-braverman", name: "Suella Braverman", role: "Home Affairs, Education and Equality spokeswoman", seat: "MP for Fareham and Waterlooville", background: "Conservative Home Secretary 2022–2023 and Attorney General; defected to Reform UK on 26 January 2026." },
      { slug: "lee-anderson", name: "Lee Anderson", role: "Party Chairman and Chief Whip", seat: "MP for Ashfield", background: "Former Conservative deputy chairman; Reform's first MP after defecting in 2024." },
      { slug: "zia-yusuf", name: "Zia Yusuf", role: "Head of Policy", background: "Businessman and former party chairman." },
    ],
    recentNews: [
      {
        headline: "Farage holds Clacton with 63.3% after every major party stands aside",
        date: "2026-08-13",
        source: {
          label: "Wikipedia — 2026 Clacton by-election",
          url: "https://en.wikipedia.org/wiki/2026_Clacton_by-election",
          date: "2026-08-13",
        },
      },
      {
        headline: "Farage reveals £5m donation from Christopher Harborne for personal protection",
        date: "2026-04-29",
        source: {
          label: "Wikipedia — 2026 in United Kingdom politics and government",
          url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
          date: "2026-04-29",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Frontbench team of Nigel Farage",
        url: "https://en.wikipedia.org/wiki/Frontbench_team_of_Nigel_Farage",
      },
    ],
  },

  /* ── Conservative ────────────────────────────────────────────────────── */
  {
    slug: "conservative",
    name: "The Conservative and Unionist Party",
    shortName: "Conservative",
    colour: "#0087dc",
    spectrum: 5,
    spectrumNote:
      "Centre-right to right. Squeezed between a Labour government and a Reform UK party occupying much of its former ground.",
    founded: "1834",
    mps: "121 seats won at the 2024 general election, reduced since by defections",
    summary:
      "The Official Opposition, led by Kemi Badenoch since November 2024. The party suffered its worst general election defeat in 2024 and has since lost senior figures to Reform UK, running third in most 2026 averages while remaining within a few points of first.",
    ideology: ["Conservatism", "Economic liberalism", "Unionism"],
    policies: [
      {
        area: "Positioning",
        position:
          "Badenoch has resisted merger or pact with Reform UK, arguing the Conservatives must rebuild a distinct offer rather than chase it rightwards.",
      },
      {
        area: "Policy renewal",
        position:
          "Neil O'Brien was given a dedicated Shadow Minister for Policy Renewal and Development brief in July 2025 to rebuild the platform.",
      },
    ],
    credibility: [
      "In government for 14 years to 2024, the longest continuous spell of any party this century.",
      "Still the Official Opposition with the second-largest parliamentary party.",
      "Badenoch's personal favourability stood at 31% in August 2026, and no poll since the 2025 Budget has put her below 20%.",
    ],
    concerns: [
      "A sustained haemorrhage of senior figures to Reform UK: Nadhim Zahawi on 12 January 2026, Robert Jenrick on 15 January after losing the whip for what the party called plotting to defect, and Suella Braverman on 26 January.",
      "Ruth Davidson and Andy Street launched a rival centrist grouping, Prosper UK, on 26 January 2026 — pressure from the other flank.",
      "Third place in most published averages, at around 20%.",
      "Finished behind Restore Britain — a party months old — in the Makerfield by-election in June 2026.",
    ],
    leader: {
      slug: "kemi-badenoch",
      name: "Kemi Badenoch",
      role: "Leader of the Opposition",
      seat: "MP for North West Essex",
      background:
        "Elected leader on 2 November 2024, the first Black leader of a major UK party. Previously Business and Trade Secretary and Women and Equalities Minister.",
      credibility:
        "Won a contested leadership election outright and has held her party's polling floor above 19% through a year of defections.",
      concerns:
        "Has lost three cabinet-rank colleagues to Reform UK in a single month and faces open commentary about whether the party can recover under any leader.",
      sources: [
        {
          label: "New Statesman — Kemi Badenoch is the Conservative Party's only hope",
          url: "https://www.newstatesman.com/politics/uk-politics/2026/08/kemi-badenoch-is-the-conservative-partys-only-hope",
          date: "2026-08-01",
        },
      ],
    },
    frontbench: [
      { slug: "mel-stride", name: "Mel Stride", role: "Shadow Chancellor of the Exchequer", seat: "MP for Central Devon" },
      { slug: "priti-patel", name: "Priti Patel", role: "Shadow Foreign Secretary", seat: "MP for Witham", background: "Home Secretary 2019–2022." },
      { slug: "chris-philp", name: "Chris Philp", role: "Shadow Home Secretary", seat: "MP for Croydon South" },
      { slug: "james-cartlidge", name: "James Cartlidge", role: "Shadow Defence Secretary", seat: "MP for South Suffolk" },
      { slug: "nick-timothy", name: "Nick Timothy", role: "Shadow Lord Chancellor and Justice Secretary", seat: "MP for West Suffolk", background: "Joint chief of staff to Theresa May; appointed to the justice brief in January 2026 replacing Robert Jenrick." },
      { slug: "stuart-andrew", name: "Stuart Andrew", role: "Shadow Health Secretary", seat: "MP for Daventry" },
      { slug: "laura-trott", name: "Laura Trott", role: "Shadow Education Secretary", seat: "MP for Sevenoaks" },
    ],
    recentNews: [
      {
        headline: "Suella Braverman defects to Reform UK",
        date: "2026-01-26",
        source: {
          label: "Wikipedia — 2026 in United Kingdom politics and government",
          url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
          date: "2026-01-26",
        },
      },
      {
        headline: "Robert Jenrick loses the Conservative whip and joins Reform UK the same day",
        date: "2026-01-15",
        source: {
          label: "Wikipedia — 2026 in United Kingdom politics and government",
          url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
          date: "2026-01-15",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Badenoch shadow cabinet",
        url: "https://en.wikipedia.org/wiki/Badenoch_shadow_cabinet",
      },
    ],
  },

  /* ── Green ───────────────────────────────────────────────────────────── */
  {
    slug: "green",
    name: "The Green Party of England and Wales",
    shortName: "Green",
    colour: "#02a95b",
    spectrum: -7,
    spectrumNote:
      "Left to eco-socialist. Moved sharply left under Zack Polanski, who campaigns explicitly as an \"eco-populist\" against both Labour and Reform.",
    founded: "1990 (in its present form; predecessors from 1973)",
    mps: "5 — four elected in 2024 plus the Gorton and Denton by-election gain",
    membership: "Over 200,000",
    membershipSource: {
      label: "Wikipedia — 2026 in United Kingdom politics and government",
      url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
      date: "2026-03-01",
    },
    summary:
      "The fastest-growing party in British politics by membership. Zack Polanski won the leadership in September 2025 on an eco-populist platform, and in February 2026 the Greens took Gorton and Denton — their first Westminster by-election win ever, in a seat where the party had never previously passed 10%.",
    ideology: ["Green politics", "Eco-socialism", "Left-wing populism"],
    policies: [
      {
        area: "Climate",
        position: "Rapid decarbonisation as the organising priority of government.",
      },
      {
        area: "Economy",
        position:
          "Redistribution funded by taxes on wealth — the core of Polanski's pitch to voters to Labour's left.",
      },
      {
        area: "Strategy",
        position:
          "Polanski argues two-party politics is \"dead and buried\" and has made the devolved elections a priority.",
      },
    ],
    credibility: [
      "First Westminster by-election victory in the party's history, on 41% with a majority above 4,000, pushing Labour into third.",
      "Membership passed 200,000 in March 2026, up from roughly 184,000 in December 2025.",
      "Polling around 12% nationally — historically high for the party — with five MPs and two peers.",
    ],
    concerns: [
      "Recent averages show the Greens slipping back from their spring peak alongside Reform UK.",
      "First-past-the-post converts a 12% national share into very few seats; the party's polling and its parliamentary strength remain far apart.",
      "The leadership's sharp leftward turn has been contested within a party that has historically also drawn liberal and rural support.",
    ],
    leader: {
      slug: "zack-polanski",
      name: "Zack Polanski",
      role: "Leader",
      background:
        "Elected leader on 2 September 2025. A former member of the London Assembly and previously deputy leader of the party, he campaigns as an \"eco-populist\" and has become one of the most prominent left-wing communicators in British politics.",
      credibility:
        "Membership and poll share have both risen sharply since he took over, and the party won its first ever Westminster by-election under his leadership.",
      sources: [
        {
          label: "Al Jazeera — Who is Zack Polanski, UK Greens leader and rising political star?",
          url: "https://www.aljazeera.com/news/2026/5/6/who-is-zack-polanski-uk-greens-leader-and-rising-political-star",
          date: "2026-05-06",
        },
      ],
    },
    deputy: {
      slug: "rachel-millward",
      name: "Rachel Millward",
      role: "Deputy Leader",
      background: "Co-deputy leader alongside Mothin Ali.",
    },
    frontbench: [
      { slug: "mothin-ali", name: "Mothin Ali", role: "Deputy Leader" },
      { slug: "sian-berry", name: "Siân Berry", role: "MP", seat: "MP for Brighton Pavilion", background: "Former party leader and London mayoral candidate." },
      { slug: "carla-denyer", name: "Carla Denyer", role: "MP", seat: "MP for Bristol Central", background: "Co-leader of the party until 2025." },
      { slug: "adrian-ramsay", name: "Adrian Ramsay", role: "MP", seat: "MP for Waveney Valley", background: "Co-leader of the party until 2025." },
      { slug: "ellie-chowns", name: "Ellie Chowns", role: "MP", seat: "MP for North Herefordshire" },
      { slug: "hannah-spencer", name: "Hannah Spencer", role: "MP", seat: "MP for Gorton and Denton", background: "Won the party's first ever Westminster by-election in February 2026." },
    ],
    recentNews: [
      {
        headline: "Greens win Gorton and Denton — their first ever Westminster by-election",
        date: "2026-02-26",
        source: {
          label: "Wikipedia — 2026 in United Kingdom politics and government",
          url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
          date: "2026-02-26",
        },
      },
      {
        headline: "Green membership passes 200,000 following the by-election win",
        date: "2026-03-01",
        source: {
          label: "Wikipedia — 2026 in United Kingdom politics and government",
          url: "https://en.wikipedia.org/wiki/2026_in_United_Kingdom_politics_and_government",
          date: "2026-03-01",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Green Party of England and Wales",
        url: "https://en.wikipedia.org/wiki/Green_Party_of_England_and_Wales",
      },
    ],
  },

  /* ── Liberal Democrats ───────────────────────────────────────────────── */
  {
    slug: "liberal-democrats",
    name: "The Liberal Democrats",
    shortName: "Lib Dems",
    colour: "#faa61a",
    spectrum: -2,
    spectrumNote:
      "Centre to centre-left. Socially liberal and pro-European, with a campaigning focus on health and social care and, since 2025, on opposing Reform UK directly.",
    founded: "1988",
    mps: "72 seats won at the 2024 general election — the party's best ever result",
    summary:
      "Led by Sir Ed Davey, the Liberal Democrats won 72 seats in 2024, their strongest showing since the party was formed. Through 2026 they have made opposition to Nigel Farage the centre of their messaging, with Davey pledging to \"stop Trump's America becoming Farage's Britain\".",
    ideology: ["Liberalism", "Social liberalism", "Pro-Europeanism", "Federalism"],
    policies: [
      {
        area: "Health and social care",
        position:
          "Davey's signature issue, rooted in his own experience as a carer; the party's central domestic commitment.",
      },
      {
        area: "Constitution",
        position:
          "Davey used his spring 2026 conference speech to call for \"a new Magna Carta\" to constrain executive power.",
      },
      {
        area: "Europe",
        position: "The most consistently pro-European of the six parties.",
      },
    ],
    credibility: [
      "72 seats in 2024 — the best result in the party's history.",
      "Record-breaking local election gains, which Davey has said position the party to \"win again in 2026\".",
      "A large and effective ground operation in southern English seats taken from the Conservatives.",
    ],
    concerns: [
      "Polling around 10%, below its 2024 vote share and behind the Greens for fourth place in most averages.",
      "The heavy focus on Farage — by one count, more than 30 references at the party's conference, far more than to the Prime Minister — has drawn criticism that it crowds out a distinct offer of its own.",
      "The party's seat total rests on tactical anti-Conservative voting in southern seats, a coalition that a three-way national race makes harder to hold.",
    ],
    leader: {
      slug: "ed-davey",
      name: "Sir Ed Davey",
      role: "Leader",
      seat: "MP for Kingston and Surbiton",
      background:
        "Leader since 2020. Energy and Climate Change Secretary in the 2010–2015 coalition government. Led the party to its best ever Commons result in 2024.",
      credibility:
        "Delivered 72 seats and record local election gains; one of the longest-serving current party leaders.",
      sources: [
        {
          label: "Liberal Democrats — Ed Davey spring conference speech 2026",
          url: "https://www.libdems.org.uk/news/article/ed-davey-speech-spring-2026",
          date: "2026-03-01",
        },
      ],
    },
    deputy: {
      slug: "daisy-cooper",
      name: "Daisy Cooper",
      role: "Deputy Leader and Treasury spokesperson",
      seat: "MP for St Albans",
    },
    frontbench: [
      { slug: "max-wilkinson", name: "Max Wilkinson", role: "Home Affairs spokesperson", seat: "MP for Cheltenham" },
      { slug: "calum-miller", name: "Calum Miller", role: "Foreign Affairs spokesperson", seat: "MP for Bicester and Woodstock" },
      { slug: "helen-morgan", name: "Helen Morgan", role: "Health and Social Care spokesperson", seat: "MP for North Shropshire" },
      { slug: "munira-wilson", name: "Munira Wilson", role: "Education, Children and Families spokesperson", seat: "MP for Twickenham" },
      { slug: "james-maccleary", name: "James MacCleary", role: "Defence spokesperson", seat: "MP for Lewes" },
    ],
    recentNews: [
      {
        headline: "Davey calls on all parties to stand aside in Clacton rather than give Farage \"oxygen\"",
        date: "2026-07-09",
        source: {
          label: "Mark Pack — Government should block Nigel Farage's resignation",
          url: "https://www.markpack.org.uk/177141/government-should-block-nigel-farages-resignation/",
          date: "2026-07-09",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Frontbench team of Ed Davey",
        url: "https://en.wikipedia.org/wiki/Frontbench_team_of_Ed_Davey",
      },
    ],
  },

  /* ── Restore Britain ─────────────────────────────────────────────────── */
  {
    slug: "restore-britain",
    name: "Restore Britain",
    shortName: "Restore",
    colour: "#051d3f",
    spectrum: 9,
    spectrumNote:
      "Far right. Political scientists place it well to the right of Reform UK; the party rejects the characterisation. Both positions are set out under Credibility and concerns below.",
    founded: "Pressure group 30 June 2025; registered as a party 13 February 2026",
    mps: "1 — Rupert Lowe",
    membership: "130,000 (June 2026)",
    membershipSource: {
      label: "Wikipedia — Restore Britain",
      url: "https://en.wikipedia.org/wiki/Restore_Britain",
      date: "2026-06-01",
    },
    councillors: 35,
    summary:
      "Founded by Rupert Lowe after his departure from Reform UK, Restore Britain registered as a party in February 2026 and polls at around 4%. It is the newest of the six parties tracked here and the only one whose classification is itself contested: academics describe it as far-right and ethno-nationalist, and the party calls that a smear.",
    ideology: ["Nativism", "Right-wing populism", "British nationalism"],
    policies: [
      { area: "Immigration", position: "Large-scale deportations of undocumented migrants and a net-negative immigration target." },
      { area: "Justice", position: "A referendum on restoring the death penalty; legalising possession of pepper spray and expanding \"reasonable force\" in home defence." },
      { area: "Media", position: "Withdrawal of BBC funding." },
      { area: "Religion and culture", position: "Banning the burqa and niqab; abolishing kosher and halal slaughter." },
    ],
    credibility: [
      "Went from registration in February 2026 to roughly 4% in national polling and 130,000 members by June.",
      "Took 6.8% at the Makerfield by-election in June 2026, finishing third — ahead of the Conservatives.",
      "35 councillors, and its affiliate Great Yarmouth First won all ten seats it contested in the 2026 local elections.",
    ],
    concerns: [
      "Political scientists classify the party as far-right and ethno-nationalist, describing its platform as hardline nativism of a kind largely absent from British politics since the decline of the BNP.",
      "The party has echoed the \"Great Replacement\" conspiracy theory in claims about demographic change by 2070.",
      "Hope Not Hate documented endorsements by British neo-Nazis in April 2026, including figures from Patriotic Alternative and former BNP, British Democratic Party and For Britain officials. Restore Britain describes such characterisations as smear campaigns.",
      "Its leader was suspended from Reform UK in March 2025 over allegations of threatening behaviour and bullying, which he denies.",
      "Public recognition of Lowe is low: fewer than one in ten voters could identify him, with visibility falling from 14% to 8% in the ten months after his expulsion.",
    ],
    leader: {
      slug: "rupert-lowe",
      name: "Rupert Lowe",
      role: "Founder and Leader",
      seat: "MP for Great Yarmouth",
      background:
        "Businessman and former chairman of Southampton Football Club. Elected for Reform UK in 2024, suspended in March 2025, and subsequently the founder of Restore Britain, which he describes as \"a movement for those who believe that we need to fundamentally change the way Britain is governed\".",
      credibility:
        "Built a party from registration to 130,000 members and roughly 4% national polling within five months.",
      concerns:
        "Suspended by Reform UK over allegations of threatening behaviour and bullying, which he denies; recognised by fewer than one in ten voters.",
      sources: [
        {
          label: "Wikipedia — Rupert Lowe",
          url: "https://en.wikipedia.org/wiki/Rupert_Lowe",
        },
      ],
    },
    frontbench: [
      { slug: "charlie-downes", name: "Charlie Downes", role: "Spokesperson" },
    ],
    recentNews: [
      {
        headline: "Restore Britain settles at 3–4% in the averages, down from near 10% before registration",
        date: "2026-08-01",
        source: {
          label: "GB News",
          url: "https://www.gbnews.com/politics/rupert-lowe-restore-britain-jl-partners-poll-reform-uk-nigel-farage",
          date: "2026-08-01",
        },
      },
      {
        headline: "Restore Britain takes 6.8% at Makerfield, finishing ahead of the Conservatives",
        date: "2026-06-18",
        source: {
          label: "Wikipedia — 2026 Makerfield by-election",
          url: "https://en.wikipedia.org/wiki/2026_Makerfield_by-election",
          date: "2026-06-18",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Restore Britain",
        url: "https://en.wikipedia.org/wiki/Restore_Britain",
      },
      {
        label: "YouGov — What do Restore Britain supporters see in the party?",
        url: "https://yougov.com/en-gb/articles/55157-big-yougov-voter-study-2026-what-do-restore-britain-supporters-see-in-the-party",
      },
    ],
  },
];

export const partyBySlug = Object.fromEntries(parties.map((p) => [p.slug, p])) as Record<
  PartySlug,
  Party
>;

export function getParty(slug: string): Party | undefined {
  return partyBySlug[slug as PartySlug];
}
