import type { Metadata } from "next";
import ThreatPanel from "@/components/ThreatPanel";

export const metadata: Metadata = {
  title: "Threat level",
  description:
    "The official UK terrorism threat level, never adjusted by us, alongside our own six-factor assessment of Russian pressure on the UK — each shown with what it can and cannot tell you.",
};

export const revalidate = 600;

export default function ThreatPage() {
  return (
    <div className="shell py-11">
      <ThreatPanel />
    </div>
  );
}
