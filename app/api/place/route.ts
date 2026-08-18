import { CONSTITUENCY_NAMES } from "@/lib/constituencies";
import { findPlaces } from "@/lib/places";

/**
 * Place and constituency name lookup for the Your Area search box.
 *
 * This is a route rather than client-side matching because the place index is
 * tens of thousands of entries — shipping it to every visitor to save one
 * request would be the wrong trade.
 *
 * It answers with candidates, never with a destination. Where a name occurs in
 * several seats the caller has to ask which was meant. Postcodes are resolved
 * in the browser against postcodes.io and never reach this route.
 */

export const runtime = "nodejs";

const MAX_LENGTH = 80;

export type PlaceHit = {
  kind: "place" | "seat";
  name: string;
  /** Present for a place; a seat match is already unambiguous. */
  type?: string;
  slug: string;
  district?: string | null;
  /** True where the same place name also exists in other seats. */
  shared?: boolean;
};

export function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, MAX_LENGTH);

  if (query.length < 2) {
    return Response.json({ ok: true, query, hits: [] as PlaceHit[] });
  }

  const needle = query.toLowerCase();

  // Constituency names first: someone who typed one knows what they want. An
  // exact match always leads, so the postcode path can rely on hits[0] rather
  // than hoping the seat it wants survived the cap.
  const seatHits: PlaceHit[] = CONSTITUENCY_NAMES.filter((seat) =>
    seat.name.toLowerCase().includes(needle)
  )
    .sort((a, b) => {
      const exactA = a.name.toLowerCase() === needle ? 0 : 1;
      const exactB = b.name.toLowerCase() === needle ? 0 : 1;
      return exactA - exactB || a.name.length - b.name.length;
    })
    .slice(0, 5)
    .map((seat) => ({ kind: "seat", name: seat.name, slug: seat.slug }));

  const placeHits: PlaceHit[] = findPlaces(query, 6).flatMap((match) =>
    match.seats.map((place) => ({
      kind: "place" as const,
      name: match.name,
      type: place.type,
      slug: place.slug,
      district: place.district,
      shared: match.seats.length > 1,
    }))
  );

  // A place already sitting in a matched seat is noise, not a second option.
  const seatSlugs = new Set(seatHits.map((hit) => hit.slug));
  const hits = [...seatHits, ...placeHits.filter((hit) => !seatSlugs.has(hit.slug))].slice(0, 14);

  return Response.json({ ok: true, query, hits });
}
