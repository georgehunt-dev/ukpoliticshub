import Link from "next/link";
import { BRIEFING_DATE, briefingAgeInDays } from "@/data/briefing";
import { formatDate } from "@/components/ui";

/**
 * Says plainly how old the briefing is.
 *
 * The prose is hand-written and does not regenerate, so the honest thing is to
 * state the edition date rather than let a "Daily briefing" heading imply the
 * words were written this morning. On the day of publication this stays quiet;
 * from the next day on it tells the reader what they are looking at and points
 * them to the parts of the site that are genuinely live.
 */
export default function EditionNotice({ className = "" }: { className?: string }) {
  const age = briefingAgeInDays();
  if (age === 0) return null;

  return (
    <p
      className={`border-l-4 border-gold bg-[color:var(--paper-sunk)]/60 px-4 py-3 text-[0.86rem] leading-relaxed text-ink-soft ${className}`}
    >
      <strong className="font-semibold text-ink">
        Edition of {formatDate(BRIEFING_DATE)}
      </strong>{" "}
      — written {age === 1 ? "yesterday" : `${age} days ago`} and not since rewritten, so it
      describes the picture as it stood then. The{" "}
      <Link href="/news" className="link-underline font-medium">
        news
      </Link>{" "}
      and the figures across the site are live and refresh through the day.
    </p>
  );
}
