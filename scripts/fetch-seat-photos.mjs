/**
 * A photograph of a named place inside each constituency.
 * Run: node scripts/fetch-seat-photos.mjs
 *
 * What this replaces: every seat page used to carry one of four photographs of
 * England, Scotland, Wales or Northern Ireland, captioned "photograph shows
 * England, not Basingstoke". Honest, but the same picture on 543 pages.
 *
 * A photograph of a named town in the seat, captioned as that town, is a
 * better answer to the same problem. It is still not a photograph of the
 * constituency (no such thing exists for most of them), so the caption always
 * names the place and says which seat it sits in.
 *
 * Three sources, in order of preference:
 *   1. The lead image of the settlement's own Wikipedia article. Curated by
 *      people who know the place, and free by Wikipedia's own rules.
 *   2. Failing that, a geotagged photograph within a few kilometres of the
 *      settlement. Geosearch makes a wrong-place error structurally impossible:
 *      a picture geotagged near Edinburgh cannot be of Hong Kong, which is
 *      what a plain keyword search returned when this was first attempted.
 *   3. Failing both, nothing. The page falls back to the nation photograph,
 *      which is what it does today.
 *
 * Anything landing here should still be looked at. Geosearch guarantees the
 * location, not that the photograph is worth showing: Geograph covers every
 * grid square in the country, car parks included.
 */
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const UA = "ukpolitics.hub/1.0 (seat photos; contact: hello@ukpolitics.hub)";
const WP = "https://en.wikipedia.org/w/api.php";
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const OUT_DIR = path.join(process.cwd(), "public", "img", "seats");
const DATA = path.join(process.cwd(), "data", "generated", "seat-photos.json");

const WIDTH = 1100;
/** JPEG quality. The band is short and sits under a dark wash. */
const QUALITY = 40;
/** Below this the picture is too small to carry a full-width band. */
const MIN_WIDTH = 1200;
/** Portrait images do not work in a band four times wider than it is tall. */
const MIN_RATIO = 1.2;
/** How far from the settlement a geotagged photograph may be taken. */
const GEO_RADIUS_M = 4000;

const FREE = /(cc[- ]?by|cc0|public domain|ogl|open government)/i;
/** Crests, maps and diagrams are not photographs of anywhere. */
const NOT_A_PHOTO =
  /coat of arms|\bcrest\b|\bflag\b|\.svg$|locator|location map|\bmap\b|logo|\bshield\b|diagram|chart/i;
/**
 * Things Geograph has plenty of that say nothing about a place. Geograph's
 * purpose is to cover every grid square, so left alone this route returns
 * doctors' surgeries, tyre depots and roundabouts: all genuinely in the
 * constituency and all worthless as its photograph.
 */
const DULL =
  /car park|\bsign\b|signpost|postbox|post box|milestone|bench\b|bus stop|footpath|public convenience|telephone box|manhole|fingerpost|name ?plate|geographer|surgery|\bgarage\b|roundabout|\bdepot\b|industrial|warehouse|\bworks\b|substation|pylon|allotment|level crossing|\bshed\b|scrap|recycling|\bunit \d|business park|retail park|petrol|filling station|\blibrary\b|\bclinic\b|health centre|\bcar\b|lorry|roadworks/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(url, tries = 4) {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) {
        if ((r.status === 429 || r.status >= 500) && attempt < tries) {
          await sleep(2500 * 2 ** attempt);
          continue;
        }
        throw new Error(`HTTP ${r.status}`);
      }
      return await r.json();
    } catch (err) {
      if (attempt >= tries) throw err;
      await sleep(2500 * 2 ** attempt);
    }
  }
}

const strip = (v) => (v ? v.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : null);

/** Great-circle distance in kilometres. */
function km(aLat, aLon, bLat, bLon) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** An article further than this from our own coordinates is a different place. */
const SAME_PLACE_KM = 20;

/**
 * Wikipedia's own lead image for the article about a place.
 *
 * The article has to sit where we think the place sits. Without that check,
 * "Cove" in the Aldershot seat resolved to an article about McWay Cove in
 * California and would have shipped a photograph of the Pacific coast as
 * Hampshire. Matching on name alone is never enough for British place names.
 */
