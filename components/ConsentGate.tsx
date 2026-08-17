"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Cookie consent, and the gate in front of Google Analytics.
 *
 * GA4 sets cookies, which under UK PECR are non-essential and therefore need
 * consent *before* they are set. So gtag is not loaded at all until someone
 * accepts — not loaded-then-disabled, genuinely not loaded. Declining means no
 * Google script is ever fetched and no Google cookie is ever written.
 *
 * Vercel Analytics runs regardless: it is cookieless and stores nothing on the
 * device, so it needs no consent and keeps baseline numbers honest even when
 * most visitors decline.
 *
 * The stored choice is read through useSyncExternalStore rather than an effect
 * that calls setState: localStorage is an external store, this is what the API
 * is for, and it keeps the server and client renders consistent.
 */

const STORAGE_KEY = "ukph-consent";
const CONSENT_EVENT = "ukph-consent-change";

type Consent = "granted" | "denied";

function subscribe(onChange: () => void) {
  // "storage" covers other tabs; the custom event covers this one.
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

function readConsent(): Consent | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Private browsing or storage disabled: treat as undecided.
    return null;
  }
}

/** On the server nobody has decided yet, so nothing renders. */
const serverConsent = (): Consent | null => null;

const noopSubscribe = () => () => {};

export default function ConsentGate({ gaId }: { gaId: string }) {
  const consent = useSyncExternalStore(subscribe, readConsent, serverConsent);

  // False during SSR and the first hydration pass, true afterwards. Stops the
  // banner flashing for someone who decided months ago.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  function decide(choice: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // If the choice cannot be stored we still honour it for this render.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <>
      {consent === "granted" ? <GoogleAnalytics gaId={gaId} /> : null}

      {hydrated && consent === null ? (
        <div
          role="dialog"
          aria-labelledby="consent-heading"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-rule bg-[color:var(--paper-raised)] shadow-[0_-8px_28px_-18px_rgba(15,31,56,0.5)]"
        >
          <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p id="consent-heading" className="font-display text-lg leading-tight">
                Analytics cookies
              </p>
              <p className="measure mt-1 text-[0.86rem] leading-relaxed text-ink-soft">
                We count visits either way using a cookieless tool that stores nothing on your
                device. May we also use Google Analytics, which sets a cookie? Declining changes
                nothing about what you can read.{" "}
                <Link href="/privacy" className="link-underline font-medium">
                  How we handle data
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="border border-rule px-4 py-2 font-body text-[0.78rem] font-bold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="border border-ink bg-ink px-4 py-2 font-body text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[color:var(--paper)] transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
