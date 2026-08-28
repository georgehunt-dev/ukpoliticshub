import type { Metadata } from "next";
import PollDetail from "@/components/PollDetail";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "The polls",
  description:
    "The polls behind the rolling average that their pollsters publish openly, with fieldwork dates and a link to each write-up, plus what has moved since the last update.",
};

/** Matches the front page: the average is reported, not computed, so it goes
 *  stale on the same clock as the figures it quotes. */
export const revalidate = 600;

export default function PollsPage() {
  return (
    <div className="shell py-11">
      <SectionHeading
        as="h1"
        eyebrow="Behind the average"
        title="The polls themselves"
        standfirst="The rolling average is only as good as what sits under it. Every poll listed here carries its fieldwork dates and a link to the pollster's own write-up, so any figure can be checked at source. Pollsters that publish only to clients and aggregators are counted in the average but cannot be listed, because we will not cite a write-up that does not exist."
      />

      <div className="mt-7">
        <PollDetail />
      </div>
    </div>
  );
}
