/**
 * Opening the signup prompt from anywhere on the site.
 *
 * The prompt itself lives once, in the layout. Pages that want to summon it —
 * the "tell me when local news lands" line on a constituency page, say — fire
 * this event rather than each keeping their own copy of the form.
 *
 * A window event rather than a shared module variable: the modal and the
 * caller can end up in different client bundles, and a module-scoped store
 * would then be two stores that never see each other.
 */

export const SIGNUP_PROMPT_EVENT = "ukph:open-signup";

export type SignupPromptDetail = {
  /**
   * An address the reader has already typed into a small inline form. The
   * prompt opens with it filled in and asks only for the two things the
   * inline form has no room for.
   */
  email?: string;
  /** Pre-fills the constituency field. The reader can still change it. */
  constituency?: string;
  /** Why the prompt appeared, shown above the form. */
  reason?: string;
};

export function openSignupPrompt(detail: SignupPromptDetail = {}) {
  window.dispatchEvent(new CustomEvent(SIGNUP_PROMPT_EVENT, { detail }));
}
