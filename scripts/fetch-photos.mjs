/**
 * Downloads the site's photography from Wikimedia Commons at web resolution
 * and records licence + photographer for each, so every picture can be
 * credited at /colophon. Run: node scripts/fetch-photos.mjs
 *
 * Files were chosen by hand from the candidates listed by find-photos.mjs —
 * free licences only, no fair-use material.
 */
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
import path from "node:path";

const UA = "ukpolitics.hub/1.0 (photo fetcher; contact: hello@ukpolitics.hub)";
const OUT_DIR = path.join(process.cwd(), "public", "img", "photos");
const DATA_DIR = path.join(process.cwd(), "data", "generated");
const WIDTH = 2000;

/** slug -> { file on Commons, what it is used for, focal point for CSS } */
const PHOTOS = {
  "downing-street": {
    file: "10 Downing Street (geograph 5460596).jpg",
    use: "Front page hero — The Race for No.10",
    position: "50% 42%",
  },
  westminster: {
    file: "Palace of Westminster (Houses of Parliament) and Big Ben (Elizabeth Tower) (52002183721).jpg",
    use: "Elections section",
    position: "50% 50%",
  },
  "royal-navy": {
    file: "Royal Navy Type 23 frigate HMS Kent MOD 45151431.jpg",
    use: "Threat levels section",
    position: "50% 55%",
  },
  "buckingham-palace": {
    file: "Buckingham Palace from gardens, London, UK - Diliff.jpg",
    use: "The parties section",
    position: "50% 55%",
  },
  london: {
    file: "London Thames Sunset panorama - Feb 2008.jpg",
    use: "Footer band / wide strip",
    position: "50% 50%",
  },
  "polling-station": {
    file: "Polling station in Swansea - EU Election 2019 (1).jpg",
    use: "Polls page",
    position: "50% 18%",
  },
  "election-count": {
    file: "North East Somerset constituency 2019 general election count.jpg",
    use: "Elections page and the election countdown tile",
    // The sealed ballot boxes sit across the lower-middle band; cropping to
    // the centre keeps them and the counting tables, and drops dead ceiling.
    position: "50% 62%",
  },
  dover: {
    file: "South Foreland Lighthouse and cliffs from Strait of Dover 1.jpg",
    use: "News topic — immigration and asylum",
    position: "50% 45%",
  },
  economy: {
    file: "Bank of England & the City (49121788047).jpg",
    use: "News topic — economy and tax",
    position: "50% 35%",
  },
  health: {
    file: "St. Thomas' Hospital - London - NHS.jpg",
    use: "News topic — health and the NHS",
    position: "50% 40%",
  },
  energy: {
    file: "Barrow Offshore wind turbines NR.jpg",
    use: "News topic — energy and environment",
    position: "50% 50%",
  },
  justice: {
    file: "Royal Courts of Justice exterior - 01.jpg",
    use: "News topic — law and order",
    position: "50% 30%",
  },  england: {
    file: "Castle combe cotswolds.jpg",
    use: "Constituency pages — England",
    position: "50% 55%",
  },
  scotland: {
    file: "Near Torridon, Scotland (10500155186).jpg",
    use: "Constituency pages — Scotland",
    position: "50% 50%",
  },
  wales: {
    file: "Hay making in the Dyfi Valley near Mallwyd.jpg",
    use: "Constituency pages — Wales",
    position: "50% 55%",
  },
  "northern-ireland": {
    file: "County Antrim - Giant's Causeway 02.jpg",
    use: "Constituency pages — Northern Ireland",
    position: "50% 55%",
  },
  russia: {
    file: "Moscow Kremlin walls and the Spasskaya Tower (19340893964).jpg",
    use: "Threat assessment — Russia",
    position: "50% 55%",
  },
  iran: {
    file: "Azadi Tower, Tehran.jpg",
    use: "Threat assessment — Iran",
    position: "50% 50%",
  },
  china: {
    file: "Great Hall of the People (20200825114146).jpg",
    use: "Threat assessment — China",
    position: "50% 55%",
  },
  "united-states": {
    file: "Capitol Building Full View.jpg",
    use: "Alliance assessment — United States",
    position: "50% 55%",
  },
  nato: {
    file: "New HQ NATO 7.jpg",
    use: "Alliance assessment — NATO",
    position: "50% 50%",
  },
  "europe-eu": {
    file: "Berlaymont building 2022.jpg",
    use: "Alliance assessment — France & the EU",
    position: "50% 45%",
  },
  "press-generic": {
    file: "Cylindrical stereotype for Rotary printing press.jpg",
    use: "Fallback thumbnail where a feed carries no image",
    position: "50% 50%",
  },

};


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, accept) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, ...(accept ? { Accept: accept } : {}) } });
    if (r.ok) return r;
    if (r.status === 429 && attempt < 5) {
      await sleep(Number(r.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt);
      continue;
    }
    throw new Error(`HTTP ${r.status} for ${url}`);
  }
}

