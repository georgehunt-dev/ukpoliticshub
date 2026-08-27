import type { NextRequest } from "next/server";
import constituencyData from "@/data/generated/constituencies.json";

/** Validated against the real list rather than trusted from the client. */
const CONSTITUENCIES = new Set<string>(constituencyData.constituencies);

/**
 * Newsletter signup.
 *
 * Provider-agnostic on purpose: the address goes straight to whichever mailing
 * provider is configured and is never stored here, so this site holds no list
 * of its own to leak. Configure with:
 *
 *   NEWSLETTER_PROVIDER = "buttondown" | "resend"
 *   NEWSLETTER_API_KEY  = the provider key
 *   NEWSLETTER_LIST_ID  = Resend audience id (Resend only)
 *
 * With nothing configured the endpoint returns 503 and the form says plainly
 * that signups are not open. That is deliberate: silently accepting an
 * address and dropping it would be worse than refusing it.
 */

export const dynamic = "force-dynamic";

/** Deliberately permissive: rejecting unusual but valid addresses is worse
 *  than passing a bad one to the provider, which validates properly. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Crude in-memory throttle. Resets on cold start, which is fine. It exists
 *  to blunt casual abuse, not to be a security control. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5_000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

/** Optional extras a subscriber may volunteer. Neither is required to sign up. */
export type SubscriberMeta = {
  /** Westminster constituency name, for local tailoring later. */
  constituency?: string;
  /**
   * Year of birth, not full date of birth.
   *
   * The reason to ask at all is that under-13s cannot consent to a service
   * like this on their own, and an age band is useful for knowing who reads
   * it. Neither of those needs the day and month, and under UK GDPR you are
   * expected to collect the minimum that serves the purpose, so a full date
   * of birth would be more exposure for no extra use.
   */
  birthYear?: number;
};

async function subscribe(
  email: string,
  meta: SubscriberMeta
): Promise<{ ok: boolean; error?: string }> {
  const provider = process.env.NEWSLETTER_PROVIDER;
  const key = process.env.NEWSLETTER_API_KEY;
  if (!provider || !key) return { ok: false, error: "not-configured" };

  if (provider === "buttondown") {
    // Host is api.buttondown.com: api.buttondown.email is the old domain and
    // fails. No tags: the tagging feature 403s on free plans, and a tag is not
    // worth losing a subscriber over.
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": "application/json",
        // Treat an existing subscriber as success rather than a collision.
        "X-Buttondown-Collision-Behavior": "add",
      },
      body: JSON.stringify({
        email_address: email,
        // Buttondown stores arbitrary metadata against a subscriber; only
        // send keys the reader actually filled in.
        ...(meta.constituency || meta.birthYear
          ? {
              metadata: {
                ...(meta.constituency ? { constituency: meta.constituency } : {}),
                ...(meta.birthYear ? { birth_year: String(meta.birthYear) } : {}),
              },
            }
          : {}),
      }),
    });

    // 201 created; 400 is a collision, i.e. already subscribed, which is not
    // something the reader needs to see as a failure.
    if (res.ok || res.status === 400) return { ok: true };

    // Surface the provider's own message in the server log so a
    // misconfiguration is diagnosable without guesswork.
    const detail = await res.text().catch(() => "");
    console.error(`[subscribe] buttondown ${res.status}: ${detail.slice(0, 300)}`);
    return { ok: false, error: `provider-${res.status}` };
  }

  if (provider === "resend") {
    const audience = process.env.NEWSLETTER_LIST_ID;
    if (!audience) return { ok: false, error: "not-configured" };
    const res = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    if (res.ok) return { ok: true };
    const detail = await res.text().catch(() => "");
    console.error(`[subscribe] resend ${res.status}: ${detail.slice(0, 300)}`);
    return { ok: false, error: `provider-${res.status}` };
  }

  return { ok: false, error: "unknown-provider" };
}

export async function POST(request: NextRequest) {
  let body: {
    email?: string;
    company?: string;
    startedAt?: number;
    constituency?: string;
    birthYear?: number | string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a field hidden from people but attractive to bots.
  if (body.company) return Response.json({ ok: true });

  // Anything submitted within a second of the form rendering is not a human.
  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < 1000) {
    return Response.json({ ok: true });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json(
      { ok: false, error: "That doesn't look like an email address." },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many attempts. Try again in a minute." },
      { status: 429 }
    );
  }

  // Only accept a constituency we actually recognise, so the field cannot be
  // used to push arbitrary text into the mailing provider.
  const constituency =
    typeof body.constituency === "string" && CONSTITUENCIES.has(body.constituency.trim())
      ? body.constituency.trim()
      : undefined;

  const year = Number(body.birthYear);
  const thisYear = new Date().getUTCFullYear();
  const birthYear =
    Number.isInteger(year) && year >= thisYear - 120 && year <= thisYear ? year : undefined;

  // Under-13s cannot consent to this on their own, so we decline rather than
  // collect and sort it out later.
  if (birthYear && thisYear - birthYear < 13) {
    return Response.json(
      {
        ok: false,
        error: "Sorry. You need to be at least 13 to sign up. Nothing was stored.",
      },
      { status: 400 }
    );
  }

  const result = await subscribe(email, { constituency, birthYear });

  if (!result.ok && result.error === "not-configured") {
    return Response.json(
      {
        ok: false,
        error:
          "Sign-ups aren't open yet, nothing was stored. Do come back.",
        notConfigured: true,
      },
      { status: 503 }
    );
  }

  if (!result.ok) {
    // 401/403 from the provider is a configuration problem, not a blip, and
    // saying "try again later" would send the reader round in circles.
    const authFailure = result.error === "provider-401" || result.error === "provider-403";
    return Response.json(
      {
        ok: false,
        error: authFailure
          ? "Sign-ups are misconfigured at our end. We've been alerted. Nothing was stored."
          : "Something went wrong at our end. Please try again later.",
      },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
