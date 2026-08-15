/**
 * Appends today's polling average to the history file.
 *
 * The site holds one snapshot of the rolling average. A snapshot cannot be
 * backfilled — if nobody records 15 August, that day is gone for good — so
 * this runs daily and builds the time series the charts will need.
 *
 * Idempotent: running it twice in a day overwrites that day's entry rather
 * than duplicating it, so a manual run or a retried workflow is harmless.
 *
 * Run: node scripts/record-polls.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data", "generated");
const HISTORY = path.join(DATA_DIR, "poll-history.json");

/**
 * Read the current average straight out of the TypeScript source rather than
 * duplicating it. Crude but deliberate: one source of truth, and the script
 * breaks loudly if the shape changes instead of silently recording nothing.
 */
async function readCurrentAverage() {
  const src = await fs.readFile(path.join(process.cwd(), "data", "polls.ts"), "utf8");

  const block = src.match(/export const pollAverage[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) throw new Error("could not find pollAverage in data/polls.ts");

  const entries = [...block[1].matchAll(/party:\s*"([^"]+)"\s*,\s*pct:\s*([\d.]+)/g)].map((m) => ({
    party: m[1],
    pct: Number(m[2]),
  }));
  if (!entries.length) throw new Error("pollAverage parsed but empty");

  const asOf = src.match(/export const POLL_AVERAGE_AS_OF\s*=\s*"([\d-]+)"/)?.[1] ?? null;
  const source = src.match(/label:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"/);

  return {
    entries,
    asOf,
    source: source ? { label: source[1], url: source[2] } : null,
  };
}

const { entries, asOf, source } = await readCurrentAverage();

await fs.mkdir(DATA_DIR, { recursive: true });

let history = { points: [] };
try {
  history = JSON.parse(await fs.readFile(HISTORY, "utf8"));
} catch {
  // First run: start a fresh series.
}

const today = new Date().toISOString().slice(0, 10);

const point = {
  /** The day we recorded it. */
  recordedOn: today,
  /** The date the pollster's average itself is stamped with, which may lag. */
  averageAsOf: asOf,
  shares: Object.fromEntries(entries.map((e) => [e.party, e.pct])),
  source,
};

const existing = history.points.findIndex((p) => p.recordedOn === today);
if (existing >= 0) {
  history.points[existing] = point;
} else {
  history.points.push(point);
}

history.points.sort((a, b) => a.recordedOn.localeCompare(b.recordedOn));
history.updatedAt = new Date().toISOString();

await fs.writeFile(HISTORY, JSON.stringify(history, null, 2) + "\n");

const changed = existing >= 0 ? "updated" : "added";
console.log(`  ${changed} ${today}: ${entries.map((e) => `${e.party} ${e.pct}`).join(", ")}`);
console.log(`  ${history.points.length} day(s) of history in data/generated/poll-history.json`);
