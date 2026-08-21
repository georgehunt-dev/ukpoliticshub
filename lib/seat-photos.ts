import data from "@/data/generated/seat-photos.json";

/**
 * A photograph of a named place inside a constituency.
 *
 * This replaces the four nation photographs that used to stand in for all 650
 * seats. It is still not a photograph of the constituency — most have no such
 * thing — so every use names the place it actually shows and says which seat
 * that place sits in. A seat with no entry here falls back to the nation
 * photograph, captioned as before.
 */

export type SeatPhoto = {
  seat: string;
  slug: string;
  file: string;
  /** The settlement in the picture — "Port Talbot", "Cumnock". */
  shows: string;
  placeType: string;
  district: string | null;
  /** Where it came from: the settlement's article, or geotagged nearby. */
  how: "wikipedia-lead" | "nearby";
  commonsFile: string;
  licence: string;
  author: string | null;
  descriptionUrl: string | null;
  width: number;
  height: number;
};

const seats = data.seats as Record<string, SeatPhoto>;

export const SEAT_PHOTOS_FETCHED_AT = data.fetchedAt as string;

/** Undefined where we hold nothing — the caller uses the nation photograph. */
export function seatPhoto(slug: string): SeatPhoto | undefined {
  return seats[slug];
}

export function allSeatPhotos(): SeatPhoto[] {
  return Object.values(seats).sort((a, b) => a.seat.localeCompare(b.seat));
}

export const SEAT_PHOTO_COUNT = Object.keys(seats).length;

/** "David Dixon / CC BY-SA 2.0" */
export function seatPhotoCredit(photo: SeatPhoto): string {
  return [photo.author, photo.licence].filter(Boolean).join(" / ");
}
