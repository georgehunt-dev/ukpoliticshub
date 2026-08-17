import type { Metadata } from "next";
import StatesOverview from "@/components/StatesOverview";
import ThreatPanel from "@/components/ThreatPanel";
import { STATES_CAVEAT } from "@/data/states";

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

      <div className="mt-11">
        <StatesOverview />
      </div>

      <p className="measure mt-10 border-t border-rule pt-4 text-[0.84rem] leading-relaxed text-ink-soft">
        {STATES_CAVEAT}
      </p>
    </div>
  );
}
