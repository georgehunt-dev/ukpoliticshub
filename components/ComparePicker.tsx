"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PolicyIcon from "@/components/PolicyIcon";
import { POLICY_AREAS } from "@/data/policy-areas";
import { partiesBySpectrum } from "@/lib/compare";
import type { PartySlug, PolicyArea } from "@/lib/types";

/**
 * The whole control surface, and the same one on both kinds of comparison
 * page so there is nothing new to learn moving between them.
 *
 * The ten issues are links rather than a dropdown. A menu hides nine of the
 * ten options behind a click, which on the page whose entire job is showing
 * what can be compared is the wrong way round; and as links they give the ten
 * comparison pages internal links, which they previously had only in a block
 * at the very foot of the page.
 *
 * The two party selects replace a dropdown that offered "Green vs Reform",
 * "Labour vs Reform", and so on down the list, because the counterpart was
 * hardcoded. Labour against the Conservatives could not be reached from an
 * issue page at all. Either side is now any party.
 */
export default function ComparePicker({
  issue,
  left,
  right,
}: {
  /** Set on an issue page, so that chip is marked as current. */
  issue?: PolicyArea;
  left?: PartySlug;
  right?: PartySlug;
}) {
  const router = useRouter();
  const [a, setA] = useState<string>(left ?? "labour");
  const [b, setB] = useState<string>(right ?? "reform");

  function compare() {
    if (a === b) return;
    const first = partiesBySpectrum.find((p) => p.slug === a);
    const second = partiesBySpectrum.find((p) => p.slug === b);
    if (!first || !second) return;
    // The URL is always spectrum-ordered, so Labour vs Reform and Reform vs
    // Labour are one page rather than two of the same thing.
    const ordered =
      first.spectrum <= second.spectrum
        ? `${first.slug}-vs-${second.slug}`
        : `${second.slug}-vs-${first.slug}`;
    router.push(`/compare/${ordered}`);
  }

  const select =
    "border border-rule bg-[color:var(--paper-raised)] px-2 py-1 text-[0.85rem] " +
    "transition-colors hover:border-ink focus:border-ink focus:outline-none";

  return (
    <div className="mt-5 border-y border-rule py-4">
      <p className="eyebrow mb-2.5">
        {issue ? "Compare all six on" : "Or compare all six on one issue"}
      </p>

      <ul className="flex flex-wrap gap-1.5">
        {POLICY_AREAS.map((area) => {
          const current = area.id === issue;
          return (
            <li key={area.id}>
              <Link
                href={`/compare/${area.id}`}
                aria-current={current ? "page" : undefined}
                className={`flex items-center gap-1.5 border px-2.5 py-1.5 text-[0.8rem] transition-colors ${
                  current
                    ? "border-ink bg-ink font-semibold text-[color:var(--paper)]"
                    : "border-rule text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                <PolicyIcon area={area.id} className="h-[15px] w-[15px] shrink-0" />
                {area.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-dotted border-rule pt-3 text-[0.88rem] text-ink-soft">
        <span>{issue ? "Or put two head to head across all ten:" : "Head to head:"}</span>

        <label htmlFor="compare-a" className="sr-only">
          First party
        </label>
        <select id="compare-a" className={select} value={a} onChange={(e) => setA(e.target.value)}>
          {partiesBySpectrum.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.shortName}
            </option>
          ))}
        </select>

        <span>vs</span>

        <label htmlFor="compare-b" className="sr-only">
          Second party
        </label>
        <select id="compare-b" className={select} value={b} onChange={(e) => setB(e.target.value)}>
          {partiesBySpectrum.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.shortName}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={compare}
          disabled={a === b}
          className="border border-ink px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.13em] transition-colors hover:bg-ink hover:text-[color:var(--paper)] disabled:cursor-not-allowed disabled:border-rule disabled:text-ink-faint disabled:hover:bg-transparent"
        >
          {a === b ? "Pick two" : "Compare →"}
        </button>
      </div>
    </div>
  );
}