const plain = (h) =>
  h
    ? h
        .replace(/<[^>]*>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, " ")
        .trim()
    : null;

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(DATA_DIR, { recursive: true });

const results = {};

for (const [slug, spec] of Object.entries(PHOTOS)) {
  try {
    // iiurlwidth makes Commons render the thumbnail for us at exactly the size
    // we want, rather than downloading a 16-megapixel master.
    const api =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
      `&titles=${encodeURIComponent("File:" + spec.file)}` +
      `&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=${WIDTH}` +
      "&iiextmetadatafilter=LicenseShortName|LicenseUrl|Artist|ImageDescription";

    const data = await (await get(api, "application/json")).json();
    const page = Object.values(data?.query?.pages ?? {})[0];
    if (!page || page.missing !== undefined) throw new Error("file not found on Commons");

    const info = page.imageinfo?.[0];
    if (!info) throw new Error("no imageinfo");
    const meta = info.extmetadata ?? {};
    const licence = plain(meta.LicenseShortName?.value);
    if (!licence || /fair use|non-?free/i.test(licence)) {
      throw new Error(`refusing non-free licence: ${licence}`);
    }

    const src = (info.thumburl || info.url).split("?")[0];
    const ext = (src.match(/\.(jpe?g|png)$/i)?.[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
    const buf = Buffer.from(await (await get(src)).arrayBuffer());
    const outPath = path.join(OUT_DIR, `${slug}.${ext}`);
    await fs.writeFile(outPath, buf);

    // Downloads are full-resolution masters — several MB each. Re-running this
    // script used to silently undo any compression done afterwards, so the
    // resize happens here instead of being remembered as a manual step.
    await run("sips", ["-Z", "2000", "-s", "formatOptions", "68", outPath, "--out", outPath]).catch(() => {});

    results[slug] = {
      slug,
      file: `/img/photos/${slug}.${ext}`,
      use: spec.use,
      position: spec.position,
      commonsFile: spec.file,
      licence,
      licenceUrl: plain(meta.LicenseUrl?.value),
      author: plain(meta.Artist?.value),
      description: plain(meta.ImageDescription?.value)?.slice(0, 240) ?? null,
      descriptionUrl: info.descriptionurl ?? null,
      width: info.thumbwidth ?? info.width,
      height: info.thumbheight ?? info.height,
    };
    console.log(
      `  ok   ${slug.padEnd(18)} ${licence.padEnd(14)} ${(buf.length / 1024).toFixed(0)}KB  ${results[slug].author ?? ""}`
    );
  } catch (err) {
    console.log(`  MISS ${slug.padEnd(18)} ${err.message}`);
  }
  await sleep(300);
}

await fs.writeFile(
  path.join(DATA_DIR, "photos.json"),
  JSON.stringify({ fetchedAt: new Date().toISOString(), photos: results }, null, 2)
);

console.log(`\n${Object.keys(results).length}/${Object.keys(PHOTOS).length} photos saved.`);
