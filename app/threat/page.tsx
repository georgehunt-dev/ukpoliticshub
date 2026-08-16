import type { Metadata } from "next";
import AssessmentCard from "@/components/AssessmentCard";
import StatesOverview from "@/components/StatesOverview";
import ThreatPanel from "@/components/ThreatPanel";
import { partnerships, STATES_CAVEAT, threats } from "@/data/states";

export const metadata: Metadata = {
  title: "Threats & alliances",
  description:
    "The official UK terrorism threat level, never adjusted by us, alongside our own weighted assessments of pressure from Russia, Iran and China — and of what the UK can rely on from the United States, NATO and Europe. Every factor sourced.",
};

export const revalidate = 600;

export default function ThreatPage() {
  return (
    <div className="shell py-11">
      <ThreatPanel />

      <div className="mt-14 border-t-2 border-ink pt-8">
        <StatesOverview />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl leading-tight">The threats in full</h2>
        <div className="mt-4 space-y-6">
          {threats.map((assessment) => (
            <AssessmentCard key={assessment.slug} assessment={assessment} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl leading-tight">The alliances in full</h2>
        <div className="mt-4 space-y-6">
          {partnerships.map((assessment) => (
            <AssessmentCard key={assessment.slug} assessment={assessment} />
          ))}
        </div>
      </section>

      <p className="measure mt-10 border-t border-rule pt-4 text-[0.84rem] leading-relaxed text-ink-soft">
        {STATES_CAVEAT}
      </p>
    </div>
  );
}
