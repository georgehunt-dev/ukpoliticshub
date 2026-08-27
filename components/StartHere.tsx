import Link from "next/link";
import SpectrumRow, { type SpectrumParty } from "@/components/SpectrumRow";
import { OurAssessment } from "@/components/ui";
import { allPlacements, partiesLeftToRight, spectrumBand } from "@/lib/spectrum";

/**
 * Orientation for readers with no background in British politics: the whole
 * spectrum on one line, in plain English, before any of the detail below.
 *
 * The placements are a judgement of ours, so the panel carries the same
 * assessment flag every other judgement on the site carries. The previous
 * version published them bare, which it should not have.
 */
export default function StartHere() {
  const placements = allPlacements();

  const parties: SpectrumParty[] = partiesLeftToRight().map((party) => ({
    slug: party.slug,
    name: party.shortName,
    band: spectrumBand(party.spectrum, placements),
    spectrum: party.spectrum,
    colour: party.colour,
    gloss: party.spectrumGloss,
    leader: party.leader.name,
  }));

  return (
    <section aria-label="Start here" className="border-b border-rule bg-[color:var(--paper-sunk)]/45">
      <div className="shell py-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow">New to this?</p>
            <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
              The whole spectrum, left to right
            </h2>
          </div>
          <OurAssessment />
        </div>

        <p className="measure mt-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
          Broadly, the left favours more state spending and looser immigration rules; the right
          favours lower taxes and tighter ones. Each column says where a party sits and what that
          means in practice —{" "}
          <Link href="/how-we-work#spectrum" className="link-underline">
            how we place them
          </Link>
          .
        </p>

        <SpectrumRow parties={parties} />
      </div>
    </section>
  );
}
