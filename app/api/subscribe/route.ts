import type { NextRequest } from "next/server";

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
 * that signups are not open. That is deliberate — silently accepting an
 * address and dropping it would be worse than refusing it.
 */

export const dynamic = "force-dynamic";

/** Deliberately permissive: rejecting unusual but valid addresses is worse
 *  than passing a bad one to the provider, which validates properly. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Crude in-memory throttle. Resets on cold start, which is fine — it exists
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

async function subscribe(email: string): Promise<{ ok: boolean; error?: string }> {
  const provider = process.env.NEWSLETTER_PROVIDER;
  const key = process.env.NEWSLETTER_API_KEY;
  if (!provider || !key) return { ok: false, error: "not-configured" };

  if (provider === "buttondown") {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, tags: ["ukpoliticshub"] }),
    });
    // 201 created; 400 usually means already subscribed, which is not an error
    // the reader needs to see.
    if (res.ok || res.status === 400) return { ok: true };
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
    return { ok: false, error: `provider-${res.status}` };
  }

  return { ok: false, error: "unknown-provider" };
}

export async function POST(request: NextRequest) {
  let body: { email?: string; company?: string; startedAt?: number };
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

  const result = await subscribe(email);

  if (!result.ok && result.error === "not-configured") {
    return Response.json(
      {
        ok: false,
        error:
          "Sign-ups aren't open yet — nothing was stored. Do come back.",
        notConfigured: true,
      },
      { status: 503 }
    );
  }

  if (!result.ok) {
    return Response.json(
      { ok: false, error: "Something went wrong at our end. Please try again later." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
