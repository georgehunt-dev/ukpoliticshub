import Link from "next/link";
import { seatLetters } from "@/lib/constituencies";

/**
 * A to Z across the seat list.
 *
 * This is navigation for a reader scanning 650 names, and it is also the point
 * of the letter pages: the full list is one page carrying 650 outbound links,
 * which a crawler follows only partially, and it was the sole route to 637 of
 * the 650 seats. Twenty-four pages of about twenty-seven links each are cheap
 * to crawl and link to each other, so the seats behind them are reachable in
 * the same number of clicks from a page that is not a wall.
 *
 * X and Z are absent because no constituency begins with either. Showing them
 * greyed out would be tidier and would also be two dead ends.
 */
export default function SeatLetterNav({ current }: { current?: string }) {
  return (
    <nav aria-label="Constituencies by first letter" className="mt-5">
      <ul className="flex flex-wrap gap-1">
        {seatLetters().map(({ letter, count }) => {
          const active = current === letter;
          return (
            <li key={letter}>
              <Link
                href={`/constituencies/all/${letter.toLowerCase()}`}
                aria-current={active ? "page" : undefined}
                title={`${count} ${count === 1 ? "seat" : "seats"}`}
                /* Sized for a thumb first. At the desktop padding these come
                   out 33x25, which clears the 24px floor but is a mean target
                   on a phone, and this is a row of 24 of them. */
                className={`block min-w-9 border px-2.5 py-2.5 text-center font-display text-[0.95rem] leading-none transition-colors sm:min-w-0 sm:py-1.5 ${
                  active
                    ? "border-ink bg-ink text-[color:var(--paper)]"
                    : "border-rule hover:border-ink hover:bg-ink hover:text-[color:var(--paper)]"
                }`}
              >
                {letter}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
