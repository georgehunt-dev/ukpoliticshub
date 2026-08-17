import Link from "next/link";
import ConstituencySearch from "@/components/ConstituencySearch";
import { CONSTITUENCY_NAMES } from "@/lib/constituencies";

/**
 * The front page's one personal question.
 *
 * Everything above this point is the national picture; this is the turn to the
 * reader's own seat. It sits between the spectrum primer and the news because
 * that is the moment the page stops explaining British politics in general and
 * offers something about the reader in particular.
 */
export default function ConstituencyBand() {
  return (
    <section className="border-y border-rule bg-[color:var(--paper-sunk)]/60">
      <div className="shell grid gap-6 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
        <div>
          <p className="eyebrow">Your area</p>
          <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            Who represents you?
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
            All 650 seats: your MP, how they won, the full result with every candidate on the
            ballot, and how safely the seat is held. No postcode required — we don&rsquo;t ask
            for one.
          </p>
          <p className="mt-3 text-[0.82rem] text-ink-soft">
            Or{" "}
            <Link href="/constituencies/all" className="link-underline font-semibold">
              browse all 650
            </Link>{" "}
            if you would rather scroll than type.
          </p>
        </div>

        <div className="border border-rule bg-[color:var(--paper-raised)] p-5">
          <ConstituencySearch seats={CONSTITUENCY_NAMES} />
        </div>
      </div>
    </section>
  );
}
