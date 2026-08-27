/**
 * Appends today's outlet-by-subject story counts to the history file.
 *
 * The point of the outlet pages is to say what a masthead actually chose to
 * write about, measured against the press as a whole. A single day cannot
 * support that: each feed carries about a dozen stories at a time, so "25% of
 * its output" is three stories, and tomorrow it might be one. Published as a
 * finding, that would be a real-looking number that cannot bear weight:
 * exactly the failure that made us drop the 2017 survey.
 *
 * So the counts are recorded daily and the pages report a rolling window. Like
 * the poll history, a day that nobody records is gone for good, which is why
 * this runs whether or not anyone remembers.
 *
 * Idempotent: running twice in a day replaces that day rather than doubling it.
 *
 * Reads the site's own TypeScript directly, so the matcher here and the
 * matcher on the pages can never drift apart. Run with tsx:
 *
 *   npx tsx scripts/record-outlet-coverage.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { getNews } from "../lib/news.ts";
import { outlets } from "../data/news.ts";
import { subjects } from "../data/subjects.ts";
import { normalise } from "../lib/ask-intent.ts";

const HISTORY = path.join(process.cwd(), "data", "generated", "outlet-history.json");

const hay = (item) => normalise(`${item.title} ${item.summary ?? ""}`);
const mentions = (haystack, terms) =>
  terms.some((term) => haystack.includes(` ${term} `) || haystack.includes(` ${term}s `));

const { items } = await getNews();
if (!items.length) {
  console.log("  no stories in the feeds, recording nothing rather than a row of zeroes");
  process.exit(0);
}

/* Count each outlet's stories, and how many touch each subject. */
const counts = {};
for (const outlet of outlets) counts[outlet.id] = { total: 0, subjects: {} };

for (const item of items) {
  const record = counts[item.outlet];
  if (!record) continue;
  record.total += 1;

  const haystack = hay(item);
  for (const subject of subjects) {
    const hit =
      mentions(haystack, subject.own) ||
      (subject.linked.length > 0 && mentions(haystack, subject.linked));
    if (hit) record.subjects[subject.slug] = (record.subjects[subject.slug] ?? 0) + 1;
  }
}

// Outlets whose feed failed today are omitted rather than recorded as zero:
// a dead feed is not the same as a paper that wrote nothing.
for (const id of Object.keys(counts)) if (!counts[id].total) delete counts[id];

const day = new Date().toISOString().slice(0, 10);

let history = { days: [] };
try {
  history = JSON.parse(await fs.readFile(HISTORY, "utf8"));
} catch {
  // First run.
}

history.days = history.days.filter((entry) => entry.date !== day);
history.days.push({ date: day, stories: items.length, outlets: counts });
history.days.sort((a, b) => a.date.localeCompare(b.date));

// Two years is far more than any window we report and keeps the file small.
history.days = history.days.slice(-730);
history.updatedAt = new Date().toISOString();

await fs.mkdir(path.dirname(HISTORY), { recursive: true });
await fs.writeFile(HISTORY, `${JSON.stringify(history, null, 1)}\n`);

console.log(`  recorded ${day}: ${items.length} stories across ${Object.keys(counts).length} outlets`);
console.log(`  history now spans ${history.days.length} day(s)`);
