import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConstituencyResult from "@/components/ConstituencyResult";
import EmailCapture from "@/components/EmailCapture";
import SignupPromptButton from "@/components/SignupPromptButton";
import { MoreLink, OfficialFigure, SectionHeading } from "@/components/ui";
import {
  CONSTITUENCIES,
  CONSTITUENCY_SOURCE,
  electionLabel,
  type ElectionResult,
  getConstituency,
  nearbyByName,
  photoForNation,
  safetyOf,
} from "@/lib/constituencies";
import { credit, getPhoto } from "@/lib/photos";

export function generateStaticParams() {
  return CONSTITUENCIES.map((seat) => ({ slug: seat.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/constituencies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const seat = getConstituency(slug);
  if (!seat) return { title: "Constituency not found" };

  const mp = seat.mp ? `${seat.mp.name} (${seat.mp.party ?? "no party listed"})` : "the sitting MP";
  return {
    title: `${seat.name} constituency`,
    description: `${seat.name}: ${mp}, the full 2024 general election result, turnout and majority. Sourced from Parliament's own records.`,
    alternates: { canonical: `/constituencies/${seat.slug}` },
  };
}

const fmt = new Intl.NumberFormat("en-GB");

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-t-2 border-ink pt-2.5">
      <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-2xl leading-none sm:text-[1.75rem]">{value}</p>
      {note ? <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-soft">{note}</p> : null}
    </div>
  );
}

/** One election: the headline numbers, then every candidate. */
function Result({
  result,
  title,
  standfirst,
  footnote,
}: {
  result: ElectionResult;
  title: string;
  standfirst?: string;
  footnote?: React.ReactNode;
}) {
  const label = electionLabel(result);
  return (
    <section className="mt-10">
      <SectionHeading eyebrow={label} title={title} standfirst={standfirst} />

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Stat
          label="Majority"
          value={result.majority != null ? fmt.format(result.majority) : "—"}
          note={
            result.majorityPct != null
              ? `${result.majorityPct.toFixed(1)}% of votes cast.`
              : undefined
          }
        />
        <Stat
          label="Turnout"
          value={result.turnoutPct != null ? `${result.turnoutPct.toFixed(1)}%` : "—"}
          note={
            result.turnout != null && result.electorate != null
              ? `${fmt.format(result.turnout)} of ${fmt.format(result.electorate)} on the register.`
              : undefined
          }
        />
        <Stat
          label="Candidates"
          value={fmt.format(result.candidates.length)}
          note={`${fmt.format(result.totalVotes)} valid votes counted.`}
        />
      </div>

      <div className="mt-4">
        <OfficialFigure />
      </div>

      <div className="mt-6 overflow-x-auto">
        <ConstituencyResult candidates={result.candidates} label={label} />
      </div>

      {footnote ? (
        <p className="mt-4 text-[0.82rem] leading-relaxed text-ink-soft">{footnote}</p>
      ) : null}
    </section>
  );
}

export default async function ConstituencyPage({ params }: PageProps<"/constituencies/[slug]">) {
  const { slug } = await params;
  const seat = getConstituency(slug);
  if (!seat) notFound();

  const photo = getPhoto(photoForNation(seat.nation));
  const election = seat.election;
  const byElection = seat.byElection;
  const winner = election?.candidates[0];
  const runnerUp = election?.candidates[1];
  const safety = safetyOf(election?.majorityPct ?? null);
  const nearby = nearbyByName(seat.slug);

  return (
    <div>
      {/* A photograph of the nation, captioned as exactly that. No free source
          of 650 representative constituency photographs exists, and putting the
          wrong town on a seat page would be a small lie repeated 650 times. */}
      <div className="relative isolate flex h-56 items-end overflow-hidden bg-ink sm:h-72">
        {photo ? (
          <>
            <Image
              src={photo.file}
              alt={photo.description ?? `Landscape in ${seat.nation}.`}
              fill
              priority
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-cover"
              style={{
                objectPosition: photo.position,
                filter: "brightness(1.28) contrast(0.96) saturate(1.08)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(8,16,30,0.9) 0%, rgba(8,16,30,0.74) 34%, rgba(8,16,30,0.34) 60%, rgba(8,16,30,0.1) 100%)",
              }}
            />
          </>
        ) : null}

        <div
          className="relative w-full max-w-3xl px-5 py-5 text-[color:var(--paper)] sm:px-7 sm:py-6"
          style={{ textShadow: "0 1px 12px rgba(8,16,30,0.75)" }}
        >
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--paper)]/70">
            {seat.nation} · Constituency
          </p>
          <h1 className="mt-1.5 font-display text-3xl leading-none sm:text-5xl">{seat.name}</h1>
          {seat.mp ? (
            <p className="mt-2.5 text-[0.9rem] leading-relaxed text-[color:var(--paper)]/85">
              Represented by {seat.mp.name}
              {seat.mp.party ? ` (${seat.mp.party})` : ""}
            </p>
          ) : null}
        </div>

        {photo ? (
          <span
            className="absolute right-2 top-2 text-[0.6rem] text-[color:var(--paper)]/70"
            style={{ textShadow: "0 1px 4px rgba(8,16,30,0.9)" }}
          >
            {credit(photo)}
          </span>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7 sm:py-10">
        <p className="text-[0.75rem] leading-snug text-ink-faint">
          Photograph shows {seat.nation}, not {seat.name} — we don&rsquo;t hold pictures of
          individual seats.
        </p>

        {/* ── The MP ─────────────────────────────────────────────────────── */}
        {seat.mp ? (
          <section className="mt-6 border border-rule bg-[color:var(--paper-raised)] p-5 sm:p-6">
            <p className="eyebrow">Your member of parliament</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="font-display text-3xl leading-none">{seat.mp.name}</h2>
              {seat.mp.party ? (
                <span className="flex items-center gap-2 text-[0.9rem] text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 border border-ink/20"
                    style={{ background: seat.mp.partyColour ?? "transparent" }}
                  />
                  {seat.mp.party}
                </span>
              ) : null}
            </div>
            {seat.mp.memberId ? (
              <p className="mt-3">
                <a
                  href={`https://members.parliament.uk/member/${seat.mp.memberId}/contact`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-body text-[0.86rem] font-medium text-ink-soft"
                >
                  Contact them, and see their voting record, on Parliament&rsquo;s site
                </a>
              </p>
            ) : null}
          </section>
        ) : null}

        {/* ── The results ────────────────────────────────────────────────── */}
        {/* Where a by-election has been held it comes first: it is both the
            most recent verdict and how the sitting MP actually got there. */}
        {byElection ? (
          <Result
            result={byElection}
            title="The by-election"
            standfirst={`This seat has voted since the general election. ${
              seat.mp?.name ?? "The sitting member"
            } was returned at the ${electionLabel(byElection)}.`}
          />
        ) : null}

        {election ? (
          <Result
            result={election}
            title={byElection ? "And at the general election" : "How the seat voted"}
            standfirst={
              !byElection && winner && runnerUp
                ? `${winner.party} finished ahead of ${runnerUp.party} by ${fmt.format(
                    election.majority ?? 0
                  )} votes.`
                : undefined
            }
            footnote={
              <>
                <span className="font-semibold">{safety.label}.</span> {safety.note} That
                describes the {electionLabel(election)} result only — arithmetic on the published
                count, not a forecast.
              </>
            }
          />
        ) : (
          <p className="mt-10 text-[0.95rem] leading-relaxed text-ink-soft">
            We don&rsquo;t hold a published 2024 general election result for this seat.
          </p>
        )}

        {/* ── Local news, honestly labelled ──────────────────────────────── */}
        <section className="mt-10 border border-dashed border-rule p-5 sm:p-6">
          <p className="eyebrow">Coming soon</p>
          <h2 className="mt-1.5 font-display text-2xl leading-tight">
            Local news for {seat.name}
          </h2>
          <p className="mt-2 max-w-2xl text-[0.92rem] leading-relaxed text-ink-soft">
            We&rsquo;re working on pulling local reporting into each seat page, from across the
            spectrum and sourced the same way as everything else here. It isn&rsquo;t built yet,
            and we&rsquo;d rather say so than fill the space.
          </p>
          <p className="mt-3">
            <SignupPromptButton
              constituency={seat.name}
              reason={`Local news for ${seat.name}`}
            >
              Get told when it lands
            </SignupPromptButton>
          </p>
        </section>

        {/* ── Onward ─────────────────────────────────────────────────────── */}
        {nearby.length ? (
          <section className="mt-10 border-t border-rule pt-5">
            <p className="eyebrow">Nearby in the list</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {nearby.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/constituencies/${other.slug}`}
                    className="link-underline text-[0.9rem] text-ink-soft"
                  >
                    {other.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <MoreLink href="/constituencies">Look up another constituency</MoreLink>
            </p>
          </section>
        ) : null}

        <EmailCapture
          className="mt-10"
          heading={`The morning email, and ${seat.name} when it lands`}
          blurb="One email each morning on where Britain stands — and local news for your seat as soon as we build it."
          reason={`Local news for ${seat.name}`}
          constituency={seat.name}
        />

        <footer className="mt-10 border-t border-rule pt-4">
          <p className="eyebrow mb-2">Source</p>
          <p className="text-[0.86rem] leading-relaxed text-ink-soft">
            The sitting member and the full 2024 result come from the{" "}
            <a
              href={CONSTITUENCY_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium"
            >
              {CONSTITUENCY_SOURCE.label}
            </a>
            . Vote shares, turnout percentage and the margin are worked out from those published
            counts. Photograph:{" "}
            {photo ? (
              <a
                href={photo.descriptionUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-medium"
              >
                {credit(photo)}
              </a>
            ) : (
              "—"
            )}
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
