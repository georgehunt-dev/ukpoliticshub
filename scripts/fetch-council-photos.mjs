/**
 * A photograph for each council holding a by-election.
 * Run: node scripts/fetch-council-photos.mjs
 *
 * These are pictures of the council area, not of the ward being contested —
 * there is no free source of representative photographs of individual council
 * wards, and inventing one would be a small lie repeated on every page. The
 * caption on each page says which town it shows, so the picture is never
 * passed off as somewhere it is not.
 *
 * Files were chosen by eye from Commons search results. That review is the
 * point: an automated pick returned two photographs of Hong Kong for
 * Edinburgh, a red kite for Rhondda Cynon Taf, and churches in Buckinghamshire
 * and Merseyside for North East Derbyshire. Anything added here should be
 * looked at before it ships.
 */
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const UA = "ukpolitics.hub/1.0 (council photos; contact: hello@ukpolitics.hub)";
const OUT_DIR = path.join(process.cwd(), "public", "img", "councils");
const DATA = path.join(process.cwd(), "data", "generated", "council-photos.json");
const WIDTH = 1400;

/** council -> { file on Commons, the place it shows, focal point } */
const COUNCILS = {
  Barnsley: { file: "The Town Hall of Barnsley.JPG", shows: "Barnsley Town Hall", position: "50% 45%" },
  Bassetlaw: { file: "Worksop - former Council Offices - geograph.org.uk - 3287329.jpg", shows: "Worksop", position: "50% 45%" },
  "City of London": { file: "City of London skyline from London City Hall - Oct 2008.jpg", shows: "the City of London", position: "50% 50%" },
  Cumberland: { file: "Carlisle Cathedral - Cathedral Church of the Holy and Undivided Trinity - geograph.org.uk - 6618964.jpg", shows: "Carlisle Cathedral", position: "50% 45%" },
  Dover: { file: "Dover Town Centre and Dover Castle.jpg", shows: "Dover", position: "50% 50%" },
  Edinburgh: { file: "Edinburgh Castle 01.jpg", shows: "Edinburgh Castle", position: "50% 50%" },
  Huntingdonshire: { file: "Town Hall and war memorial in Huntingdon, Cambridgeshire - geograph.org.uk - 5174031.jpg", shows: "Huntingdon", position: "50% 45%" },
  Manchester: { file: "Manchester Town Hall October 2010.jpg", shows: "Manchester Town Hall", position: "50% 45%" },
  "Newcastle upon Tyne": { file: "Newcastle Quayside with bridges.jpg", shows: "Newcastle Quayside", position: "50% 50%" },
  "North East Derbyshire": { file: "Dronfield Parish Church (Geograph 2300937 by Dave Bevis).jpg", shows: "Dronfield", position: "50% 45%" },
  "North Somerset": { file: "Weston-super-Mare MMB 57.jpg", shows: "Weston-super-Mare", position: "50% 50%" },
  Nottingham: { file: "Nottingham MMB H9 Market Square.jpg", shows: "Nottingham's Old Market Square", position: "50% 50%" },
  Oxfordshire: { file: "Oxford High Street Facing West, Oxford, UK - Diliff.jpg", shows: "Oxford", position: "50% 50%" },
  "Rhondda Cynon Taf": { file: "Siedlungsstruktur im Rhondda Valley (Trehafod).jpg", shows: "the Rhondda valley at Trehafod", position: "50% 50%" },
  Sheffield: { file: "Sheffield Town Hall (27475677653).jpg", shows: "Sheffield Town Hall", position: "50% 45%" },
  Somerset: { file: "Somerset levels from glastonbury tor arp.jpg", shows: "the Somerset Levels", position: "50% 50%" },
  "South Lanarkshire": { file: "New Lanark buildings 2009.jpg", shows: "New Lanark", position: "50% 50%" },
  "St. Helens": { file: "St Helens Town Hall (2).JPG", shows: "St Helens Town Hall", position: "50% 45%" },
  Stroud: { file: "Stroud from the air.jpg", shows: "Stroud", position: "50% 50%" },
  Wandsworth: { file: "Looking downstream from Wandsworth Park - geograph.org.uk - 2195839.jpg", shows: "the Thames at Wandsworth Park", position: "50% 50%" },
  "West Suffolk": { file: "Abbey Gardens, Bury St Edmunds - geograph.org.uk - 4487111.jpg", shows: "the Abbey Gardens, Bury St Edmunds", position: "50% 50%" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (r.ok) return r;
    if (r.status === 429 && attempt < 5) {
      await sleep(Number(r.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt);
      continue;
    }
    throw new Error(`HTTP ${r.status} for ${url}`);
  }
}

const plain = (value) =>
  value ? value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || null : null;

/** council name -> "barnsley", used for the file on disk and the JSON key. */
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

await fs.mkdir(OUT_DIR, { recursive: true });
const results = {};

for (const [council, spec] of Object.entries(COUNCILS)) {
  const slug = slugify(council);
  try {
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.search = new URLSearchParams({
      action: "query",
      format: "json",
      titles: `File:${spec.file}`,
      prop: "imageinfo",
      iiprop: "url|size|extmetadata",
      iiurlwidth: String(WIDTH),
    });
    const body = await (await get(api)).json();
    const page = Object.values(body?.query?.pages ?? {})[0];
    const info = page?.imageinfo?.[0];
    if (!info) throw new Error("not found on Commons");

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
    await run("sips", ["-Z", String(WIDTH), "-s", "formatOptions", "68", outPath, "--out", outPath]).catch(
      () => {}
    );

    results[slug] = {
      council,
      slug,
      file: `/img/councils/${slug}.${ext}`,
      shows: spec.shows,
      position: spec.position,
      commonsFile: spec.file,
      licence,
      licenceUrl: plain(meta.LicenseUrl?.value),
      author: plain(meta.Artist?.value),
      descriptionUrl: info.descriptionurl ?? null,
      width: info.thumbwidth ?? info.width,
      height: info.thumbheight ?? info.height,
    };
    console.log(
      `  ok   ${slug.padEnd(22)} ${licence.padEnd(14)} ${(buf.length / 1024).toFixed(0)}KB  ${results[slug].author ?? ""}`
    );
  } catch (err) {
    console.log(`  MISS ${slug.padEnd(22)} ${err.message}`);
  }
  await sleep(350);
}

await fs.writeFile(
  DATA,
  JSON.stringify({ fetchedAt: new Date().toISOString(), councils: results }, null, 2)
);

console.log(`\n${Object.keys(results).length}/${Object.keys(COUNCILS).length} council photographs saved.`);
