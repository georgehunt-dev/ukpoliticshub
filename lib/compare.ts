import { parties, partyBySlug } from "@/data/parties";
import { POLICY_AREAS, policyAreaById } from "@/data/policy-areas";
import type { Party, PartySlug, Policy, PolicyArea } from "@/lib/types";

/**
 * The comparison view's routing and ordering.
 *
 * One dynamic segment serves two shapes of page:
 *   /compare/immigration        — every party on one issue
 *   /compare/labour-vs-reform   — two parties across every issue
 *
 * They cannot collide: no policy area id contains "-vs-". Both are real URLs
 * rather than client state, so each is indexable, linkable and gets its own
 * share card — which is most of the value of building this at all.
 */

export type IssueView = {
  kind: "issue";
  area: (typeof POLICY_AREAS)[number];
  rows: { party: Party; policy?: Policy }[];
};

export type PairView = {
  kind: "pair";
  left: Party;
  right: Party;
  rows: { area: (typeof POLICY_AREAS)[number]; left?: Policy; right?: Policy }[];
};

export type CompareView = IssueView | PairView;

/** Left to right by our spectrum placement — the site's organising spine. */
export const partiesBySpectrum = [...parties].sort((a, b) => a.spectrum - b.spectrum);

function policyFor(party: Party, area: PolicyArea): Policy | undefined {
  return party.policies.find((p) => p.area === area);
}

/**
 * Every pairing, ordered so the slug is stable: the party further left always
 * comes first. Without that, labour-vs-reform and reform-vs-labour would be
 * two URLs for one page, which splits any ranking they earn.
 */
export function allPairs(): { left: Party; right: Party; slug: string }[] {
  const pairs: { left: Party; right: Party; slug: string }[] = [];
  for (let i = 0; i < partiesBySpectrum.length; i++) {
    for (let j = i + 1; j < partiesBySpectrum.length; j++) {
      const left = partiesBySpectrum[i];
      const right = partiesBySpectrum[j];
      pairs.push({ left, right, slug: `${left.slug}-vs-${right.slug}` });
    }
  }
  return pairs;
}

export function pairSlug(a: PartySlug, b: PartySlug): string {
  const left = partyBySlug[a];
  const right = partyBySlug[b];
  return left.spectrum <= right.spectrum
    ? `${left.slug}-vs-${right.slug}`
    : `${right.slug}-vs-${left.slug}`;
}

/** All routes the comparison serves: ten issues plus fifteen pairings. */
export function allCompareSlugs(): string[] {
  return [...POLICY_AREAS.map((a) => a.id), ...allPairs().map((p) => p.slug)];
}

export function resolveCompare(slug: string): CompareView | null {
  if (slug.includes("-vs-")) {
    const [a, b] = slug.split("-vs-");
    const left = partyBySlug[a as PartySlug];
    const right = partyBySlug[b as PartySlug];
    if (!left || !right || left.slug === right.slug) return null;
    // Only the canonical ordering resolves, so the other direction 404s
    // rather than quietly serving a duplicate.
    if (pairSlug(left.slug, right.slug) !== slug) return null;

    return {
      kind: "pair",
      left,
      right,
      rows: POLICY_AREAS.map((area) => ({
        area,
        left: policyFor(left, area.id),
        right: policyFor(right, area.id),
      })),
    };
  }

  const area = policyAreaById[slug];
  if (!area) return null;

  return {
    kind: "issue",
    area,
    rows: partiesBySpectrum.map((party) => ({
      party,
      policy: policyFor(party, area.id),
    })),
  };
}

/** How many parties have a sourced position on an issue, for the standfirst. */
export function coverageFor(area: PolicyArea): { stated: number; total: number } {
  const stated = parties.filter((p) => p.policies.some((x) => x.area === area)).length;
  return { stated, total: parties.length };
}
