/**
 * Ask Google, for every URL in our sitemap, whether it is actually indexed.
 *
 * This is the honest version of an "auto-index script". Google's Indexing API
 * exists but its documentation restricts it to pages carrying JobPosting or
 * BroadcastEvent structured data, so the tools that offer instant indexing for
 * ordinary pages are using it outside its terms. This uses the URL Inspection
 * API instead, which is the same data the Inspect tool shows in the Search
 * Console UI: it reports, it does not push. What fixes indexing is the sitemap
 * being honest and the pages being reachable, both of which this measures.
 *
 * Quota is 2,000 URLs per day and 600 per minute, per property, on a rolling
 * window shared with anything else inspecting the same site. Our sitemap is
 * around 750, so a nightly full sweep sits well inside it.
 *
 * Credentials are read from the environment and never logged. Without them the
 * script exits 0 and writes nothing, so a workflow missing its secrets fails
 * quietly rather than committing an empty audit over a good one.
 *
 *   GSC_CLIENT_EMAIL   service account address
 *   GSC_PRIVATE_KEY    its private key, newlines escaped or literal
 *   GSC_SITE_URL       defaults to sc-domain:ukpoliticshub.com
 *
 * The service account must be a full Owner of the property. Search Console
 * distinguishes this from "Full user", and URL Inspection returns 403 for the
 * latter, which is the single most common reason this script fails.
 */

import { createSign } from "node:crypto";
import { writeFile } from "node:fs/promises";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const INSPECT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const SITEMAP = "https://ukpoliticshub.com/sitemap.xml";
const OUT = new URL("../data/generated/index-status.json", import.meta.url);

const SITE = process.env.GSC_SITE_URL ?? "sc-domain:ukpoliticshub.com";
/** Comfortably inside 600/min, and gentle on a shared quota. */
const PER_MINUTE = 300;
const DAILY_CAP = 1900;

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function accessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({ iss: clientEmail, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now })
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);

  let signature;
  try {
    signature = base64url(signer.sign(privateKey));
  } catch {
    // OpenSSL reports a malformed key as "DECODER routines::unsupported",
    // which tells you nothing. Mangling the key is the likeliest setup
    // mistake, so say what a good one looks like instead.
    throw new Error(
      "GSC_PRIVATE_KEY could not be read as a private key.\n" +
        "It must be the whole `private_key` field from the service account JSON, " +
        "starting -----BEGIN PRIVATE KEY----- and ending -----END PRIVATE KEY-----.\n" +
        "In a shell or in Vercel, keep the \\n escapes exactly as they appear in the JSON; " +
        "this script converts them back to real newlines."
    );
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Token exchange failed (${response.status}). Check GSC_CLIENT_EMAIL and that ` +
        `GSC_PRIVATE_KEY is the full key including its BEGIN and END lines.`
    );
  }
  const body = await response.json();
  if (!body.access_token) throw new Error("Token exchange returned no access token");
  return body.access_token;
}

async function sitemapUrls() {
  const response = await fetch(SITEMAP, { headers: { "User-Agent": "ukpoliticshub-index-audit" } });
  if (!response.ok) throw new Error(`Could not read the sitemap (${response.status})`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/**
 * One inspection. A 403 here almost always means the permission problem in the
 * header comment, so it is named rather than passed through as a status code.
 */
async function inspect(token, url) {
  const response = await fetch(INSPECT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE, languageCode: "en-GB" }),
  });

  if (response.status === 403) {
    throw new Error(
      `403 for ${SITE}. The service account needs to be an Owner of the property, not a ` +
        `Full user: Search Console, Settings, Users and permissions, Add user, Owner.`
    );
  }
  if (response.status === 429) return { retry: true };
  if (!response.ok) {
    const detail = await response.text();
    return { error: `${response.status}: ${detail.slice(0, 160)}` };
  }

  const result = (await response.json()).inspectionResult ?? {};
  const index = result.indexStatusResult ?? {};
  return {
    verdict: index.verdict ?? null,
    coverageState: index.coverageState ?? null,
    robotsTxtState: index.robotsTxtState ?? null,
    indexingState: index.indexingState ?? null,
    pageFetchState: index.pageFetchState ?? null,
    lastCrawlTime: index.lastCrawlTime ?? null,
    googleCanonical: index.googleCanonical ?? null,
    userCanonical: index.userCanonical ?? null,
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    console.log(
      "GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY are not set, so there is nothing to ask Google.\n" +
        "Nothing written. See the header of this file for what the service account needs."
    );
    return;
  }

  const urls = await sitemapUrls();
  console.log(`${urls.length} URLs in the sitemap.`);

  const budget = urls.slice(0, DAILY_CAP);
  if (budget.length < urls.length) {
    console.log(`Capped at ${DAILY_CAP} for today's quota; ${urls.length - budget.length} not checked.`);
  }

  const token = await accessToken(clientEmail, privateKey);
  const gap = Math.ceil(60_000 / PER_MINUTE);
  const records = [];

  for (const [i, url] of budget.entries()) {
    let row = await inspect(token, url);
    if (row.retry) {
      // Quota pushback: wait out the minute once, then move on rather than
      // hammering a limit that is shared with anything else on the property.
      await sleep(60_000);
      row = await inspect(token, url);
    }
    records.push({ url, ...row });

    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${budget.length}`);
    await sleep(gap);
  }

  const byState = {};
  for (const record of records) {
    const key = record.coverageState ?? record.error ?? "unknown";
    byState[key] = (byState[key] ?? 0) + 1;
  }

  const indexed = records.filter((r) => r.verdict === "PASS").length;
  const payload = {
    checkedAt: new Date().toISOString(),
    siteUrl: SITE,
    checked: records.length,
    inSitemap: urls.length,
    indexed,
    notIndexed: records.length - indexed,
    byState: Object.fromEntries(Object.entries(byState).sort((a, b) => b[1] - a[1])),
    urls: records.sort((a, b) => a.url.localeCompare(b.url)),
  };

  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`\nIndexed ${indexed} of ${records.length}.`);
  for (const [state, count] of Object.entries(payload.byState)) {
    console.log(`  ${String(count).padStart(4)}  ${state}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
