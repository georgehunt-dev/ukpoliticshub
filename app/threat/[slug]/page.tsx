import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AssessmentCard from "@/components/AssessmentCard";
import AssessmentNews from "@/components/AssessmentNews";
import EmailCapture from "@/components/EmailCapture";
import SectionImage from "@/components/SectionImage";
import { MoreLink } from "@/components/ui";
import {
  assessmentBySlug,
  assessments,
  bandOf,
  partnerships,
  scoreOf,
  STATES_CAVEAT,
  threats,
} from "@/data/states";

export function generateStaticParams() {
  return assessments.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/threat/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const assessment = assessmentBySlug[slug];
  if (!assessment) return { title: "Assessment not found" };

  const score = scoreOf(assessment);
  const band = bandOf(assessment);
  const kind =
    assessment.kind === "threat"
      ? "state pressure on the UK"
      : "what the UK can rely on from this partner";

  return {
    title: `${assessment.name} — our assessment`,
    description: `Our weighted assessment of ${kind}: ${assessment.name} scores ${score}/100 (${band.label}). Every factor scored on its own evidence and sourced. Not a government figure.`,
    alternates: { canonical: `/threat/${assessment.slug}` },
  };
}

export const revalidate = 600;

export default async function AssessmentPage({ params }: PageProps<"/threat/[slug]">) {
  const { slug } = await params;
  const assessment = assessmentBySlug[slug];
  if (!assessment) notFound();

  const score = scoreOf(assessment);
  const band = bandOf(assessment);
  const isThreat = assessment.kind === "threat";
  const siblings = (isThreat ? threats : partnerships).filter((a) => a.slug !== assessment.slug);

  return (
    <div>
      <SectionImage
        photo={assessment.photo}
        eyebrow={isThreat ? "State threat · Our assessment" : "Alliance · Our assessment"}
        title={assessment.name}
        standfirst={assessment.summary}
        alt={assessment.photoAlt}
        as="h1"
      />

      <div className="shell py-9">
        <p className="text-[0.75rem] leading-snug text-ink-faint">
          Photograph shows {assessment.photoAlt.replace(/^The /, "the ")} — a landmark, chosen
          because it identifies the country without editorialising about it.
        </p>

        <nav className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] text-ink-soft">
          <Link href="/threat" className="link-underline font-medium">
            Threats &amp; alliances
          </Link>
          <span aria-hidden="true" className="text-ink-faint">
            ›
          </span>
          <span>
            {assessment.name} · {score}/100 · {band.label}
          </span>
        </nav>

        <div className="mt-6">
          <AssessmentCard assessment={assessment} />
        </div>

        <section className="mt-10 border-t border-rule pt-5">
          <p className="eyebrow">
            {isThreat ? "The other threat assessments" : "The other alliances"}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {siblings.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/threat/${other.slug}`}
                  className="link-underline text-[0.9rem] text-ink-soft"
                >
                  {other.name}{" "}
                  <span className="tabular text-ink-faint">{scoreOf(other)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <MoreLink href="/threat">All six, and the official terrorism level</MoreLink>
          </p>
        </section>

        {/* Coverage updates itself; the score above does not. */}
        <AssessmentNews
          slug={assessment.slug}
          name={assessment.name}
          assessedOn={assessment.assessedOn}
        />

        <EmailCapture
          className="mt-10"
          heading="The threat picture, every morning"
          blurb="The official terrorism level, our own read on state pressure, and the day's politics from both sides."
          reason="The morning email"
        />

        <p className="measure mt-8 border-t border-rule pt-4 text-[0.84rem] leading-relaxed text-ink-soft">
          {STATES_CAVEAT}
        </p>
      </div>
    </div>
  );
}
