/**
 * Downloads a few candidate images per subject into the scratchpad so they can
 * be looked at before any of them is committed to the site. Editorial fit
 * cannot be judged from a filename and a pixel count.
 *
 * Usage: node scripts/preview-candidates.mjs <outDir>
 */
import fs from "node:fs/promises";
import path from "node:path";

const UA = "ukpolitics.hub/1.0 (candidate review; contact: hello@ukpolitics.hub)";
const OUT = process.argv[2] || "/tmp/candidates";

const QUERIES = {
  "flag-westminster": "Union Flag Parliament Square Westminster",
  "royal-navy": "Royal Navy Type 23 frigate at sea",
  "scotland-yard": "New Scotland Yard sign London",
  "horse-guards": "Horse Guards Parade Whitehall London",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, accept) {
  for (let a = 0; ; a++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, ...(accept ? { Accept: accept } : {}) } });
    if (r.ok) return r;
    if (r.status === 429 && a < 5) {
      await sleep(2000 * 2 ** a);
      continue;
    }
    throw new Error(`HTTP ${r.status}`);
  }
}

const plain = (h) => (h ? h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "");

await fs.mkdir(OUT, { recursive: true });

for (const [slug, query] of Object.entries(QUERIES)) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
    "&generator=search&gsrnamespace=6&gsrlimit=10" +
    `&gsrsearch=${encodeURIComponent(query)}` +
    "&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1200" +
    "&iiextmetadatafilter=LicenseShortName|Artist";

  const data = await (await get(api, "application/json")).json();
  const cands = Object.values(data?.query?.pages ?? {})
    .map((p) => {
      const i = p.imageinfo?.[0] ?? {};
      const m = i.extmetadata ?? {};
      return {
        title: p.title.replace(/^File:/, ""),
        licence: plain(m.LicenseShortName?.value),
        author: plain(m.Artist?.value),
        thumb: i.thumburl,
        width: i.width ?? 0,
        height: i.height ?? 0,
        mime: i.mime ?? "",
      };
    })
    .filter(
      (c) =>
        c.thumb &&
        c.licence &&
        !/fair use|non-?free/i.test(c.licence) &&
        c.width >= 1600 &&
        c.width > c.height &&
        /jpe?g|png/i.test(c.mime)
    )
    .slice(0, 3);

  console.log(`\n═══ ${slug}`);
  for (const [n, c] of cands.entries()) {
    const file = path.join(OUT, `${slug}-${n + 1}.jpg`);
    const buf = Buffer.from(await (await get(c.thumb.split("?")[0])).arrayBuffer());
    await fs.writeFile(file, buf);
    console.log(`  ${n + 1}. ${c.licence.padEnd(14)} ${c.title}`);
    await sleep(250);
  }
}

console.log(`\nCandidates written to ${OUT}`);
