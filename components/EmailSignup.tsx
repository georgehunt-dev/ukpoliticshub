import UnionRule from "@/components/UnionRule";

/**
 * Presentational only, by design: there is no submit handler and no endpoint,
 * so nothing is collected and nothing is stored. The field is disabled rather
 * than merely inert, and says so, so no one types an address believing they
 * have subscribed.
 */
export default function EmailSignup() {
  return (
    <section className="panel">
      <div className="grid items-center gap-6 px-5 py-7 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <UnionRule className="h-5 w-10 shrink-0" />
            <p className="eyebrow">The daily despatch</p>
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            One email. Both sides. Every morning.
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
            The polls, the threat picture and the day&rsquo;s stories from left and right — sourced,
            dated and short enough to read before your coffee goes cold.
          </p>
        </div>

        <div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              disabled
              placeholder="you@example.co.uk"
              className="min-w-0 flex-1 border border-rule bg-[color:var(--paper-sunk)]/50 px-3.5 py-2.5 font-body text-sm placeholder:text-ink-faint disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              className="shrink-0 border border-ink bg-ink px-5 py-2.5 font-body text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-faint">
            Not yet accepting sign-ups — this form is disabled and collects nothing. When it opens,
            it will be one email a day, no sharing of your address, and one-click unsubscribe.
          </p>
        </div>
      </div>
    </section>
  );
}
