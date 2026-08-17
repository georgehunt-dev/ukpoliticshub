/**
 * Builds the per-constituency dataset behind /constituencies.
 *
 * For each of the 650 seats it collects the sitting MP and the full 2024
 * general election result — every candidate, their party and their votes,
 * plus electorate, turnout and majority — from Parliament's own API.
 *
 * The 2024 general election is fetched for every seat so that all 650 pages
 * compare like with like. Where a by-election has been held since, that result
 * is fetched as well and shown alongside: the API's `latest` endpoint returns
 * the by-election, and captioning it "2024" — as an earlier version of this
 * script allowed — would have put a false date on six pages.
 *
 * Nation is derived rather than fetched, because the API does not expose it:
 * a seat contested by Plaid Cymru is Welsh, by the SNP is Scottish, and by the
 * DUP/Sinn Féin/UUP/SDLP/Alliance is in Northern Ireland. Those parties do not
 * stand outside their nations, so the inference is safe; anything left is
 * England. It is used only to choose a photograph, so the cost of being wrong
 * is low and the check is easy — the counts are printed at the end.
 *
 * Run: node scripts/fetch-constituency-detail.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://members-api.parliament.uk/api";
const OUT = path.join(process.cwd(), "data", "generated", "constituency-detail.json");
const CONCURRENCY = 5;

const WELSH = new Set(["Plaid Cymru"]);
const SCOTTISH = new Set(["Scottish National Party"]);
const NI = new Set([
  "Democratic Unionist Party",
  "Sinn Féin",
  "Sinn Fein",
  "Ulster Unionist Party",
  "Social Democratic and Labour Party",
  "Alliance",
  "Alliance Party of Northern Ireland",
  "Traditional Unionist Voice",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, attempt = 0) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "ukpoliticshub.com/1.0" },
  });
  if (res.ok) return res.json();
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await sleep(1500 * 2 ** attempt);
    return get(url, attempt + 1);
  }
  throw new Error(`HTTP ${res.status} for ${url}`);
}

/** URL-safe, human-readable, and stable: this is the public route. */
export function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nationFrom(candidates) {
  const parties = new Set(candidates.map((c) => c.party));
  for (const p of parties) {
    if (WELSH.has(p)) return "Wales";
    if (SCOTTISH.has(p)) return "Scotland";
    if (NI.has(p)) return "Northern Ireland";
  }
  return "England";
}

/* ── 1. every constituency id ──────────────────────────────────────────── */
const seats = [];
let skip = 0;
let total = Infinity;
while (skip < total) {
  const page = await get(`${API}/Location/Constituency/Search?skip=${skip}&take=20`);
  total = page.totalResults ?? 0;
  for (const item of page.items ?? []) {
    const v = item.value ?? {};
    if (v.id && v.name) seats.push({ id: v.id, name: v.name });
  }
  skip += 20;
  process.stdout.write(`\r  listing ${seats.length}/${total}`);
}
console.log();

/* ── 2. detail + result for each ───────────────────────────────────────── */
const results = [];
let done = 0;

