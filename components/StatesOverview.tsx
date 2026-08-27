import Image from "next/image";
import Link from "next/link";
import { OurAssessment, SectionHeading } from "@/components/ui";
import { type Assessment, bandOf, partnerships, scoreOf, threats } from "@/data/states";
import { getPhoto } from "@/lib/photos";

/**
 * The index of the six assessments: a picture, a score and a sentence each.
 *
 * The full working (every factor, its weight and its sources) lives on the
 * assessment's own page. Stacked on one page it ran to forty factors of
 * unbroken prose, which is a reference document rather than something anyone
 * reads.
 *
 * Threats and alliances are kept on separate rows on purpose. They share a
 * method (weighted factors, weights summing to 100), but not a meaning, and
 * one row carrying both would invite the reading that a strong alliance
 * cancels out a hostile state.
 */
function Card({ assessment, highIsBad }: { assessment: Assessment; highIsBad: boolean }) {
  const score = scoreOf(assessment);
  const band = bandOf(assessment);
  const photo = getPhoto(assessment.photo);
  const alarming = highIsBad && score >= 60;

  return (
    <li>
      <Link
        href={`/threat/${assessment.slug}`}
        className="group flex h-full flex-col border border-rule bg-[color:var(--paper-raised)] transition-colors hover:border-ink"
      >
        <span className="relative block h-32 overflow-hidden bg-ink sm:h-36">
          {photo ? (
            <Image
              src={photo.file}
              alt={assessment.photoAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ objectPosition: photo.position }}
            />
          ) : null}
          <span
            className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-3 py-2"
            style={{
              background:
                "linear-gradient(to top, rgba(8,16,30,0.85) 0%, rgba(8,16,30,0) 100%)",
            }}
          >
            <span
              className="font-display text-2xl leading-none text-[color:var(--paper)]"
              style={{ textShadow: "0 1px 8px rgba(8,16,30,0.8)" }}
            >
              {assessment.name}
            </span>
            <span
              className={`font-display text-3xl font-bold leading-none tabular ${
                alarming ? "text-[#ff8d9e]" : "text-[color:var(--paper)]"
              }`}
              style={{ textShadow: "0 1px 8px rgba(8,16,30,0.8)" }}
            >
              {score}
            </span>
          </span>
        </span>

        <span className="flex flex-1 flex-col px-3.5 py-3">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
            {band.label}
          </span>
          <span className="mt-1 text-[0.83rem] leading-snug text-ink-soft">
            {assessment.summary}
          </span>
          <span className="mt-auto pt-2.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-oxblood">
            The working &rsaquo;
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function StatesOverview() {
  return (
    <div>
      <section>
        <SectionHeading
          eyebrow="Pressure on the UK"
          title="State threats"
          standfirst="Our own weighted assessments, not government figures. Higher is worse, and scored conservatively: documented grey-zone activity is not a warning of imminent attack. Open any one for the full working."
          action={<OurAssessment />}
        />
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {threats.map((assessment) => (
            <Card key={assessment.slug} assessment={assessment} highIsBad />
          ))}
        </ul>
      </section>

      <section className="mt-9">
        <SectionHeading
          eyebrow="What the UK can rely on"
          title="Alliances"
          standfirst="Higher is better. Treaty commitments and institutional ties score above political warmth, because they survive a change of government."
          action={<OurAssessment />}
        />
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partnerships.map((assessment) => (
            <Card key={assessment.slug} assessment={assessment} highIsBad={false} />
          ))}
        </ul>
      </section>
    </div>
  );
}
