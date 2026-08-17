import photoData from "@/data/generated/photos.json";

export type Photo = {
  slug: string;
  file: string;
  use: string;
  /** CSS object-position, chosen per image so the subject survives cropping. */
  position: string;
  commonsFile: string;
  licence: string;
  licenceUrl: string | null;
  author: string | null;
  description: string | null;
  descriptionUrl: string | null;
  width: number;
  height: number;
};

const photos = photoData.photos as Record<string, Photo>;

export type PhotoSlug =
  | "downing-street"
  | "westminster"
  | "royal-navy"
  | "buckingham-palace"
  | "london"
  | "polling-station"
  | "dover"
  | "economy"
  | "health"
  | "energy"
  | "justice"
  | "england"
  | "scotland"
  | "wales"
  | "northern-ireland"
  | "russia"
  | "iran"
  | "china"
  | "united-states"
  | "nato"
  | "europe-eu";

export function getPhoto(slug: PhotoSlug): Photo | undefined {
  return photos[slug];
}

export function allPhotos(): Photo[] {
  return Object.values(photos).sort((a, b) => a.slug.localeCompare(b.slug));
}

export const PHOTOS_FETCHED_AT = photoData.fetchedAt as string;

/** Short credit line, e.g. "Peter McDermott / CC BY-SA 2.0". */
export function credit(photo: Photo): string {
  return [photo.author, photo.licence].filter(Boolean).join(" / ");
}
