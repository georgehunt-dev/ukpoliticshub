/**
 * Upcoming UK by-elections and who is standing in them.
 * Run: node scripts/fetch-byelections.mjs
 *
 * Source is Democracy Club's open election database, which is the only free
 * register of UK local by-elections and their candidates. Candidates are only
 * recorded here once Democracy Club has locked the ballot against the
 * council's published statement of persons nominated — before that the list is
 * provisional, and a provisional candidate list is exactly the kind of figure
 * this site does not print.
 *
 * Results are not fetched. There is no timely machine-readable source for
 * council by-election results, so the `result` field on each ballot is left
 * null for a human to fill in afterwards. A blank is honest; a scraped guess
 * is not.
 */
import fs from "node:fs/promises";
import path from "node:path";

const UA = "ukpolitics.hub/1.0 (by-election index; contact: hello@ukpolitics.hub)";
const ELECTIONS = "https://elections.democracyclub.org.uk/api/elections/";
const CANDIDATES = "https://candidates.democracyclub.org.uk/api/next/ballots";
const OUT = path.join(process.cwd(), "data", "generated", "byelections.json");

/** How far ahead to look. Beyond this, nominations are usually not closed. */
const HORIZON_DAYS = 60;

/** Democracy Club's party names to our own party pages. */
const PARTY_SLUGS = new Map([
  ["labour party", "labour"],
  ["labour and co-operative party", "labour"],
  ["conservative and unionist party", "conservative"],
  ["liberal democrats", "liberal-democrats"],
  ["green party", "green"],
  ["reform uk", "reform"],
  ["restore britain", "restore-britain"],
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Democracy Club rate-limits harder than the request count suggests, so this
 * waits generously rather than giving up: a partial candidate list would be
 * worse than a slow build.
 */
async function getJson(url, tries = 7) {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) {
        if (r.status === 404) return null;
        if ((r.status === 429 || r.status >= 500) && attempt < tries) {
          const wait = Number(r.headers.get("retry-after")) * 1000 || 5000 * (attempt + 1);
          console.log(`    ${r.status}, waiting ${Math.round(wait / 1000)}s`);
          await sleep(wait);
          continue;
        }
        throw new Error(`HTTP ${r.status} for ${url}`);
      }
      return await r.json();
    } catch (err) {
      if (attempt >= tries) throw err;
      await sleep(5000 * (attempt + 1));
    }
  }
}

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

/** "local.sheffield.southey.by.2026-08-27" -> "sheffield-southey-2026-08-27" */
function slugFor(ballotId) {
  return ballotId
    .replace(/^[a-z]+\./, "")
    .replace(/\.by\./, ".")
    .replace(/\./g, "-");
}

const today = new Date();
const horizon = new Date(today.getTime() + HORIZON_DAYS * 86_400_000);

console.log(`Looking for polls between ${isoDay(today)} and ${isoDay(horizon)}…`);

/**
 * `current=1` is the only date filter this API honours — the date-range
 * parameters are silently ignored and return the entire archive, so the
 * horizon is applied here instead.
 */
const listed = [];
let next = `${ELECTIONS}?current=1`;
while (next) {
  const page = await getJson(next);
  if (!page) break;
  listed.push(...(page.results ?? []));
  next = page.next;
  if (next) await sleep(300);
}
console.log(`  ${listed.length} current election record(s)`);

const from = isoDay(today);
const to = isoDay(horizon);
const ballots = listed.filter(
  (e) =>
    e.identifier_type === "ballot" &&
    !e.cancelled &&
    !e.deleted &&
    e.poll_open_date >= from &&
    e.poll_open_date <= to
);

console.log(`  ${ballots.length} ballot(s) in range`);

const polls = new Map();

for (const ballot of ballots) {
  const detail = await getJson(`${CANDIDATES}/${ballot.election_id}/`);
  // Paced deliberately: the candidates API rate-limits well below what a
  // tight loop would ask of it.
  await sleep(1400);

  // An unlocked ballot means nominations are not confirmed against the
  // council's own notice yet. We would rather show nothing than a list that
  // changes under a reader.
  if (!detail?.candidates_locked) {
    console.log(`  skip (not locked) ${ballot.election_id}`);
    continue;
  }

  const candidates = (detail.candidacies ?? [])
    .map((candidacy) => {
      const party = candidacy.party ?? {};
      const name = (party.name ?? "").trim();
      return {
        name: candidacy.person?.name ?? null,
        party: name || "Independent",
        /** Our own page for that party, where we have one. */
        partySlug: PARTY_SLUGS.get(name.toLowerCase()) ?? null,
      };
    })
    .filter((candidate) => candidate.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  const date = ballot.poll_open_date;
  const entry = polls.get(date) ?? { date, ballots: [] };
  entry.ballots.push({
    id: ballot.election_id,
    slug: slugFor(ballot.election_id),
    council: ballot.organisation?.common_name ?? null,
    ward: ballot.division?.name ?? null,
    seats: ballot.seats_contested ?? 1,
    candidates,
    /** Filled in by hand after the count. Null until then, never guessed. */
    result: null,
    source: {
      label: "Democracy Club — candidates and elections database",
      url: `https://whocanivotefor.co.uk/elections/${ballot.election_id}/`,
    },
  });
  polls.set(date, entry);
  console.log(`  ok ${ballot.election_id} — ${candidates.length} candidates`);
}

const days = [...polls.values()]
  .map((day) => ({ ...day, ballots: day.ballots.sort((a, b) => (a.council ?? "").localeCompare(b.council ?? "")) }))
  .sort((a, b) => a.date.localeCompare(b.date));

// Preserve any results already typed in, so re-running never wipes them.
let existing = {};
try {
  const previous = JSON.parse(await fs.readFile(OUT, "utf8"));
  for (const day of previous.days ?? []) {
    for (const ballot of day.ballots ?? []) {
      if (ballot.result) existing[ballot.id] = ballot.result;
    }
  }
} catch {
  /* First run. */
}
let restored = 0;
for (const day of days) {
  for (const ballot of day.ballots) {
    if (existing[ballot.id]) {
      ballot.result = existing[ballot.id];
      restored += 1;
    }
  }
}

await fs.writeFile(
  OUT,
  JSON.stringify({ fetchedAt: new Date().toISOString(), days }, null, 2)
);

const total = days.reduce((sum, day) => sum + day.ballots.length, 0);
const candidates = days.reduce(
  (sum, day) => sum + day.ballots.reduce((n, b) => n + b.candidates.length, 0),
  0
);
console.log(
  `\n${total} ballot(s) across ${days.length} polling day(s), ${candidates} candidates.` +
    (restored ? ` ${restored} existing result(s) preserved.` : "")
);
console.log(`Written to ${path.relative(process.cwd(), OUT)}`);
