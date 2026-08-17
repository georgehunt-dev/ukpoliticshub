import Link from "next/link";
import PartyEmblem from "@/components/PartyEmblem";
import Portrait from "@/components/Portrait";
import { bandColour, onDark } from "@/lib/colour";
import type { Party } from "@/lib/types";

/**
 * The top of a party page: leader and party name together on a band in the
 * party's own colour, with the numbers a reader wants immediately.
 *
 * The band is a heavily inked tint rather than the raw brand colour — see
 * bandColour — so all six read consistently instead of Liberal Democrat amber
 * glaring and Restore Britain navy disappearing.
 */
export default function PartyHeader({
  party,
  polling,
}: {
  party: Party;
  polling?: number;
}) {
  const band = bandColour(party.colour);
  const accent = onDark(party.colour);

  const facts = [
    { label: "Leader", value: party.leader.name },
    { label: "MPs", value: String(party.mps).replace(/ at the.*$/, "") },
    { label: "Founded", value: party.founded.replace(/\s*\(.*\)/, "") },
    { label: "Members", value: party.membership ?? "Not published" },
  ];

  return (
    <header className="relative isolate text-[color:var(--paper)]" style={{ backgroundColor: band }}>
      {/* The true brand colour, used as a rule rather than a field */}
      <div className="h-1.5 w-full" style={{ backgroundColor: party.colour }} />

      <div className="shell py-9 sm:py-11">
        <Link
          href="/parties"
          className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--paper)]/60 transition-colors hover:text-[color:var(--paper)]"
        >
          ← All parties
        </Link>

        <div className="mt-6 flex flex-col gap-7 sm:flex-row sm:items-end">
          {/* Leader */}
          <div className="flex shrink-0 items-end gap-4">
            <Portrait
              slug={party.leader.slug}
              name={party.leader.name}
              size="xl"
              accent={accent}
            />
            <div className="pb-1 sm:hidden">
              <p className="font-display text-2xl leading-tight">{party.leader.name}</p>
              <p className="text-[0.8rem] text-[color:var(--paper)]/65">{party.leader.role}</p>
            </div>
          </div>

          {/* Party */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <PartyEmblem slug={party.slug} colour={accent} size={30} className="shrink-0" />
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[color:var(--paper)]/65">
                {party.ideology[0]}
              </p>
            </div>

            <h1 className="mt-2.5 font-display text-4xl leading-[0.98] sm:text-6xl">{party.name}</h1>

            <p className="mt-3 hidden text-[1.05rem] sm:block">
              Led by{" "}
              <strong className="font-semibold">{party.leader.name}</strong>
              <span className="text-[color:var(--paper)]/65">
                {party.leader.seat ? ` · ${party.leader.seat}` : ""}
              </span>
            </p>
          </div>

          {/* Polling */}
          {polling != null ? (
            <div className="shrink-0 self-start border border-white/25 px-5 py-4 text-center sm:self-end">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[color:var(--paper)]/60">
                Polling average
              </p>
              <p
                className="mt-1 font-display text-5xl font-bold leading-none tabular"
                style={{ color: accent }}
              >
                {polling.toFixed(1)}%
              </p>
            </div>
          ) : null}
        </div>

        {/* Summary */}
        <p className="mt-7 max-w-4xl text-[1rem] leading-relaxed text-[color:var(--paper)]/85">
          {party.summary}
        </p>

        {/* Facts */}
        <dl className="mt-7 grid gap-px border-t border-white/20 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-white/10 py-3 pr-6">
              <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[color:var(--paper)]/55">
                {fact.label}
              </dt>
              <dd className="mt-1 text-[0.92rem] font-semibold leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
