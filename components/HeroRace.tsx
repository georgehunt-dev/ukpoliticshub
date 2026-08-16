import Image from "next/image";
import Link from "next/link";
import Portrait from "@/components/Portrait";
import { formatDate } from "@/components/ui";
import { partyBySlug } from "@/data/parties";
import { POLL_AVERAGE_AS_OF, POLL_AVERAGE_SOURCE, pollAverage } from "@/data/polls";
import { credit, getPhoto } from "@/lib/photos";
import { onDark } from "@/lib/colour";

/**
 * The front page opens on the door of No.10: the photograph carries the
 * headline and the standings sit over it.
 *
 * It now occupies the left column of the front page rather than the full
 * width, so the type is smaller and the standings sit under the headline
 * instead of beside it — but everything on the plate is still real. The image
 * is a freely licensed Commons photograph; the numbers are the published
 * rolling average.
 *
 * Faint greys are for parchment. Over a photograph every muted tone has to
 * lift, which is why the source line and the percent signs carry their own
 * lightened colours rather than the shared ink tokens.
 */
export default function HeroRace() {
  const photo = getPhoto("downing-street");
  const lead = pollAverage[0].pct;

  return (
    <section
      id="polls"
      className="relative isolate flex min-h-[26rem] scroll-mt-20 overflow-hidden bg-ink text-[color:var(--paper)]"
    >
      {photo ? (
        <>
          <Image
            src={photo.file}
            alt="The door of 10 Downing Street"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 660px"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(103deg, rgba(8,16,30,0.94) 0%, rgba(8,16,30,0.86) 40%, rgba(8,16,30,0.62) 72%, rgba(8,16,30,0.44) 100%)",
            }}
          />
        </>
      ) : null}

      <div
        className="relative flex w-full flex-col justify-end px-5 py-6 sm:px-7 sm:py-7"
        style={{ textShadow: "0 1px 10px rgba(8,16,30,0.8)" }}
      >
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[color:var(--paper)]/72">
          Rolling average · {formatDate(POLL_AVERAGE_AS_OF)}
        </p>
        <h1 className="mt-1.5 font-display text-[2.75rem] leading-[0.94] tracking-tight sm:text-[3.5rem]">
          The Race
          <br />
          for No.10
        </h1>
        <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-[color:var(--paper)]/86">
          Labour, Reform UK and the Conservatives are separated by under five points. An average of
          published British Polling Council polls.
        </p>

        <ol className="mt-4 border-t border-white/20">
          {pollAverage.map((entry, index) => {
            const party = partyBySlug[entry.party];
            return (
              <li key={entry.party} className="border-b border-white/20">
                <Link
                  href={`/parties/${party.slug}`}
                  className="group flex items-center gap-3 py-2 transition-colors hover:bg-white/[0.07]"
                >
                  <span className="w-3.5 shrink-0 font-display text-base text-[color:var(--paper)]/50 tabular">
                    {index + 1}
                  </span>
                  <Portrait
                    slug={party.leader.slug}
                    name={party.leader.name}
                    size="sm"
                    accent={onDark(party.colour)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base leading-tight">
                      {party.shortName}
                    </p>
                    <p className="truncate text-[0.7rem] text-[color:var(--paper)]/60">
                      {party.leader.name}
                    </p>
                    <div className="mt-1 h-[3px] w-full bg-white/15">
                      <div
                        className="h-full"
                        style={{
                          width: `${(entry.pct / lead) * 100}%`,
                          backgroundColor: onDark(party.colour),
                        }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 font-display text-xl font-bold tabular">
                    {entry.pct.toFixed(1)}
                    <span className="text-xs text-[color:var(--paper)]/60">%</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <p className="mt-3 text-[0.66rem] text-[color:var(--paper)]/62">
          <a
            href={POLL_AVERAGE_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[color:var(--paper)]/35 underline-offset-4 transition-colors hover:text-[color:var(--paper)]"
          >
            Source: {POLL_AVERAGE_SOURCE.label}
          </a>
          {photo ? ` · Photograph: ${credit(photo)}` : ""}
        </p>
      </div>
    </section>
  );
}
