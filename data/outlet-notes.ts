/**
 * One plain line about what each masthead is.
 *
 * Written for the outlets that actually draw search traffic — the ones people
 * type "is X left or right" about. The rest fall back to a line built from what
 * we already hold, rather than to something invented for the sake of symmetry.
 *
 * These are descriptions, not judgements: what kind of publication it is, who
 * owns it where that is notable, and whether it is regulated for due
 * impartiality. The placement on the scale is the judgement, and it is flagged
 * as one elsewhere on the page.
 */
export const OUTLET_NOTES: Record<string, string> = {
  mail: "A right-leaning national tabloid and one of the most-read news brands in the UK, published by DMG Media.",
  sky: "A television news broadcaster. Like all UK broadcasters it is regulated by Ofcom for due impartiality, which is a large part of why it sits close to the centre of our scale.",
  independent: "A left-of-centre national title, published online only since it stopped printing in 2016.",
  spectator: "A right-leaning weekly magazine of politics and opinion, founded in 1828.",
  telegraph: "A right-leaning national broadsheet, published daily since 1855.",
  guardian: "A left-leaning national broadsheet, owned by the Scott Trust rather than by a proprietor or shareholders.",
};

/** Broadcasters carry a regulatory obligation the papers do not. */
const REGULATED = new Set(["bbc", "sky", "channel4"]);

export function noteFor(id: string, name: string): string | null {
  if (OUTLET_NOTES[id]) return OUTLET_NOTES[id];
  if (REGULATED.has(id)) {
    return `${name} is regulated by Ofcom for due impartiality, which is a large part of why it sits close to the centre of our scale.`;
  }
  return null;
}
