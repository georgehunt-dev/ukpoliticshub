import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Refresh endpoint.
 *
 * Called on a schedule (GitHub Actions, Vercel Cron, or any pinger) to keep the
 * live news current without waiting for a visitor to trigger regeneration.
 *
 * Two steps matter here, and the second is easy to miss: `revalidatePath` only
 * *invalidates* the cache. Next regenerates on the next request. A cron that
 * only invalidates leaves the first real visitor to pay for the rebuild and
 * possibly see the stale copy. So we invalidate, then immediately fetch each
 * path to warm it.
 */

export const dynamic = "force-dynamic";

/** Paths whose content changes when the feeds do. */
const PATHS = ["/", "/news"];

/** Constant-time compare, so the endpoint can't be probed byte by byte. */
function matches(provided: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorised(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const provided = bearer || request.nextUrl.searchParams.get("secret") || "";
  if (!provided) return false;

  // Two callers, two secrets: our own scheduler sends REVALIDATE_SECRET, while
  // Vercel Cron sends CRON_SECRET. Accept either so both work unchanged.
  return (
    matches(provided, process.env.REVALIDATE_SECRET) ||
    matches(provided, process.env.CRON_SECRET)
  );
}

async function refresh(request: NextRequest) {
  if (!authorised(request)) {
    return Response.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }

  const startedAt = Date.now();

  for (const path of PATHS) {
    revalidatePath(path);
  }

  // Warm each path so the cache is repopulated now rather than on the next
  // visit. Failures are reported, not thrown: a warm miss is not an outage.
  const origin = request.nextUrl.origin;
  const warmed = await Promise.all(
    PATHS.map(async (path) => {
      try {
        const response = await fetch(`${origin}${path}`, {
          headers: { "User-Agent": "ukpoliticshub-refresh/1.0" },
          cache: "no-store",
        });
        return { path, status: response.status };
      } catch (error) {
        return { path, status: 0, error: String((error as Error).message ?? error) };
      }
    })
  );

  return Response.json({
    ok: true,
    revalidated: PATHS,
    warmed,
    ms: Date.now() - startedAt,
    at: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return refresh(request);
}

/** POST is the form Vercel Cron and most schedulers use. */
export async function POST(request: NextRequest) {
  return refresh(request);
}
