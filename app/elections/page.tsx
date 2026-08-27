import type { Metadata } from "next";
import Image from "next/image";
import EmailCapture from "@/components/EmailCapture";
import Portrait from "@/components/Portrait";
import SectionImage from "@/components/SectionImage";
import { Cite, SectionHeading, formatDate } from "@/components/ui";
import { recentResults, upcomingElections } from "@/data/elections";
import { getPhoto, type PhotoSlug } from "@/lib/photos";
import type { ElectionEvent } from "@/lib/types";

/** A square photographic plate, sized and ruled to match Portrait. */
function ResultPhoto({ slug, alt }: { slug: PhotoSlug; alt: string }) {
  const photo = getPhoto(slug);
  if (!photo) return null;

  return (
    <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-paper-sunk">
      <Image
        src={photo.file}
        alt={alt}
        width={112}
        height={112}
        sizes="112px"
        className="h-full w-full object-cover"
        style={{ objectPosition: photo.position }}
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[color:var(--rule)]" />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Elections",
  description:
    "The UK election calendar: the next general election deadline, scheduled local and devolved contests, and the by-elections that have already reshaped this Parliament.",
};

/** Real date, so the countdowns stay correct without a redeploy. */
const TODAY = new Date().toISOString().slice(0, 10);

function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00Z`).getTime();
  const now = new Date(`${TODAY}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((target - now) / 86_400_000));
}

/** 1,093 is a number nobody can feel. "About 3 years" is. */
function roughly(days: number): string {
  if (days < 60) return `about ${Math.round(days / 7)} weeks`;
  if (days < 730) return `about ${Math.round(days / 30.44)} months`;
  const years = days / 365.25;
  const rounded = Math.round(years * 10) / 10;
  return `about ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} years`;
}

const CERTAINTY_LABEL: Record<string, string> = {
  scheduled: "Fixed date",
  deadline: "Latest possible date",
  expected: "Expected",
};

const CERTAINTY_CLASS: Record<string, string> = {
  scheduled: "text-ink",
  deadline: "text-[color:var(--oxblood)]",
  expected: "text-[color:var(--gold)]",
};

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parts(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return {
    day: date.getUTCDate(),
    month: MONTHS_SHORT[date.getUTCMonth()],
    year: date.getUTCFullYear(),
    weekday: date.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" }),
  };
}

/**
 * One card per polling day, not per contest. 6 May 2027 carries both the local
 * elections and the Northern Ireland Assembly election; listing it twice reads
 * as two separate trips to the ballot box, which is wrong.
 */
