/**
 * Builds the place-name index: every UK settlement mapped to the 2024
 * Westminster seat it sits in. Run: node scripts/fetch-places.mjs
 *
 * Why this exists: nobody searches "North West Hampshire". They search
 * "Basingstoke". Without this index a seat page is only findable by a name
 * almost no one types.
 *
 * Two sources, both open:
 *   - Wikidata for the settlements themselves (name, type, coordinates).
 *     Chosen over OS Open Names because OS is Great Britain only, which would
 *     have left all eighteen Northern Ireland seats with no place names.
 *   - postcodes.io to turn each coordinate into a 2024 constituency.
 *
 * The hard part is that British place names repeat constantly — there are
 * eight Whitchurches, nine Hooks, ten Overtons. So the index is a name to
 * *many* seats, never name to one seat, and every entry carries its district
 * so the site can ask which one the reader meant.
 */
import fs from "node:fs/promises";
import path from "node:path";

const UA = "ukpolitics.hub/1.0 (place index; contact: hello@ukpolitics.hub)";
const WDQS = "https://query.wikidata.org/sparql";
const PIO = "https://api.postcodes.io/postcodes";
const OUT = path.join(process.cwd(), "data", "generated", "places.json");

/** Wikidata classes that are actually places people name, with our label. */
const TYPES = {
  Q515: "City",
  Q3957: "Town",
  // Without suburbs, twenty-one dense urban seats came back with no places at
  // all — inner Birmingham, Liverpool, Glasgow and London, where the names
  // people actually use are neighbourhoods rather than settlements.
  Q188509: "Suburb",
  Q532: "Village",
  Q5084: "Hamlet",
  Q486972: "Settlement",
};

/** Ranked so a place that is both a town and a settlement reads as a town. */
const RANK = ["City", "Town", "Suburb", "Village", "Hamlet", "Settlement"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Returns parsed JSON, not a Response. Wikidata drops the socket part-way
 * through a large result set, which surfaces during the body read rather than
 * during the fetch — so the read has to sit inside the retry too.
 */
async function getJson(url, init, tries = 5) {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url, { ...init, headers: { "User-Agent": UA, ...init?.headers } });
      if (!r.ok) {
        if ((r.status === 429 || r.status >= 500) && attempt < tries) {
          await sleep(3000 * 2 ** attempt);
          continue;
        }
        throw new Error(`HTTP ${r.status}`);
      }
      return await r.json();
    } catch (err) {
      if (attempt >= tries) throw err;
      console.log(`    retry (${err.message ?? err})`);
      await sleep(3000 * 2 ** attempt);
    }
  }
}

/**
 * Deliberately avoids the transitive `wdt:P131*` walk up the administrative
 * tree — it is correct but times the endpoint out on the larger classes. The
 * direct country property is enough, because the nation comes back from the
 * reverse geocode anyway.
 */
const PAGE = 5000;

async function settlements() {
  const found = new Map();

  for (const [qid, label] of Object.entries(TYPES)) {
    let offset = 0;
    let total = 0;

    // Paged: the village class alone is ~20k rows, and asking for it in one
    // response is what the endpoint keeps hanging up on. Ordered by item so
    // the pages do not overlap or skip.
    for (;;) {
      const query = `
        SELECT ?p ?name ?lat ?lon WHERE {
          ?p wdt:P31 wd:${qid} ; wdt:P17 wd:Q145 .
          ?p rdfs:label ?name . FILTER(lang(?name)="en")
          ?p p:P625/psv:P625 ?v .
          ?v wikibase:geoLatitude ?lat ; wikibase:geoLongitude ?lon .
        } ORDER BY ?p LIMIT ${PAGE} OFFSET ${offset}`;

      const body = await getJson(`${WDQS}?format=json&query=${encodeURIComponent(query)}`, {
        headers: { Accept: "application/sparql-results+json" },
      });
      const rows = body.results.bindings;

      for (const row of rows) {
        const name = row.name.value.trim();
        // Wikidata carries some administrative and disambiguation cruft.
        if (!name || /\(|\bdisambiguation\b|^[0-9]/i.test(name)) continue;
        const lat = Math.round(Number(row.lat.value) * 1000) / 1000;
        const lon = Math.round(Number(row.lon.value) * 1000) / 1000;
        const key = `${name}|${lat}|${lon}`;
        const existing = found.get(key);
        if (!existing || RANK.indexOf(label) < RANK.indexOf(existing.type)) {
          found.set(key, { name, lat, lon, type: label });
        }
      }

      total += rows.length;
      if (rows.length < PAGE) break;
      offset += PAGE;
      await sleep(1500);
    }

    console.log(`  ${label.padEnd(12)} ${String(total).padStart(6)}`);
    await sleep(1500);
  }
  return [...found.values()];
}

/** Bulk reverse geocode, 100 coordinates per request. */
async function locate(places) {
  const located = [];
  const BATCH = 100;

  for (let i = 0; i < places.length; i += BATCH) {
    const slice = places.slice(i, i + BATCH);
    const body = await getJson(PIO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        geolocations: slice.map((p) => ({
          longitude: p.lon,
          latitude: p.lat,
          // A settlement centroid can sit a little off the nearest postcode.
          // 2km is generous enough for a rural hamlet and still tight enough
          // that it cannot silently land in the wrong seat.
          radius: 2000,
          limit: 1,
        })),
      }),
    });
    const results = body.result ?? [];

    results.forEach((entry, index) => {
      const hit = entry.result?.[0];
      const place = slice[index];
      if (!hit) return;
      const seat = hit.parliamentary_constituency_2024;
      if (!seat) return;
      located.push({
        name: place.name,
        type: place.type,
        seat,
        district: hit.admin_district ?? null,
        country: hit.country ?? null,
      });
    });

    if ((i / BATCH) % 20 === 0) {
      console.log(`  located ${located.length} of ${i + slice.length} tried`);
    }
    await sleep(350);
  }
  return located;
}

