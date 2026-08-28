import Reveal from "@/components/Reveal";

/**
 * The four values, set as a single row of plated columns.
 *
 * The plates are the same device as the mastheads on the outlet pages, which
 * is the point: it reads as this site rather than as a features grid. Icons
 * are line drawings in the house weight, not an icon-set import, for the same
 * reason the party emblems are drawn rather than licensed.
 *
 * Four across only on a wide screen. At 2 columns the body text still has
 * room to breathe, and on a phone one column beats four squeezed ones.
 */

const ICON = {
  /* Scales. Balanced, with the beam's pivot picked out. */
  neutrality: (
    <>
      <path d="M24 9v30" />
      <path d="M8 16h32" />
      <path d="M8 16l-4 9h8z" />
      <path d="M40 16l-4 9h8z" />
      <path d="M16 39h16" />
      <circle cx="24" cy="12" r="2" fill="var(--oxblood)" stroke="none" />
    </>
  ),
  /* Many strands gathered into one. */
  palatability: (
    <>
      <path d="M5 11h13c6 0 6 13 12 13" />
      <path d="M5 19h10c5 0 5 5 10 5" />
      <path d="M5 37h13c6 0 6-13 12-13" />
      <path d="M5 29h10c5 0 5-5 10-5" />
      <path d="M30 24h13" />
      <circle cx="43" cy="24" r="2.4" fill="var(--oxblood)" stroke="none" />
    </>
  ),
  /* A prism splitting one line into three: the same event, read three ways. */
  knowledge: (
    <>
      <path d="M4 24h11" />
      <path d="M23 8L11 34h24z" />
      <path d="M35 18h9" />
      <path d="M35 24h9" stroke="var(--oxblood)" />
      <path d="M35 30h9" />
    </>
  ),
  /* A ballot box with the cross marked on it. */
  democracy: (
    <>
      <rect x="7" y="20" width="34" height="22" />
      <path d="M17 20v-6h14v6" />
      <path d="M18 26l12 10M30 26L18 36" stroke="var(--oxblood)" />
    </>
  ),
} as const;

const VALUES: { name: string; note: string; body: string; icon: keyof typeof ICON }[] = [
  {
    name: "Neutrality",
    note: "People first",
    body: "We will never, ever be financially affiliated with any UK political party.",
    icon: "neutrality",
  },
  {
    name: "Palatability",
    note: "Everything in one place",
    body: "We obsess over ensuring the British public have everything they need, all in one place.",
    icon: "palatability",
  },
  {
    name: "Knowledge",
    note: "Naming the bias",
    body: "Addressing the division from the left and the right, we wish to educate all on media bias.",
    icon: "knowledge",
  },
  {
    name: "Democracy",
    note: "The power of a vote",
    body: "We aspire to empower the British public to enact positive change via their vote.",
    icon: "democracy",
  },
];

export default function MissionValues() {
  return (
    <section className="mt-14">
      <p className="eyebrow">What we hold to</p>
      <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">Four values</h2>

      <Reveal>
        <ol className="mt-7 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7">
          {VALUES.map((value, index) => (
            <li
              key={value.name}
              className="reveal-item reveal-rule relative flex flex-col pt-3.5"
            >
              <span className="grid h-13 w-13 place-items-center border border-rule bg-[color:var(--paper-raised)] text-ink">
                <svg
                  viewBox="0 0 48 48"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  {ICON[value.icon]}
                </svg>
              </span>

              <span className="mt-3 text-[0.62rem] font-bold tracking-[0.16em] text-ink-faint tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-0.5 font-display text-[1.35rem] leading-none">{value.name}</h3>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-oxblood">
                {value.note}
              </p>
              <p className="mt-2.5 text-[0.83rem] leading-relaxed text-ink-soft">{value.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
