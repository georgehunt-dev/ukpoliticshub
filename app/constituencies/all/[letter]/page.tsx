import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeatLetterNav from "@/components/SeatLetterNav";
import SeatList from "@/components/SeatList";
import { MoreLink, SectionHeading } from "@/components/ui";
import { CONSTITUENCY_SOURCE, seatLetters, seatsByLetter } from "@/lib/constituencies";

/**
 * One page per opening letter of a constituency name.
 *
 * These exist for reachability. The full A to Z is a single page carrying 650
 * outbound links and it was the only route to 637 of the 650 seats, which is
 * the shape that leaves pages sitting in "discovered, currently not indexed":
 * a crawler follows a 650-link page only partially, and what it does follow
 * arrives carrying very little. Twenty-four pages of about twenty-seven links,
 * cross-linked to each other, are cheap to crawl and put every seat the same
 * number of clicks from the front page without the wall in between.
 *
 * They are indexable and in the sitemap on purpose. A noindex hub would keep
 * the coverage report tidy, but Google crawls noindex pages progressively less
 * often, and being crawled is the entire job these pages have.
 */

export function generateStaticParams() {
  return seatLetters().map(({ letter }) => ({ letter: letter.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: PageProps<"/constituencies/all/[letter]">): Promise<Metadata> {
  const { letter } = await params;
  const upper = letter.toUpperCase();
  const seats = seatsByLetter(upper);
  if (!seats.length) return { title: "Constituencies not found" };

  return {
    title: `UK constituencies beginning with ${upper}`,
    description: `All ${seats.length} Westminster ${
      seats.length === 1 ? "constituency" : "constituencies"
    } beginning with ${upper}, from ${seats[0].name} to ${
      seats[seats.length - 1].name
    }, each with its sitting MP and party.`,
    alternates: { canonical: `/constituencies/all/${letter.toLowerCase()}` },
  };
}

export default async function ConstituencyLetterPage({
  params,
}: PageProps<"/constituencies/all/[letter]">) {
  const { letter } = await params;
  const upper = letter.toUpperCase();
  const seats = seatsByLetter(upper);
  if (!seats.length) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7 sm:py-10">
      <SectionHeading
        eyebrow="Your area"
        title={`Constituencies beginning with ${upper}`}
        standfirst={`${seats.length} Westminster ${
          seats.length === 1 ? "seat" : "seats"
        } and the ${seats.length === 1 ? "member" : "members"} sitting for ${
          seats.length === 1 ? "it" : "them"
        }.`}
        action={<MoreLink href="/constituencies/all">All 650</MoreLink>}
      />

      <SeatLetterNav current={upper} />

      <div className="mt-6">
        <SeatList seats={seats} />
      </div>

      <footer className="mt-10 border-t border-rule pt-4">
        <p className="eyebrow mb-2">Source</p>
        <p className="text-[0.86rem] leading-relaxed text-ink-soft">
          Constituencies and sitting members from the{" "}
          <a
            href={CONSTITUENCY_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium"
          >
            {CONSTITUENCY_SOURCE.label}
          </a>
          . Looking for one seat rather than a list?{" "}
          <MoreLink href="/constituencies">Search by postcode or name</MoreLink>
        </p>
      </footer>
    </div>
  );
}
