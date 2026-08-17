import type { Metadata } from "next";
import ImmigrationTracker from "@/components/ImmigrationTracker";

export const metadata: Metadata = {
  title: "Immigration",
  description:
    "Channel crossings year-to-date and by year, the state of the asylum system, and where each party stands — with the wording note that ships alongside the figures.",
};

export const revalidate = 600;

export default function ImmigrationPage() {
  return (
    <div className="shell py-11">
      <ImmigrationTracker />
    </div>
  );
}
