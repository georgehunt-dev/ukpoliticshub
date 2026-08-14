import portraitData from "@/data/generated/portraits.json";

export type Portrait = {
  slug: string;
  title: string;
  file: string;
  fileName: string;
  licence: string | null;
  author: string | null;
  credit: string | null;
  descriptionUrl: string | null;
  wikipedia: string;
};

const portraits = portraitData.portraits as Record<string, Portrait>;

export function getPortrait(slug: string): Portrait | undefined {
  return portraits[slug];
}

/** Every portrait in use, for the attribution list in the colophon. */
export function allPortraits(): Portrait[] {
  return Object.values(portraits).sort((a, b) => a.title.localeCompare(b.title));
}

/** Initials for the monogram shown when someone has no free-licensed photograph. */
export function initials(name: string): string {
  return name
    .replace(/^(Sir|Dame|Lord|Baroness|Rt Hon)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const PORTRAITS_FETCHED_AT = portraitData.fetchedAt as string;
