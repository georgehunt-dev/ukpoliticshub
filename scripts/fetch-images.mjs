/**
 * Downloads leader/frontbench headshots from Wikimedia Commons and records
 * the licence + author for each one, so every portrait on the site can be
 * attributed properly. Run: node scripts/fetch-images.mjs
 *
 * Output: public/img/people/<slug>.jpg  +  data/generated/portraits.json
 */
import fs from "node:fs/promises";
import path from "node:path";

const UA = "ukpolitics.hub/1.0 (image attribution fetcher; contact: hello@ukpolitics.hub)";
const OUT_DIR = path.join(process.cwd(), "public", "img", "people");
const DATA_DIR = path.join(process.cwd(), "data", "generated");

/** slug -> Wikipedia article title */
const PEOPLE = {
  // Leaders
  "andy-burnham": "Andy Burnham",
  "kemi-badenoch": "Kemi Badenoch",
  "nigel-farage": "Nigel Farage",
  "ed-davey": "Ed Davey",
  "zack-polanski": "Zack Polanski",
  "rupert-lowe": "Rupert Lowe",
  // Labour cabinet
  "john-healey": "John Healey",
  "shabana-mahmood": "Shabana Mahmood",
  "ed-miliband": "Ed Miliband",
  "wes-streeting": "Wes Streeting",
  "yvette-cooper": "Yvette Cooper",
  "alex-norris": "Alex Norris (British politician)",
  "lucy-powell": "Lucy Powell",
  "pat-mcfadden": "Pat McFadden",
  "jonathan-reynolds": "Jonathan Reynolds",
  "angela-rayner": "Angela Rayner",
  "heidi-alexander": "Heidi Alexander",
  "miatta-fahnbulleh": "Miatta Fahnbulleh",
  "lisa-nandy": "Lisa Nandy",
  "angela-eagle": "Angela Eagle",
  "chris-bryant": "Chris Bryant",
  "douglas-alexander": "Douglas Alexander",
  "stephen-kinnock": "Stephen Kinnock",
  "louise-haigh": "Louise Haigh",
  // Conservative shadow cabinet
  "mel-stride": "Mel Stride",
  "priti-patel": "Priti Patel",
  "chris-philp": "Chris Philp",
  "james-cartlidge": "James Cartlidge",
  "nick-timothy": "Nick Timothy",
  "stuart-andrew": "Stuart Andrew",
  "laura-trott": "Laura Trott (politician)",
  // Reform UK
  "richard-tice": "Richard Tice",
  "robert-jenrick": "Robert Jenrick",
  "suella-braverman": "Suella Braverman",
  "lee-anderson": "Lee Anderson",
  "zia-yusuf": "Zia Yusuf",
  // Liberal Democrats
  "daisy-cooper": "Daisy Cooper",
  "max-wilkinson": "Max Wilkinson",
  "calum-miller": "Calum Miller",
  "helen-morgan": "Helen Morgan (politician)",
  "munira-wilson": "Munira Wilson",
  "james-maccleary": "James MacCleary",
  // Green Party
  "rachel-millward": "Rachel Millward",
  "mothin-ali": "Mothin Ali",
  "sian-berry": "Siân Berry",
  "carla-denyer": "Carla Denyer",
  "adrian-ramsay": "Adrian Ramsay",
  "ellie-chowns": "Ellie Chowns",
  "hannah-spencer": "Hannah Spencer",
  // Restore Britain
  "charlie-downes": "Charlie Downes",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wikimedia rate-limits bursts with 429s, so back off and retry rather than giving up. */
async function get(url, accept) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, ...(accept ? { Accept: accept } : {}) } });
    if (r.ok) return r;
    if (r.status === 429 && attempt < 5) {
      const wait = Number(r.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt;
      await sleep(wait);
      continue;
    }
    throw new Error(`HTTP ${r.status} for ${url}`);
  }
}

async function j(url) {
  return (await get(url, "application/json")).json();
}

/** Strip the HTML Commons wraps author fields in, down to plain text. */
function plain(html) {
  if (!html) return null;
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim() || null;
}

async function fetchOne(slug, title) {
  // 1. Page summary gives us the lead image (the Wikipedia "main" headshot).
  const summary = await j(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`
  );
  // Prefer the thumbnail URL: it is a /thumb/ path whose width we can rewrite.
  // originalimage is the full-resolution master — often several megabytes, far
  // more than a 176px portrait plate needs.
  const src = summary?.thumbnail?.source || summary?.originalimage?.source;
  if (!src) throw new Error("no lead image on article");

  // 2. Ask the Commons API for the licence and author of that exact file.
  // Wikimedia appends utm_* tracking params to API-sourced URLs; strip them before
  // we use the filename as a Commons lookup key or the thumb size as a substitution.
  const bareSrc = src.split("?")[0];
  const fileName = decodeURIComponent(bareSrc.split("/").pop().replace(/^\d+px-/, ""));
  let licence = null;
  let author = null;
  let credit = null;
  let descriptionUrl = null;
  try {
    const info = await j(
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*` +
        `&titles=${encodeURIComponent("File:" + fileName)}` +
        `&prop=imageinfo&iiprop=extmetadata|url&iiextmetadatafilter=LicenseShortName|Artist|Credit`
    );
    const pages = info?.query?.pages || {};
    const page = Object.values(pages)[0];
    const meta = page?.imageinfo?.[0]?.extmetadata || {};
    licence = plain(meta.LicenseShortName?.value);
    author = plain(meta.Artist?.value);
    credit = plain(meta.Credit?.value);
    descriptionUrl = page?.imageinfo?.[0]?.descriptionurl || null;
  } catch {
    /* attribution lookup is best-effort; the download still proceeds */
  }

  // 3. Download a consistently sized portrait.
  const thumbUrl = bareSrc.includes("/thumb/")
    ? bareSrc.replace(/\/\d+px-[^/]+$/, "/640px-" + bareSrc.split("/").pop().replace(/^\d+px-/, ""))
    : bareSrc;
  const img = await fetch(thumbUrl, { headers: { "User-Agent": UA } });
  if (!img.ok) throw new Error(`image HTTP ${img.status}`);
  const buf = Buffer.from(await img.arrayBuffer());
  const ext = (thumbUrl.match(/\.(jpe?g|png)$/i)?.[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
  await fs.writeFile(path.join(OUT_DIR, `${slug}.${ext}`), buf);

  return {
    slug,
    title,
    file: `/img/people/${slug}.${ext}`,
    fileName,
    licence,
    author,
    credit,
    descriptionUrl,
    wikipedia: summary?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}

const results = {};
const failures = [];

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(DATA_DIR, { recursive: true });

for (const [slug, title] of Object.entries(PEOPLE)) {
  try {
    results[slug] = await fetchOne(slug, title);
    console.log(`  ok   ${slug.padEnd(22)} ${results[slug].licence ?? "licence unknown"}`);
  } catch (err) {
    failures.push({ slug, title, error: String(err.message || err) });
    console.log(`  MISS ${slug.padEnd(22)} ${err.message || err}`);
  }
  await new Promise((r) => setTimeout(r, 120)); // be polite to the API
}

await fs.writeFile(
  path.join(DATA_DIR, "portraits.json"),
  JSON.stringify({ fetchedAt: new Date().toISOString(), portraits: results, failures }, null, 2)
);

console.log(`\n${Object.keys(results).length} portraits saved, ${failures.length} missing.`);
if (failures.length) console.log(failures.map((f) => `  - ${f.slug} (${f.title}): ${f.error}`).join("\n"));
