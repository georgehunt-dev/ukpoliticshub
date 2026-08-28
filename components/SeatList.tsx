import Link from "next/link";
import type { Constituency } from "@/lib/constituencies";

/**
 * The two-column list of seats with their sitting MP, shared by the full A to Z
 * and the per-letter pages so the two cannot drift apart.
 */
export default function SeatList({ seats }: { seats: Constituency[] }) {
  return (
    <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
      {seats.map((seat) => (
        <li key={seat.slug} className="border-b border-rule/70">
          <Link
            href={`/constituencies/${seat.slug}`}
            className="flex items-baseline justify-between gap-3 py-2 transition-colors hover:bg-ink/[0.03]"
          >
            <span className="min-w-0 truncate text-[0.92rem]">{seat.name}</span>
            <span className="flex shrink-0 items-center gap-1.5 text-[0.72rem] text-ink-faint">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 border border-ink/20"
                style={{ background: seat.mp?.partyColour ?? "transparent" }}
              />
              {seat.mp?.party ?? "—"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