function byPollingDay(events: ElectionEvent[]): { date: string; events: ElectionEvent[] }[] {
  const days = new Map<string, ElectionEvent[]>();
  for (const event of events) {
    const existing = days.get(event.date);
    if (existing) existing.push(event);
    else days.set(event.date, [event]);
  }
  return [...days.entries()]
    .map(([date, list]) => ({ date, events: list }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function ElectionsPage() {
  const pollingDays = byPollingDay(upcomingElections);

  return (
    <div className="shell py-11">
      <SectionImage
        as="h1"
        photo="election-count"
        title="Upcoming elections"
        titleClassName="text-4xl sm:text-6xl lg:text-7xl"
        standfirst={
          <>
            <span className="block">
              What is scheduled, what is only a deadline, and what is merely expected.
            </span>
            <span className="block">
              The difference matters, so it is stated on every entry.
            </span>
          </>
        }
        alt="Sealed ballot boxes waiting to be opened at a general election count"
        height="h-52 sm:h-72"
      />

      <p className="mt-7 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
        {pollingDays.length === 1
          ? "One polling day left in this Parliament"
          : `${pollingDays.length} polling days left in this Parliament`}{" "}
        · Nearest first
      </p>

      <ol className="mt-3 border-t-2 border-ink">
        {pollingDays.map(({ date, events }) => {
          const when = parts(date);
          const away = daysUntil(date);

          return (
            <li
              key={date}
              /* Narrow: date and countdown share the top row, detail underneath.
                 Wide: all three sit on one line. */
              className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-7 gap-y-5 border-b border-rule py-6 lg:grid-cols-[7rem_minmax(0,1fr)_auto]"
            >
              {/* The torn-off date block. A fixed square, and self-start so a
                  card carrying two contests does not stretch it into a column. */}
              <div className="col-start-1 row-start-1 flex h-28 w-28 flex-col items-center justify-center self-start border border-ink bg-[color:var(--paper-raised)] text-center">
                <span className="block font-display text-[2.6rem] font-bold leading-[0.85] tabular">
                  {when.day}
                </span>
                <span className="mt-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.2em]">
                  {when.month}
                </span>
                <span className="mt-0.5 block text-[0.62rem] tracking-[0.16em] text-ink-faint">
                  {when.year}
                </span>
              </div>

              {/* What is actually being voted on, with the detail and the source. */}
              <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                  {when.weekday}
                  {when.weekday !== "Thursday" ? (
                    <span className="font-normal normal-case tracking-normal text-ink-faint">
                      , not a Thursday, which is the tell that this is a backstop rather than a plan
                    </span>
                  ) : null}
                </p>

                <ul className="mt-2.5">
                  {events.map((event) => (
                    <li
                      key={event.name}
                      className="py-3 first:pt-0 [&+li]:border-t [&+li]:border-rule"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="font-display text-xl leading-tight sm:text-2xl">
                          {event.name}
                        </h2>
                        <span
                          className={`text-[0.6rem] font-bold uppercase tracking-[0.13em] ${
                            CERTAINTY_CLASS[event.certainty] ?? "text-ink-soft"
                          }`}
                        >
                          {CERTAINTY_LABEL[event.certainty]}
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-3xl text-[0.9rem] leading-relaxed text-ink-soft">
                        {event.detail}
                      </p>
                      <p className="mt-2 text-[0.75rem]">
                        <Cite source={event.source} />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The countdown, which is what most people came for: boxed to
                  match the date plate at the other end of the row. */}
              <div className="col-start-2 row-start-1 flex h-28 w-36 flex-col items-center justify-center self-start justify-self-end border border-ink bg-[color:var(--paper-raised)] text-center lg:col-start-3">
                <span className="block font-display text-[2.4rem] font-bold leading-[0.85] tabular">
                  {away.toLocaleString("en-GB")}
                </span>
                <span className="mt-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                  days away
                </span>
                <span className="mt-0.5 block text-[0.7rem] text-[color:var(--oxblood)]">
                  {roughly(away)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-14">
        <SectionHeading
          title="Contests that shaped this Parliament"
          standfirst="By-elections and scheduled contests since 2024: the only real-world tests of the polling picture."
        />

        <ol className="panel mt-6 divide-y divide-[color:var(--rule)]">
          {recentResults.map((result) => (
            <li
              key={result.name}
              className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:gap-6 sm:px-7"
            >
              <figure className="m-0 shrink-0 sm:w-32">
                {result.image.kind === "portrait" ? (
                  <Portrait
                    slug={result.image.slug}
                    name={result.image.name}
                    size="lg"
                    className="h-28 w-28"
                  />
                ) : (
                  <ResultPhoto slug={result.image.slug} alt={result.image.alt} />
                )}
                <figcaption className="mt-1.5 max-w-28 text-[0.65rem] leading-snug text-ink-faint">
                  {result.image.caption}
                </figcaption>
              </figure>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    {formatDate(result.date)}
                  </span>
                  <h3 className="font-display text-xl leading-snug sm:text-2xl">
                    {result.headline}
                  </h3>
                </div>
                <p className="mt-0.5 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-ink-soft">
                  {result.name}
                </p>
                <p className="mt-2.5 max-w-3xl text-[0.9rem] leading-relaxed text-ink-soft">
                  {result.detail}
                </p>
                <p className="mt-2.5 text-[0.75rem]">
                  <Cite source={result.source} />
                </p>
              </div>
            </li>
          ))}
        </ol>

        <EmailCapture
          className="mt-8"
          reason="Elections and polling"
          heading="Know the moment the numbers move"
          blurb="The rolling poll average, by-elections as they are called, and what the results mean locally and nationally, in one email each morning."
        />
      </div>
    </div>
  );
}