/** Shapes one raw API election result into what the site renders. */
function shape(result) {
  if (!result) return null;

  const candidates = (result.candidates ?? [])
    .map((c) => ({
      name: c.name,
      party: c.party?.name ?? "Unknown",
      // Parliament's own party colour, so our tables match the Commons.
      colour: c.party?.backgroundColour ? `#${c.party.backgroundColour}` : null,
      votes: c.votes ?? 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return {
    title: result.electionTitle ?? null,
    date: result.electionDate ? result.electionDate.slice(0, 10) : null,
    isGeneralElection: Boolean(result.isGeneralElection),
    electorate: result.electorate ?? null,
    turnout: result.turnout ?? null,
    // Parliament reports turnout as a count of votes cast, so the
    // percentage is derived rather than taken.
    turnoutPct:
      result.electorate && result.turnout
        ? Number(((result.turnout / result.electorate) * 100).toFixed(1))
        : null,
    majority: result.majority ?? null,
    majorityPct:
      totalVotes && result.majority
        ? Number(((result.majority / totalVotes) * 100).toFixed(1))
        : null,
    totalVotes,
    candidates,
  };
}

const is2024GE = (r) => r?.isGeneralElection && r?.date?.startsWith("2024");

async function loadOne(seat) {
  const [detail, latestRaw] = await Promise.all([
    get(`${API}/Location/Constituency/${seat.id}`).catch(() => null),
    get(`${API}/Location/Constituency/${seat.id}/ElectionResult/latest`).catch(() => null),
  ]);

  const member = detail?.value?.currentRepresentation?.member?.value ?? null;
  const latest = shape(latestRaw?.value ?? null);

  // For most seats the latest result IS the 2024 general election and one
  // request has done the job. Only where a by-election has intervened do we
  // go back for the general election result underneath it.
  let general = is2024GE(latest) ? latest : null;
  let byElection = null;

  if (latest && !general) {
    byElection = latest;
    const list = await get(`${API}/Location/Constituency/${seat.id}/ElectionResults`).catch(
      () => null
    );
    const entry = (list?.value ?? []).find(
      (e) => e.isGeneralElection && String(e.electionDate ?? "").startsWith("2024")
    );
    if (entry?.electionId) {
      // The list endpoint returns no candidates, so the full result has to be
      // fetched by its own id.
      const full = await get(
        `${API}/Location/Constituency/${seat.id}/ElectionResult/${entry.electionId}`
      ).catch(() => null);
      general = shape(full?.value ?? null);
    }
  }

  results.push({
    id: seat.id,
    name: seat.name,
    slug: toSlug(seat.name),
    nation: nationFrom(general?.candidates ?? byElection?.candidates ?? []),
    mp: member
      ? {
          name: member.nameDisplayAs,
          party: member.latestParty?.name ?? null,
          partyColour: member.latestParty?.backgroundColour
            ? `#${member.latestParty.backgroundColour}`
            : null,
          memberId: member.id ?? null,
        }
      : null,
    election: general,
    byElection,
  });

  done += 1;
  process.stdout.write(`\r  detail ${done}/${seats.length}`);
}

for (let i = 0; i < seats.length; i += CONCURRENCY) {
  await Promise.all(seats.slice(i, i + CONCURRENCY).map(loadOne));
  await sleep(120);
}
console.log();

results.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));

/* ── 3. sanity checks worth failing loudly on ──────────────────────────── */
const slugs = new Set(results.map((r) => r.slug));
if (slugs.size !== results.length) {
  throw new Error(`slug collision: ${results.length} seats but ${slugs.size} unique slugs`);
}

const byNation = results.reduce((acc, r) => {
  acc[r.nation] = (acc[r.nation] ?? 0) + 1;
  return acc;
}, {});

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(
  OUT,
  JSON.stringify(
    {
      fetchedAt: new Date().toISOString(),
      source: "UK Parliament Members API",
      sourceUrl: "https://members-api.parliament.uk/",
      count: results.length,
      constituencies: results,
    },
    null,
    2
  ) + "\n"
);

// Every stored `election` must be the 2024 general election, or the pages that
// say "2024" are lying.
const misdated = results.filter((r) => r.election && !is2024GE(r.election));
if (misdated.length) {
  throw new Error(
    `not the 2024 general election in ${misdated.length} seats, e.g. ${misdated[0].name}: ${misdated[0].election.title}`
  );
}

console.log(`  saved ${results.length} seats`);
console.log(`  nations: ${JSON.stringify(byNation)}`);
console.log(`  missing MP: ${results.filter((r) => !r.mp).length}`);
console.log(`  missing 2024 result: ${results.filter((r) => !r.election).length}`);
console.log(`  with a by-election since: ${results.filter((r) => r.byElection).length}`);
