/**
 * Downloads the 650 Westminster constituencies from Parliament's own members
 * API, which is the authoritative list and already on post-2024 boundaries.
 *
 * Used by the signup form's constituency field, and the seed of any local
 * feature later: a name here maps to a real seat with a real MP.
 *
 * Run: node scripts/fetch-constituencies.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://members-api.parliament.uk/api/Location/Constituency/Search";
const OUT = path.join(process.cwd(), "data", "generated", "constituencies.json");
const PAGE = 20;

const names = new Map();
let skip = 0;
let total = Infinity;

while (skip < total) {
  const res = await fetch(`${API}?skip=${skip}&take=${PAGE}`, {
    headers: { Accept: "application/json", "User-Agent": "ukpoliticshub.com/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} at skip=${skip}`);

  const data = await res.json();
  total = data.totalResults ?? 0;

  for (const item of data.items ?? []) {
    const value = item.value ?? {};
    if (value.name) names.set(value.id, value.name);
  }

  skip += PAGE;
  process.stdout.write(`\r  ${names.size}/${total}`);
}

const sorted = [...names.values()].sort((a, b) => a.localeCompare(b, "en-GB"));

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(
  OUT,
  JSON.stringify(
    {
      fetchedAt: new Date().toISOString(),
      source: "UK Parliament Members API",
      sourceUrl: "https://members-api.parliament.uk/",
      count: sorted.length,
      constituencies: sorted,
    },
    null,
    2
  ) + "\n"
);

console.log(`\n  saved ${sorted.length} constituencies`);
if (sorted.length !== 650) {
  console.log(`  WARNING: expected 650, check whether boundaries have changed`);
}
