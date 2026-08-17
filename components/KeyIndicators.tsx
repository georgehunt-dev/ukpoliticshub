import Image from "next/image";
import Link from "next/link";
import { primeMinisterRatings } from "@/data/government";
import { upcomingElections } from "@/data/elections";
import { officialTerrorismThreat, russiaBand, russiaScore } from "@/data/threat";
import { pollAverage } from "@/data/polls";
import { crossingsYearToDate } from "@/data/immigration";
import { getPhoto, type PhotoSlug } from "@/lib/photos";

/**
 * The at-a-glance strip: the six numbers a reader came for, each with a
 * picture so the row is scannable rather than read.
 *
 * Six, not five. The tiles fall into two columns on a phone, and five leaves a
 * hole in the bottom row; the sixth — how long until the next general election
 * — closes it and is the only one of the six that never goes stale.
 */
export default function KeyIndicators({ today }: { today: string }) {
  const generalElection = upcomingElections.find((e) => e.certainty === "deadline");
  const days = generalElection
    ? Math.max(
        0,
        Math.round(
          (new Date(`${generalElection.date}T00:00:00Z`).getTime() -
            new Date(`${today}T00:00:00Z`).getTime()) /
            86_400_000
        )
      )
    : null;

  const opinium = primeMinisterRatings[0];
  const gap = Number((pollAverage[0].pct - pollAverage[1].pct).toFixed(1));

  const cells: {
    href: string;
    label: string;
    value: string;
    suffix?: string;
    note: string;
    tag: string;
    photo: PhotoSlug;
    alt: string;
    accent?: boolean;
  }[] = [
    {
      href: "/threat",
      label: "Terrorism threat level",
      value: officialTerrorismThreat.level,
      note: "An attack is highly likely",
      tag: "Official",
      photo: "justice",
      alt: "The Royal Courts of Justice",
      accent: true,
    },
    {
      href: "/threat",
      label: "Russia pressure on the UK",
      value: `${russiaScore}`,
      suffix: "/100",
      note: russiaBand.label,
      tag: "Our assessment",
      photo: "royal-navy",
      alt: "A Royal Navy frigate under way",
    },
    {
      href: "/prime-minister",
      label: "PM approval",
      value: `${opinium.net != null && opinium.net > 0 ? "+" : ""}${opinium.net}`,
      note: `${opinium.approve}% approve, ${opinium.disapprove}% disapprove`,
      tag: "Opinium",
      photo: "downing-street",
      alt: "The door of 10 Downing Street",
    },
    {
      href: "/immigration",
      label: "Channel crossings, 2026",
      value: crossingsYearToDate.total.toLocaleString("en-GB"),
      note: `${Math.abs(crossingsYearToDate.comparisons[0].change)}% lower than this point in 2025`,
      tag: "Home Office",
      photo: "dover",
      alt: "The White Cliffs of Dover",
    },
    {
      href: "/polls",
      label: "Labour lead over Reform",
      value: `${gap > 0 ? "+" : ""}${gap}`,
      suffix: "pts",
      note: "Rolling average of BPC polls",
      tag: "PollCheck",
      photo: "westminster",
      alt: "The Palace of Westminster across the Thames",
    },
    {
      href: "/elections",
      label: "Next general election",
      value: days != null ? days.toLocaleString("en-GB") : "—",
      suffix: days != null ? "days" : undefined,
      note: "By 15 August 2029 at the latest",
      tag: "Fixed-term rules",
      photo: "polling-station",
      alt: "A polling station sign outside a British polling place",
    },
  ];

  return (
    <section
      aria-label="Key indicators"
      className="border-y border-rule bg-[color:var(--paper-raised)]"
    >
      {/* The shell's padding goes on the wrapper, not on the grid. With both on
          the same element the grid's rule-coloured background painted the
          padding too, drawing a grey strip down each side of the row. */}
      <div className="shell">
        <ul className="grid grid-cols-2 gap-px bg-[color:var(--rule)] lg:grid-cols-6">
        {cells.map((cell) => {
          const photo = getPhoto(cell.photo);
          return (
            <li key={cell.label} className="bg-[color:var(--paper-raised)]">
              <Link
                href={cell.href}
                className="group flex h-full gap-2.5 px-3 py-3.5 transition-colors hover:bg-[color:var(--paper-sunk)]/60 sm:px-4 sm:py-4"
              >
                {photo ? (
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-ink">
                    <Image
                      src={photo.file}
                      alt={cell.alt}
                      fill
                      sizes="44px"
                      className="object-cover"
                      style={{ objectPosition: photo.position }}
                    />
                  </span>
                ) : null}

                <span className="flex min-w-0 flex-col">
                  <span className="eyebrow leading-tight">{cell.label}</span>
                  <span className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`font-display text-2xl font-bold leading-none tabular sm:text-3xl ${
                        cell.accent ? "text-oxblood" : ""
                      }`}
                    >
                      {cell.value}
                    </span>
                    {cell.suffix ? (
                      <span className="font-display text-sm text-ink-faint">{cell.suffix}</span>
                    ) : null}
                  </span>
                  <span className="mt-1 text-[0.72rem] leading-snug text-ink-soft">{cell.note}</span>
                  <span className="mt-auto pt-1.5 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    {cell.tag}
                  </span>
                </span>
              </Link>
            </li>
          );
          })}
        </ul>
      </div>
    </section>
  );
}
