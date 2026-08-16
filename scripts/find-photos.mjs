/**
 * Lists freely licensed Wikimedia Commons candidates for the site's
 * photography, so a human can pick before anything is downloaded.
 * Run: node scripts/find-photos.mjs
 */
const UA = "ukpolitics.hub/1.0 (photo sourcing; contact: hello@ukpolitics.hub)";

const QUERIES = {
  england: "Cotswolds village England landscape",
  "northern-ireland": "Giants Causeway County Antrim",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
    "&generator=search&gsrnamespace=6&gsrlimit=12" +
    `&gsrsearch=${encodeURIComponent(query)}` +
    "&prop=imageinfo&iiprop=url|extmetadata|size|mime" +
    "&iiextmetadatafilter=LicenseShortName|Artist|ImageDescription";

  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (r.ok) return r.json();
    if (r.status === 429 && attempt < 5) {
      await sleep(2000 * 2 ** attempt);
      continue;
    }
    throw new Error(`HTTP ${r.status}`);
  }
}

const plain = (h) =>
  h ? h.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim() : "";

for (const [slug, query] of Object.entries(QUERIES)) {
  console.log(`\n═══ ${slug}  ("${query}")`);
  try {
    const data = await search(query);
    const pages = Object.values(data?.query?.pages ?? {});
    const usable = pages
      .map((p) => {
        const info = p.imageinfo?.[0] ?? {};
        const meta = info.extmetadata ?? {};
        return {
          title: p.title.replace(/^File:/, ""),
          licence: plain(meta.LicenseShortName?.value),
          width: info.width ?? 0,
          height: info.height ?? 0,
          mime: info.mime ?? "",
        };
      })
      // Free licences only, landscape, and big enough for a full-bleed hero.
      .filter(
        (c) =>
          c.licence &&
          !/fair use|non-?free/i.test(c.licence) &&
          c.width >= 1600 &&
          c.width > c.height &&
          /jpe?g|png/i.test(c.mime)
      )
      .sort((a, b) => b.width - a.width)
      .slice(0, 6);

    if (!usable.length) console.log("   (no free landscape candidates ≥1600px)");
    usable.forEach((c) =>
      console.log(`   ${String(c.width).padStart(5)}px  ${c.licence.padEnd(14)} ${c.title}`)
    );
  } catch (err) {
    console.log(`   ERROR ${err.message}`);
  }
  await sleep(400);
}
