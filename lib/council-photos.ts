import data from "@/data/generated/council-photos.json";

/**
 * A photograph for each council holding a by-election.
 *
 * These show the council area, never the ward. There is no free source of
 * representative photographs of individual wards, and the site's rule is that
 * a picture is captioned as what it actually is — so every use of this carries
 * the `shows` line, and a ward page without a photograph simply has none
 * rather than borrowing one from somewhere close by.
 */

export type CouncilPhoto = {
  council: string;
  slug: string;
  file: string;
  /** What the picture is actually of — "Barnsley Town Hall", "Dronfield". */
  shows: string;
  position: string;
  commonsFile: string;
  licence: string;
  licenceUrl: string | null;
  author: string | null;
  descriptionUrl: string | null;
  width: number;
  height: number;
};

const councils = data.councils as Record<string, CouncilPhoto>;

export const COUNCIL_PHOTOS_FETCHED_AT = data.fetchedAt as string;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Undefined where we hold no photograph — the caller shows nothing. */
export function councilPhoto(council: string): CouncilPhoto | undefined {
  return councils[slugify(council)];
}

export function allCouncilPhotos(): CouncilPhoto[] {
  return Object.values(councils).sort((a, b) => a.council.localeCompare(b.council));
}

/** "Eirian Evans / CC BY-SA 2.0" */
export function councilCredit(photo: CouncilPhoto): string {
  return [photo.author, photo.licence].filter(Boolean).join(" / ");
}
