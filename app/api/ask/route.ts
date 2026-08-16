import { COVERAGE_THRESHOLD, search } from "@/lib/ask";

/**
 * The ask bar's endpoint.
 *
 * Three rules, agreed before a line of this was written and enforced here
 * rather than left to a prompt:
 *
 *   1. Answers are assembled only from passages this site already publishes.
 *   2. Every answer carries the links the passages came from.
 *   3. Where nothing clears the coverage threshold we say we do not cover it,
 *      and return no answer at all.
 *
 * There is no model call in this path. That is deliberate: retrieval over our
 * own sourced pages cannot invent a figure, which is the one failure this site
 * cannot absorb. If a phrasing layer is added later it must sit on top of these
 * passages and must not be able to introduce a claim that is not in them.
 */

export const runtime = "nodejs";

const MAX_LENGTH = 300;

/** Crude per-instance throttle. Enough to stop a script, not a CDN-level defence. */
const RATE = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function throttled(ip: string): boolean {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let question = "";
  try {
    const body = await request.json();
    question = typeof body?.question === "string" ? body.question.trim() : "";
  } catch {
    return Response.json({ ok: false, error: "Could not read that question." }, { status: 400 });
  }

  if (!question) {
    return Response.json({ ok: false, error: "Type a question first." }, { status: 400 });
  }
  if (question.length > MAX_LENGTH) {
    return Response.json(
      { ok: false, error: `Keep it under ${MAX_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (throttled(ip)) {
    return Response.json(
      { ok: false, error: "That's a lot of questions at once. Try again in a minute." },
      { status: 429 }
    );
  }

  const matches = search(question, 3);
  const best = matches[0];

  if (!best || best.score < COVERAGE_THRESHOLD) {
    return Response.json({
      ok: true,
      covered: false,
      answer:
        "We don't cover that yet. This bar only answers from pages we've already researched and sourced, so rather than guess at it we'd sooner say nothing — try asking about a party's position, a figure we track, or your own constituency.",
      sources: [],
    });
  }

  // Only passages close to the best one, so a weak third match cannot smuggle
  // in an unrelated claim beside a strong first.
  const kept = matches.filter((match) => match.score >= best.score * 0.6);

  return Response.json({
    ok: true,
    covered: true,
    answer: kept.map((match) => match.passage.text).join(" "),
    sources: kept.map((match) => ({ label: match.passage.label, href: match.passage.href })),
  });
}
