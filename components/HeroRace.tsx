import Image from "next/image";
import Link from "next/link";
import Portrait from "@/components/Portrait";
import { formatDate } from "@/components/ui";
import { partyBySlug } from "@/data/parties";
import { POLL_AVERAGE_AS_OF, POLL_AVERAGE_SOURCE, pollAverage } from "@/data/polls";
import { credit, getPhoto } from "@/lib/photos";
import { onDark } from "@/lib/colour";

/**
 * The front page opens on the door of No.10 rather than on a masthead: the
 * photograph carries the headline, and the standings sit over it. Everything
 * on the plate is real — the image is a freely licensed Commons photograph,
 * the numbers are the published rolling average.
 */
export default function HeroRace() {
  const photo = getPhoto("downing-street");
  const lead = pollAverage[0].pct;

  return (
    <section id="polls" className="relative isolate scroll-mt-20 bg-ink text-[color:var(--paper)]">
      {photo ? (
        <>
          <Image
            src={photo.file}
            alt="The door of 10 Downing Street"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          {/* Two gradients: one to seat the type, one to keep the top edge readable. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,16,30,0.94) 0%, rgba(8,16,30,0.82) 32%, rgba(8,16,30,0.42) 62%, rgba(8,16,30,0.55) 100%)",
            }}
          />
        </>
      ) : null}

      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-14 lg:grid-cols-[1fr_minmax(360px,42%)] lg:items-end lg:gap-12 lg:pb-14 lg:pt-24">
        {/* Headline */}
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[color:var(--paper)]/70">
            Voting intention · rolling average
          </p>
          <h1 className="mt-3 font-display text-6xl leading-[0.92] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            The Race
            <br />
            for No.10
          </h1>
          <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-[color:var(--paper)]/85">
            Labour, Reform UK and the Conservatives are separated by under five points. An average of
            published British Polling Council polls, as of {formatDate(POLL_AVERAGE_AS_OF)}.
          </p>
          <a
            href={POLL_AVERAGE_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[0.78rem] text-[color:var(--paper)]/65 underline decoration-[color:var(--paper)]/35 underline-offset-4 transition-colors hover:text-[color:var(--paper)]"
          >
            Source: {POLL_AVERAGE_SOURCE.label}
          </a>
        </div>

        {/* Standings */}
        <ol className="divide-y divide-white/15 border-y border-white/25 backdrop-blur-[2px]">
          {pollAverage.map((entry, index) => {
            const party = partyBySlug[entry.party];
            return (
              <li key={entry.party}>
                <Link
                  href={`/parties/${party.slug}`}
                  className="group flex items-center gap-3.5 py-2.5 transition-colors hover:bg-white/[0.07]"
                >
                  <span className="w-4 shrink-0 font-display text-lg text-[color:var(--paper)]/50 tabular">
                    {index + 1}
                  </span>
                  <Portrait
                    slug={party.leader.slug}
                    name={party.leader.name}
                    size="sm"
                    accent={onDark(party.colour)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg leading-tight">{party.shortName}</p>
                    <p className="truncate text-[0.75rem] text-[color:var(--paper)]/60">
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
                  <span className="shrink-0 font-display text-2xl font-bold tabular">
                    {entry.pct.toFixed(1)}
                    <span className="text-sm text-[color:var(--paper)]/55">%</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {photo ? (
        <p className="relative mx-auto max-w-6xl px-5 pb-3 text-[0.65rem] text-[color:var(--paper)]/45">
          Photograph: {credit(photo)}
        </p>
      ) : null}
    </section>
  );
}