async function leadImage(name, district, lat, lon) {
  for (const title of district ? [`${name}, ${district}`, name] : [name]) {
    const u = new URL(WP);
    u.search = new URLSearchParams({
      action: "query",
      format: "json",
      titles: title,
      prop: "pageimages|coordinates",
      piprop: "name",
      redirects: "1",
    });
    const page = Object.values((await json(u)).query?.pages ?? {})[0];
    await sleep(120);
    if (!page?.pageimage || NOT_A_PHOTO.test(page.pageimage)) continue;

    const coord = page.coordinates?.[0];
    if (lat == null || lon == null) continue;
    // No coordinates on the article means we cannot prove it is the same
    // place, so we do not use it.
    if (!coord) continue;
    if (km(lat, lon, coord.lat, coord.lon) > SAME_PLACE_KM) continue;

    return page.pageimage;
  }
  return null;
}

/** Full metadata for one file on Commons, or null if it fails our bar. */
async function usable(file) {
  const u = new URL(COMMONS);
  u.search = new URLSearchParams({
    action: "query",
    format: "json",
    titles: `File:${file}`,
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: String(WIDTH),
  });
  const page = Object.values((await json(u)).query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;

  const meta = info.extmetadata ?? {};
  const licence = strip(meta.LicenseShortName?.value);
  if (!licence || !FREE.test(licence)) return null;
  if (info.width < MIN_WIDTH) return null;
  if (info.width / info.height < MIN_RATIO) return null;

  return {
    commonsFile: file,
    licence,
    author: strip(meta.Artist?.value)?.slice(0, 70) ?? null,
    descriptionUrl: info.descriptionurl ?? null,
    src: (info.thumburl || info.url).split("?")[0],
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
  };
}

/** Photographs geotagged near a point, best first. */
async function nearby(lat, lon, placeName) {
  const u = new URL(COMMONS);
  u.search = new URLSearchParams({
    action: "query",
    format: "json",
    list: "geosearch",
    gscoord: `${lat}|${lon}`,
    gsradius: String(GEO_RADIUS_M),
    gsnamespace: "6",
    gslimit: "50",
  });
  const hits = (await json(u)).query?.geosearch ?? [];
  const needle = placeName.toLowerCase();

  return hits
    .map((hit) => hit.title.replace(/^File:/, ""))
    .filter((title) => !NOT_A_PHOTO.test(title) && !DULL.test(title))
    .sort((a, b) => {
      // A photograph whose own title names the place is likelier to be of it.
      const named = (t) => (t.toLowerCase().includes(needle) ? 0 : 1);
      return named(a) - named(b) || a.length - b.length;
    })
    .slice(0, 8);
}

const places = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "data", "generated", "places.json"), "utf8")
).places;
const seats = JSON.parse(
  await fs.readFile(path.join(process.cwd(), "data", "generated", "constituency-detail.json"), "utf8")
).constituencies;

const RANK = ["City", "Town", "Suburb", "Village", "Hamlet", "Settlement"];
const bySeat = new Map();
for (const place of places) {
  if (!bySeat.has(place.slug)) bySeat.set(place.slug, []);
  bySeat.get(place.slug).push(place);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z ]/g, " ");

/**
 * The settlements a photograph for this seat could show, best first.
 *
 * More than one, because the first choice often has no usable article image
 * and the second or third does. A photograph of the second town in the seat,
 * captioned as that town, beats a geotagged picture of a doctors' surgery in
 * the first.
 */
function candidates(seat) {
  const here = bySeat.get(seat.slug) ?? [];
  if (!here.length) return [];

  // A place named in the constituency itself is what a reader expects to see.
  const inName = here.filter((p) => {
    const n = norm(p.name).trim();
    return n.length > 2 && new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm(seat.name));
  });
  inName.sort((a, b) => b.name.length - a.name.length || RANK.indexOf(a.type) - RANK.indexOf(b.type));

  // Then the largest settlements we hold for it. Population comes from the
  // place's own Wikidata record, so it belongs to this place rather than to a
  // bigger namesake elsewhere in the country.
  const bySize = [...here].sort(
    (a, b) =>
      (b.population ?? 0) - (a.population ?? 0) ||
      RANK.indexOf(a.type) - RANK.indexOf(b.type) ||
      a.name.localeCompare(b.name)
  );

  const ordered = [];
  for (const place of [...inName, ...bySize]) {
    if (!ordered.some((p) => p.name === place.name)) ordered.push(place);
  }
  return ordered.slice(0, 5);
}

