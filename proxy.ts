import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gate for the staging site.
 *
 * Runs only when STAGING_USER and STAGING_PASSWORD are both set, which they
 * are on the staging deployment and are not in production. That means this
 * file is inert on ukpoliticshub.com — no auth prompt, no behaviour change —
 * so it can live on main without risk when staging is merged down.
 *
 * `middleware.ts` is deprecated in Next.js 16; this is the `proxy.ts`
 * convention that replaced it.
 *
 * Basic auth is the right weight here. It keeps the site out of search
 * results and away from anyone who has not been given the password; it is not
 * protecting secrets, because everything on staging is destined to be
 * published anyway. Pair it with the noindex headers below, which matter more
 * — a staging copy indexed by Google would compete with the real site for its
 * own search results.
 */

const REALM = 'Basic realm="ukpoliticshub staging", charset="UTF-8"';

function unauthorised() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/** Constant-time-ish compare, so the password is not guessable by timing. */
function matches(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const user = process.env.STAGING_USER;
  const password = process.env.STAGING_PASSWORD;

  // Production: both unset, so nothing here applies.
  if (!user || !password) return NextResponse.next();

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      return unauthorised();
    }
    // Split on the first colon only: passwords may contain colons.
    const separator = decoded.indexOf(":");
    if (separator > 0) {
      const given = decoded.slice(0, separator);
      const secret = decoded.slice(separator + 1);
      if (matches(given, user) && matches(secret, password)) {
        const response = NextResponse.next();
        // Belt and braces: even signed-in, staging must never be indexed.
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
      }
    }
  }

  return unauthorised();
}

export const config = {
  // Everything except Next's own assets — without this the gate would also
  // challenge CSS and images, and the page would render unstyled behind the
  // prompt. The favicon is excluded so the tab icon still loads.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
