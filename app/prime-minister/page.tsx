import type { Metadata } from "next";
import PrimeMinisterPanel from "@/components/PrimeMinisterPanel";

export const metadata: Metadata = {
  title: "The Prime Minister",
  description:
    "Approval ratings, the best-prime-minister head-to-head, and how the government is standing — each figure carrying the poll it came from.",
};

export const revalidate = 600;

export default function PrimeMinisterPage() {
  return (
    <div className="shell py-11">
      <PrimeMinisterPanel />
    </div>
  );
}