await fs.mkdir(OUT_DIR, { recursive: true });

const only = process.argv[2] ? Number(process.argv[2]) : null;
const targets = only ? seats.slice(0, only) : seats;
const results = {};
const tally = { lead: 0, nearby: 0, none: 0, noPlace: 0 };

for (const [index, seat] of targets.entries()) {
  const options = candidates(seat);
  if (!options.length) {
    tally.noPlace += 1;
    continue;
  }

  let chosen = null;
  let how = null;
  let place = options[0];

  try {
    // Every settlement's own article first: a curated lead image of the
    // second town beats a geotagged shed in the first.
    for (const option of options) {
      const lead = await leadImage(option.name, option.district, option.lat, option.lon);
      if (!lead) continue;
      const file = await usable(lead);
      if (file) {
        chosen = file;
        how = "wikipedia-lead";
        place = option;
        break;
      }
      await sleep(120);
    }

    // Only then fall back to whatever is geotagged near the first choice.
    if (!chosen) {
      place = options[0];
      if (place.lat != null && place.lon != null) {
        for (const candidate of await nearby(place.lat, place.lon, place.name)) {
          const file = await usable(candidate);
          if (file) {
            chosen = file;
            how = "nearby";
            break;
          }
          await sleep(120);
        }
      }
    }
  } catch (err) {
    console.log(`  ERR  ${seat.slug.padEnd(34)} ${err.message}`);
  }

  if (!chosen) {
    tally.none += 1;
    console.log(`  none ${seat.slug.padEnd(34)} (${place.name})`);
    await sleep(200);
    continue;
  }

  try {
    const buf = Buffer.from(await (await fetch(chosen.src, { headers: { "User-Agent": UA } })).arrayBuffer());
    const outPath = path.join(OUT_DIR, `${seat.slug}.jpg`);
    await fs.writeFile(outPath, buf);

    // `-s format jpeg` is load-bearing: without it sips ignores formatOptions
    // entirely and leaves PNG montages as multi-megabyte PNGs. Six hundred of
    // these at full quality came to 212MB, which is not something to put in a
    // git history. The band they fill is under 300px tall behind a dark wash,
    // so the detail is not missed.
    await run("sips", [
      "-s", "format", "jpeg",
      "-s", "formatOptions", String(QUALITY),
      "-Z", String(WIDTH),
      outPath,
      "--out", outPath,
    ]).catch(() => {});
    const ext = "jpg";

    results[seat.slug] = {
      seat: seat.name,
      slug: seat.slug,
      file: `/img/seats/${seat.slug}.${ext}`,
      shows: place.name,
      placeType: place.type,
      district: place.district,
      how,
      commonsFile: chosen.commonsFile,
      licence: chosen.licence,
      author: chosen.author,
      descriptionUrl: chosen.descriptionUrl,
      width: chosen.width,
      height: chosen.height,
    };
    tally[how === "wikipedia-lead" ? "lead" : "nearby"] += 1;
    if (index % 25 === 0) {
      console.log(`  ${String(index).padStart(3)}  ${seat.slug.padEnd(34)} ${place.name} (${how})`);
    }
  } catch (err) {
    tally.none += 1;
    console.log(`  SAVE ${seat.slug.padEnd(34)} ${err.message}`);
  }

  await sleep(220);
}

await fs.writeFile(DATA, JSON.stringify({ fetchedAt: new Date().toISOString(), seats: results }, null, 2));

console.log(
  `\n${Object.keys(results).length}/${targets.length} seats have a photograph.` +
    `\n  from a Wikipedia article : ${tally.lead}` +
    `\n  from a geotagged nearby  : ${tally.nearby}` +
    `\n  none found               : ${tally.none}` +
    `\n  no settlement on record  : ${tally.noPlace}`
);
