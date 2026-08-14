import Link from "next/link";
import { primeMinisterRatings } from "@/data/government";
import { upcomingElections } from "@/data/elections";
import { officialTerrorismThreat, russiaBand, russiaScore } from "@/data/threat";
import { pollAverage } from "@/data/polls";
import { crossingsYearToDate } from "@/data/immigration";

/**
 * The at-a-glance band directly under the hero: the four numbers a reader
 * came for, before any scrolling. Each is a doorway into the section that
 * explains it.
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

  const cells = [
    {
      href: "/#threat",
      label: "Terrorism threat level",
      value: officialTerrorismThreat.level,
      note: "An attack is highly likely",
      tag: "Official",
      accent: true,
    },
    {
      href: "/#threat",
      label: "Russia pressure on the UK",
      value: `${russiaScore}`,
      suffix: "/100",
      note: russiaBand.label,
      tag: "Our assessment",
    },
    {
      href: "/#prime-minister",
      label: "PM approval",
      value: `${opinium.net != null && opinium.net > 0 ? "+" : ""}${opinium.net}`,
      note: `${opinium.approve}% approve, ${opinium.disapprove}% disapprove`,
      tag: "Opinium",
    },
    {
      href: "/#immigration",
      label: "Channel crossings, 2026",
      value: crossingsYearToDate.total.toLocaleString("en-GB"),
      note: `${Math.abs(crossingsYearToDate.comparisons[0].change)}% lower than the same point in 2025`,
      tag: "Home Office",
    },
    {
      href: "/#polls",
      label: "Labour lead over Reform",
      value: `${gap > 0 ? "+" : ""}${gap}`,
      suffix: "pts",
      note: days != null ? `General election within ${days.toLocaleString("en-GB")} days` : "",
      tag: "Rolling average",
    },
  ];

  return (
    <section aria-label="Key indicators" className="border-b border-rule bg-[color:var(--paper-raised)]">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[color:var(--rule)] lg:grid-cols-5">
        {cells.map((cell) => (
          <li key={cell.label} className="bg-[color:var(--paper-raised)]">
            <Link
              href={cell.href}
              className="group flex h-full flex-col px-4 py-4 transition-colors hover:bg-[color:var(--paper-sunk)]/60 sm:px-5 sm:py-5"
            >
              <p className="eyebrow leading-tight">{cell.label}</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span
                  className={`font-display text-4xl font-bold leading-none tabular sm:text-5xl ${
                    cell.accent ? "text-oxblood" : ""
                  }`}
                >
                  {cell.value}
                </span>
                {cell.suffix ? (
                  <span className="font-display text-lg text-ink-faint">{cell.suffix}</span>
                ) : null}
              </p>
              <p className="mt-1.5 text-[0.8rem] leading-snug text-ink-soft">{cell.note}</p>
              <span className="mt-auto pt-3 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                {cell.tag}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
