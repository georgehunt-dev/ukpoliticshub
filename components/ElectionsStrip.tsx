import Image from "next/image";
import Link from "next/link";
import { upcomingElections } from "@/data/elections";
import { formatDate } from "@/components/ui";
import { credit, getPhoto } from "@/lib/photos";

function daysUntil(iso: string, from: Date): number {
  const target = new Date(`${iso}T00:00:00Z`);
  const start = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  return Math.max(0, Math.round((target.getTime() - start) / 86_400_000));
}

/** Countdown band over Westminster. The full calendar lives at /elections. */
export default function ElectionsStrip({ today }: { today: string }) {
  const now = new Date(`${today}T00:00:00Z`);
  const photo = getPhoto("westminster");

  const shown = [
    upcomingElections.find((e) => e.certainty === "deadline"),
    ...upcomingElections.filter((e) => e.certainty !== "deadline").slice(0, 2),
  ].filter(Boolean) as typeof upcomingElections;

  return (
    <section id="elections" className="relative isolate scroll-mt-20 bg-ink text-[color:var(--paper)]">
      {photo ? (
        <>
          <Image
            src={photo.file}
            alt="The Palace of Westminster and Elizabeth Tower from across the Thames"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(8,16,30,0.94) 0%, rgba(8,16,30,0.82) 55%, rgba(8,16,30,0.62) 100%)",
            }}
          />
        </>
      ) : null}

      <Link href="/elections" className="group relative block">
        <div className="mx-auto max-w-6xl px-5 py-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--paper)]/70">
                The calendar
              </p>
              <h2 className="mt-1.5 font-display text-4xl leading-none sm:text-5xl">
                Upcoming elections
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--paper)]/85">
              Full calendar
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>

          <ul className="mt-7 grid gap-8 sm:grid-cols-3">
            {shown.map((election) => (
              <li key={election.name + election.date}>
                <p className="font-display text-4xl font-bold leading-none tabular sm:text-5xl">
                  {daysUntil(election.date, now).toLocaleString("en-GB")}
                  <span className="ml-2 font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--paper)]/60">
                    days
                  </span>
                </p>
                <p className="mt-2 text-[0.95rem] font-semibold leading-tight">{election.name}</p>
                <p className="text-[0.8rem] text-[color:var(--paper)]/65">
                  {formatDate(election.date)}
                  {election.certainty === "deadline" ? " · latest possible" : ""}
                  {election.certainty === "expected" ? " · expected" : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Link>

      {photo ? (
        <span className="absolute right-2 top-2 text-[0.6rem] text-[color:var(--paper)]/40">
          {credit(photo)}
        </span>
      ) : null}
    </section>
  );
}
