/**
 * Plain-English definitions for the jargon this site cannot avoid using.
 *
 * The site's stated goal is that someone with no background can understand the
 * spectrum in half an hour. That fails the moment a policy line says "abolish
 * ILR" and the reader has to leave to find out what that is.
 *
 * Rules for entries:
 *   • Two sentences at most, no jargon inside the definition.
 *   • Neutral. Define what a thing *is*, never whether it is a good idea:
 *     "leaving the ECHR" is a live argument and the glossary does not join it.
 *   • `aliases` catch the other ways the term appears in our copy.
 */

export type GlossaryEntry = {
  term: string;
  aliases?: string[];
  definition: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Indefinite Leave to Remain",
    aliases: ["ILR"],
    definition:
      "Permission to live and work in the UK permanently, without a visa that needs renewing. It is normally granted after five years of lawful residence and is the usual step before applying for citizenship.",
  },
  {
    term: "ECHR",
    aliases: ["European Convention on Human Rights"],
    definition:
      "A post-war treaty setting out basic rights (a fair trial, freedom of speech, protection from torture) enforced by the European Court of Human Rights in Strasbourg. It is separate from the European Union, and leaving the EU did not affect it.",
  },
  {
    term: "ECAT",
    definition:
      "The Council of Europe Convention on Action against Trafficking in Human Beings, which obliges signatories to identify and protect victims of trafficking rather than treat them purely as immigration offenders.",
  },
  {
    term: "Mahmood reforms",
    definition:
      "The immigration changes brought in by Home Secretary Shabana Mahmood, which reshape how asylum appeals work and remove some legal barriers to deportation.",
  },
  {
    term: "net zero",
    definition:
      "Cutting greenhouse gas emissions to the point where any still produced are balanced by an equivalent amount removed from the atmosphere. The UK's current legal target is to reach it by 2050.",
  },
  {
    term: "personal allowance",
    definition:
      "The amount you can earn each year before paying any income tax: £12,570, and frozen at that level since 2021. Freezing it while wages rise pulls more people into paying tax without the rate changing, sometimes called a stealth tax.",
  },
  {
    term: "stamp duty",
    definition:
      "A tax paid by the buyer when purchasing property in England and Northern Ireland, charged as a percentage of the price above a threshold.",
  },
  {
    term: "business rates",
    definition:
      "A tax on commercial property (shops, offices, warehouses) based on its estimated rental value. It is charged whether or not the business is making money, which is why high-street retailers campaign against it.",
  },
  {
    term: "Trident",
    definition:
      "The UK's nuclear weapons system: missiles carried by a fleet of submarines, at least one of which is at sea at all times. Renewing it is one of the longest-running arguments in British defence policy.",
  },
  {
    term: "PCSO",
    aliases: ["PCSOs"],
    definition:
      "Police Community Support Officer: a uniformed member of police staff who patrols and deals with anti-social behaviour, but has fewer powers than a warranted constable and cannot make most arrests.",
  },
  {
    term: "Prevent",
    definition:
      "The government's counter-terrorism programme aimed at stopping people being drawn into extremism, largely by referring individuals for support. It is contested: supporters call it early intervention, critics call it surveillance.",
  },
  {
    term: "whole-life order",
    aliases: ["whole life orders", "whole-life orders"],
    definition:
      "A prison sentence with no possibility of parole, meaning the person will die in prison. It is the most severe sentence available in England and Wales and is reserved for the most serious murders.",
  },
  {
    term: "wealth tax",
    definition:
      "A tax charged on what someone owns (property, shares, savings) rather than on what they earn. Supporters point to concentrated wealth; opponents question how assets would be valued and whether the wealthy would simply move.",
  },
  {
    term: "capital gains",
    definition:
      "The profit made when selling an asset such as shares or a second home for more than it cost. It is taxed separately from income, usually at a lower rate, which is the crux of most arguments about changing it.",
  },
  {
    term: "Deportation Command",
    definition:
      "A proposed new enforcement body, described by Reform UK as modelled on the US immigration enforcement agency ICE, dedicated to removing people with no right to remain in the UK.",
  },
  {
    term: "Removals Force",
    definition:
      "A proposed Conservative enforcement body tasked with removing people who have entered the country illegally, with a stated target of 150,000 removals a year.",
  },
  {
    term: "Climate Change Act",
    definition:
      "The 2008 law that binds the UK to cutting greenhouse gas emissions, amended in 2019 to require net zero by 2050. Repealing it would remove the legal obligation to hit that target.",
  },
  {
    term: "Human Rights Act",
    definition:
      "The 1998 law that lets people rely on the rights in the European Convention on Human Rights in British courts, rather than having to take a case to Strasbourg.",
  },
  {
    term: "Police and Crime Commissioner",
    aliases: ["Police and Crime Commissioners", "PCCs"],
    definition:
      "An elected official responsible for overseeing a regional police force, setting its budget and priorities and holding the chief constable to account. Turnout at their elections is typically very low.",
  },
  {
    term: "first-past-the-post",
    definition:
      "The UK's voting system: whoever gets the most votes in a constituency wins the seat, even without a majority. It tends to reward parties whose support is concentrated geographically and to punish those spread thinly.",
  },
  {
    term: "by-election",
    aliases: ["by-elections"],
    definition:
      "An election held in a single constituency between general elections, usually because the sitting MP has resigned or died. They often produce unusual results, as voters treat them as a chance to register a protest.",
  },
  {
    term: "NATO",
    definition:
      "The North Atlantic Treaty Organisation, a military alliance of 30-plus countries in which an attack on one is treated as an attack on all. The UK has been a member since it was founded in 1949.",
  },
  {
    term: "nuclear deterrent",
    definition:
      "The doctrine of holding nuclear weapons so that no adversary attacks, on the basis that retaliation would be unacceptable. In the UK it means Trident.",
  },
  {
    term: "policy levies",
    aliases: ["policy levy", "levies"],
    definition:
      "Charges added to household energy bills to fund government schemes such as renewable subsidies and insulation programmes. Moving them off bills does not make them free. It shifts the cost to general taxation.",
  },
  {
    term: "quangos",
    aliases: ["quango"],
    definition:
      "Bodies funded by government to carry out public functions at arm's length from ministers: regulators, agencies and advisory panels. Critics see unaccountable bureaucracy; defenders see independence from short-term politics.",
  },
];

/** Longest first, so "Indefinite Leave to Remain" wins over any shorter overlap. */
export const GLOSSARY_LOOKUP: { match: string; entry: GlossaryEntry }[] = GLOSSARY.flatMap(
  (entry) => [entry.term, ...(entry.aliases ?? [])].map((match) => ({ match, entry }))
).sort((a, b) => b.match.length - a.match.length);
