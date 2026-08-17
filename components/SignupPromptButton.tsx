"use client";

import { openSignupPrompt } from "@/lib/signup-prompt";

/**
 * Opens the signup prompt in place, rather than sending the reader to the
 * front page to find a form. Where a constituency is given it arrives in the
 * form already filled in — they are standing on that seat's page — but stays
 * editable, because someone reading about a seat is not always living in it.
 */
export default function SignupPromptButton({
  constituency,
  reason,
  children,
}: {
  constituency?: string;
  reason?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => openSignupPrompt({ constituency, reason })}
      className="group inline-flex items-center gap-1.5 font-body text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-oxblood"
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </button>
  );
}
