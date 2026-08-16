import Link from "next/link";
import { parties } from "@/data/parties";

/**
 * Orientation for readers with no background in British politics: the whole
 * spectrum on one line, in plain English, before any of the detail below.
 */
export default function StartHere() {
  const ordered = [...parties].sort((a, b) => a.spectrum - b.spectrum);

  return (
    <section aria-label="Start here" className="border-b border-rule bg-[color:var(--paper-sunk)]/45">
      <div className="shell py-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow">New to this?</p>
            <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
              The whole spectrum, left to right
            </h2>
          </div>
          <p className="max-w-xl text-[0.9rem] leading-relaxed text-ink-soft">
            Six parties matter in British politics right now. Broadly, the left favours more state
            spending and looser immigration rules; the right favours lower taxes and tighter ones.
            Tap any party to see what it actually says.
          </p>
        </div>

        <ol className="mt-5 grid gap-px bg-[color:var(--rule)] sm:grid-cols-3 lg:grid-cols-6">
          {ordered.map((party) => (
            <li key={party.slug} className="bg-[color:var(--paper-raised)]">
              <Link
                href={`/parties/${party.slug}`}
                className="group block h-full px-3.5 py-3 transition-colors hover:bg-[color:var(--paper-sunk)]/70"
                style={{ borderTop: `3px solid ${party.colour}` }}
              >
                <p className="font-display text-lg leading-tight group-hover:text-oxblood">
                  {party.shortName}
                </p>
                <p className="mt-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                  {spectrumWord(party.spectrum)}
                </p>
                <p className="mt-1.5 line-clamp-3 text-[0.78rem] leading-snug text-ink-soft">
                  {party.spectrumNote.split(".")[0]}.
                </p>
              </Link>
            </li>
          ))}
        </ol>

        <p className="measure mt-4 text-[0.82rem] text-ink-soft">
          Want the whole picture in one go?{" "}
          <Link href="/briefing" className="link-underline font-semibold">
            Read today&rsquo;s briefing
          </Link>{" "}
          — about five minutes, both sides of every argument.
        </p>
      </div>
    </section>
  );
}

/**
 * A position on the scale, not a verdict on the party.
 *
 * The top band deliberately reads "Furthest right" rather than "Far right":
 * the first describes where we have placed a party relative to the other five,
 * which is ours to say; the second is a contested classification. Where that
 * classification is relevant it appears on the party's own page, attributed to
 * the people making it and printed alongside the party's rejection of it.
 */
function spectrumWord(value: number): string {
  if (value <= -7) return "Left";
  if (value <= -3) return "Centre-left";
  if (value < 0) return "Centre";
  if (value < 4) return "Centre";
  if (value < 7) return "Centre-right";
  if (value < 9) return "Right";
  return "Furthest right";
}
