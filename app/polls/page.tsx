import type { Metadata } from "next";
import PollDetail from "@/components/PollDetail";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "The polls",
  description:
    "Every poll behind the rolling average, with fieldwork dates and a link to each pollster's own write-up, plus what has moved since the last update.",
};

/** Matches the front page: the average is reported, not computed, so it goes
 *  stale on the same clock as the figures it quotes. */
export const revalidate = 600;

export default function PollsPage() {
  return (
    <div className="shell py-11">
      <SectionHeading
        eyebrow="Behind the average"
        title="The polls themselves"
        standfirst="The rolling average is only as good as what sits under it. Every poll in it is listed here with its fieldwork dates, and each links to the pollster's own write-up so any figure can be checked at source."
      />

      <div className="mt-7">
        <PollDetail />
      </div>
    </div>
  );
}