/**
 * The network half of this script takes about a quarter of an hour. Caching it
 * means a failure in the reconciliation below — which is where the interesting
 * failures happen — costs seconds to retry rather than starting over. Delete
 * the file to force a genuine refresh.
 */
const CACHE = path.join(process.cwd(), "data", "generated", ".places-cache.json");
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000;

async function cachedLocations() {
  try {
    const cached = JSON.parse(await fs.readFile(CACHE, "utf8"));
    const age = Date.now() - new Date(cached.at).getTime();
    if (age < MAX_CACHE_AGE_MS && Array.isArray(cached.located) && cached.located.length) {
      console.log(
        `Reusing cached lookups from ${new Date(cached.at).toISOString()} ` +
          `(${cached.located.length} places). Delete ${path.basename(CACHE)} to refetch.\n`
      );
      return cached.located;
    }
  } catch {
    /* No usable cache — fall through and fetch. */
  }
  return null;
}

let located = await cachedLocations();

if (!located) {
  console.log("Fetching settlements from Wikidata…");
  const raw = await settlements();
  console.log(`  ${raw.length} unique settlements\n`);

  console.log("Mapping each to a 2024 constituency…");
  located = await locate(raw);
  await fs.writeFile(CACHE, JSON.stringify({ at: new Date().toISOString(), located }));
}

// Collapse duplicates: the same name inside the same seat is one entry, however
// many hamlets of that name Wikidata lists.
const byKey = new Map();
for (const p of located) {
  const key = `${p.name.toLowerCase()}|${p.seat}`;
  const existing = byKey.get(key);
  if (!existing || RANK.indexOf(p.type) < RANK.indexOf(existing.type)) byKey.set(key, p);
}
const places = [...byKey.values()].sort(
  (a, b) => a.name.localeCompare(b.name) || a.seat.localeCompare(b.seat)
);

// Reconcile against the seats we actually hold, so a boundary or naming drift
// surfaces here rather than as a dead link in production.
const detail = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "data", "generated", "constituency-detail.json"), "utf8")
);
/**
 * Fold diacritics before comparing. Parliament writes "Montgomeryshire and
 * Glyndŵr" with the circumflex; postcodes.io writes a plain w. Matching on the
 * raw strings drops a real Welsh seat.
 */
const fold = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const known = new Map(detail.constituencies.map((c) => [fold(c.name), c.slug]));
const unmatched = [...new Set(places.map((p) => p.seat).filter((s) => !known.has(fold(s))))];
if (unmatched.length) {
  throw new Error(
    `${unmatched.length} seat name(s) from postcodes.io are not in our data: ${unmatched
      .slice(0, 8)
      .join(", ")}`
  );
}

const withSlugs = places.map(({ seat, ...rest }) => ({ ...rest, slug: known.get(fold(seat)) }));

const ambiguous = new Map();
for (const p of withSlugs) {
  const key = p.name.toLowerCase();
  ambiguous.set(key, (ambiguous.get(key) ?? 0) + 1);
}
const repeated = [...ambiguous.values()].filter((n) => n > 1).length;
const seatsCovered = new Set(withSlugs.map((p) => p.slug)).size;

await fs.writeFile(
  OUT,
  JSON.stringify({ fetchedAt: new Date().toISOString(), places: withSlugs }, null, 0)
);

console.log(`\n${withSlugs.length} places across ${seatsCovered}/650 seats.`);
console.log(`${repeated} names occur in more than one seat.`);
console.log(`Written to ${path.relative(process.cwd(), OUT)}`);
