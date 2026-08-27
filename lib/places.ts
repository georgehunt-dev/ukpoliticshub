import placeData from "@/data/generated/places.json";

/**
 * Towns, villages and suburbs mapped to the seat that contains them.
 *
 * This exists because almost nobody searches for a constituency by its proper
 * name. They search for where they live. Without this index the seat pages are
 * only reachable by a phrase most readers would never type.
 *
 * The one rule that shapes everything here: British place names repeat. There
 * are eight Whitchurches, nine Hooks and ten Overtons. So a lookup returns a
 * *list* of candidate seats and the caller must ask which one was meant. It
 * never guesses, for the same reason the ask bar never guesses: a confident
 * wrong answer is worse than a question.
 */

export type Place = {
  name: string;
  /** City, Town, Village, Hamlet or Settlement. */
  type: string;
  /** Slug of the constituency containing it. */
  slug: string;
  /** Local authority, shown to tell one Whitchurch from another. */
  district: string | null;
  country: string | null;
};

const places = placeData.places as Place[];

export const PLACES_FETCHED_AT = placeData.fetchedAt as string;

const RANK = ["City", "Town", "Suburb", "Village", "Hamlet", "Settlement"];

/**
 * The kinds of place worth naming on the page. Suburbs are in because in a
 * city seat they are the names people actually use, and because leaving them
 * out gave seats like Basingstoke a single entry, which tells a reader nothing.
 */
const NOTABLE = new Set(["City", "Town", "Suburb"]);

function byProminence(a: Place, b: Place): number {
  const rank = RANK.indexOf(a.type) - RANK.indexOf(b.type);
  return rank !== 0 ? rank : a.name.localeCompare(b.name);
}

const bySeat = new Map<string, Place[]>();
for (const place of places) {
  const list = bySeat.get(place.slug);
  if (list) list.push(place);
  else bySeat.set(place.slug, [place]);
}
for (const list of bySeat.values()) list.sort(byProminence);

/** Every settlement inside a seat, most prominent first. */
export function placesInSeat(slug: string): Place[] {
  return bySeat.get(slug) ?? [];
}

/**
 * The handful worth printing on the page. Towns and cities carry a seat's
 * identity; a list of forty hamlets is noise, and reads as padding to a search
 * engine as much as to a reader.
 */
export function headlinePlaces(slug: string, limit = 8): Place[] {
  const all = placesInSeat(slug);
  const notable = all.filter((place) => NOTABLE.has(place.type));
  return (notable.length ? notable : all).slice(0, limit);
}

const byName = new Map<string, Place[]>();
for (const place of places) {
  const key = place.name.toLowerCase();
  const list = byName.get(key);
  if (list) list.push(place);
  else byName.set(key, [place]);
}

export type PlaceMatch = {
  name: string;
  /** More than one means the caller has to disambiguate rather than redirect. */
  seats: Place[];
};

/**
 * Look a place name up. Exact matches first, then names starting with the
 * query, never a fuzzy match, because "Overton" and "Overtown" are different
 * villages in different seats and a near miss would be a wrong answer.
 */
export function findPlaces(query: string, limit = 8): PlaceMatch[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  const exact = byName.get(needle);
  const matches: PlaceMatch[] = exact ? [{ name: exact[0].name, seats: dedupe(exact) }] : [];

  if (matches.length < limit) {
    const prefixed = [...byName.entries()]
      .filter(([key]) => key !== needle && key.startsWith(needle))
      .sort((a, b) => a[0].length - b[0].length || a[0].localeCompare(b[0]))
      .slice(0, limit - matches.length);
    for (const [, list] of prefixed) {
      matches.push({ name: list[0].name, seats: dedupe(list) });
    }
  }

  return matches;
}

/** One entry per seat: the same name twice in one constituency is one answer. */
function dedupe(list: Place[]): Place[] {
  const seen = new Map<string, Place>();
  for (const place of list) {
    const existing = seen.get(place.slug);
    if (!existing || RANK.indexOf(place.type) < RANK.indexOf(existing.type)) {
      seen.set(place.slug, place);
    }
  }
  return [...seen.values()].sort(byProminence);
}

export const PLACE_COUNT = places.length;
export const PLACE_SOURCE = {
  label: "Wikidata settlements, located with postcodes.io",
  url: "https://postcodes.io/",
};
