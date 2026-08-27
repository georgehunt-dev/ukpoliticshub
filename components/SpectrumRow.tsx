"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * The spectrum, as six columns read left to right.
 *
 * The order is the spectrum, so there is no axis to draw. Party colour appears
 * only as a 2px rule at the head of each column, on this site colour is a
 * hairline, never a field, and a row of filled blocks read as a chart bolted
 * on rather than part of the paper.
 *
 * What it deliberately does not show is support. The race for No.10 sits one
 * panel above with the same six parties and their polling; repeating that here
 * made the front page feel padded. This answers the other question: where each
 * party stands, and what that means.
 *
 * The trade-off worth knowing: the row shows order but not distance. The
 * Conservatives and Reform are three points apart on our scale while Labour
 * and the Lib Dems are one, and both draw as a single column of separation.
 * The placements themselves are printed in the panel below.
 */

export type SpectrumParty = {
  slug: string;
  name: string;
  band: string;
  spectrum: number;
  colour: string;
  gloss: string;
  leader: string;
};

export default function SpectrumRow({ parties }: { parties: SpectrumParty[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = parties.find((party) => party.slug === openSlug) ?? null;

  return (
    <div>
      <div className="mt-4 grid grid-cols-2 border-l border-rule/60 sm:grid-cols-3 lg:grid-cols-6">
        {parties.map((party) => {
          const isOpen = party.slug === openSlug;
          return (
            <button
              key={party.slug}
              type="button"
              aria-pressed={isOpen}
              onClick={() => setOpenSlug(isOpen ? null : party.slug)}
              className={`flex min-w-0 flex-col border-b border-r border-rule/60 px-3 pb-3 text-left transition-colors hover:bg-[color:var(--paper-sunk)] lg:border-b-0 ${
                isOpen ? "bg-[color:var(--paper-sunk)]" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="-mx-3 mb-2.5 block h-[2px]"
                style={{ background: party.colour }}
              />
              <span className="text-[0.56rem] font-bold uppercase tracking-[0.13em] text-ink-faint">
                {party.band}
              </span>
              <span
                className={`mt-0.5 font-display text-xl leading-none ${
                  isOpen ? "text-oxblood" : ""
                }`}
              >
                {party.name}
              </span>
              <span className="mt-1.5 text-[0.74rem] leading-snug text-ink-soft">
                {party.gloss}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ink-faint">
        <span>Left</span>
        <span>Right</span>
      </div>

      <div className="mt-4 min-h-[4.5rem] border-t border-rule pt-3">
        {open ? (
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="w-[2px] self-stretch"
              style={{ background: open.colour }}
            />
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight">
                {open.name}{" "}
                <span className="font-body text-[0.78rem] font-normal text-ink-faint">
                  {open.leader}
                </span>
              </p>
              <p className="mt-0.5 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                {open.band} · {open.spectrum > 0 ? "+" : ""}
                {open.spectrum} on our scale
              </p>
              <p className="measure mt-1.5 text-[0.86rem] leading-relaxed text-ink-soft">
                {open.gloss}
              </p>
              <p className="mt-2">
                <Link
                  href={`/parties/${open.slug}`}
                  className="font-body text-[0.68rem] font-bold uppercase tracking-[0.12em] text-oxblood"
                >
                  Read the full profile &rsaquo;
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[0.76rem] italic leading-snug text-ink-faint">
            Select a party for our placement and the reasoning behind it.
          </p>
        )}
      </div>
    </div>
  );
}
