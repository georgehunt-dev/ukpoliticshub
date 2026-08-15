"use client";

import { useRouter } from "next/navigation";
import { POLICY_AREAS } from "@/data/policy-areas";
import { partiesBySpectrum } from "@/lib/compare";
import type { PartySlug } from "@/lib/types";

/**
 * The entire control surface: one sentence with two dropdowns in it.
 *
 * Changing either navigates rather than mutating client state, because each
 * view is a real URL — shareable, indexable, and with its own share card.
 * A toolbar would have fought the page; a sentence reads like the rest of it.
 */
export default function CompareControls({
  mode,
  issue,
  left,
  right,
}: {
  mode: "issue" | "pair";
  issue?: string;
  left?: PartySlug;
  right?: PartySlug;
}) {
  const router = useRouter();

  const select =
    "border-b-2 border-oxblood bg-transparent font-display text-[1.05em] font-bold text-ink " +
    "focus:outline-none focus:ring-0 cursor-pointer hover:text-oxblood transition-colors";

  function goToIssue(next: string) {
    router.push(`/compare/${next}`);
  }

  function goToPair(a: string, b: string) {
    if (a === b) return;
    const first = partiesBySpectrum.find((p) => p.slug === a);
    const second = partiesBySpectrum.find((p) => p.slug === b);
    if (!first || !second) return;
    const ordered =
      first.spectrum <= second.spectrum
        ? `${first.slug}-vs-${second.slug}`
        : `${second.slug}-vs-${first.slug}`;
    router.push(`/compare/${ordered}`);
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 font-display text-2xl leading-snug sm:text-3xl">
      <span>Compare</span>

      {mode === "issue" ? (
        <>
          <label htmlFor="party-mode" className="sr-only">
            Which parties to compare
          </label>
          <select
            id="party-mode"
            className={select}
            value="all"
            onChange={(e) => {
              if (e.target.value !== "all") goToPair(e.target.value, "reform");
            }}
          >
            <option value="all">all parties</option>
            {partiesBySpectrum
              .filter((p) => p.slug !== "reform")
              .map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.shortName} vs Reform
                </option>
              ))}
          </select>

          <span>on</span>

          <label htmlFor="issue" className="sr-only">
            Which issue
          </label>
          <select
            id="issue"
            className={select}
            value={issue}
            onChange={(e) => goToIssue(e.target.value)}
          >
            {POLICY_AREAS.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name.toLowerCase()}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label htmlFor="left" className="sr-only">
            First party
          </label>
          <select
            id="left"
            className={select}
            value={left}
            onChange={(e) => goToPair(e.target.value, right as string)}
          >
            {partiesBySpectrum.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.shortName}
              </option>
            ))}
          </select>

          <span>with</span>

          <label htmlFor="right" className="sr-only">
            Second party
          </label>
          <select
            id="right"
            className={select}
            value={right}
            onChange={(e) => goToPair(left as string, e.target.value)}
          >
            {partiesBySpectrum.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.shortName}
              </option>
            ))}
          </select>

          <span>across every issue</span>
        </>
      )}
    </div>
  );
}
