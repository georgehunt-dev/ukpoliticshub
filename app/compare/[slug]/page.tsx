import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import CompareControls from "@/components/CompareControls";
import { IssueComparison, PairComparison } from "@/components/CompareViews";
import { MoreLink } from "@/components/ui";
import { POLICY_AREAS } from "@/data/policy-areas";
import { allCompareSlugs, allPairs, coverageFor, resolveCompare } from "@/lib/compare";

export function generateStaticParams() {
  return allCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const view = resolveCompare(slug);
  if (!view) return {};

  if (view.kind === "issue") {
    const { stated, total } = coverageFor(view.area.id);
    return {
      title: `${view.area.name}: where every party stands`,
      description: `What all six major UK parties say on ${view.area.name.toLowerCase()}, side by side and sourced. ${stated} of ${total} have a published position.`,
    };
  }

  return {
    title: `${view.left.shortName} vs ${view.right.shortName}: policy comparison`,
    description: `${view.left.name} and ${view.right.name} compared across ten policy areas, in their own stated terms, with sources.`,
  };
}

export default async function ComparePage(props: PageProps<"/compare/[slug]">) {
  const { slug } = await props.params;
  const view = resolveCompare(slug);
  if (!view) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-11">
      <Link
        href="/compare"
        className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-oxblood"
      >
        ← All comparisons
      </Link>

      <div className="rule-gold mt-5 pt-5">
        <p className="eyebrow">Side by side</p>
        <div className="mt-2">
          {view.kind === "issue" ? (
            <CompareControls mode="issue" issue={view.area.id} />
          ) : (
            <CompareControls mode="pair" left={view.left.slug} right={view.right.slug} />
          )}
        </div>
      </div>

      {view.kind === "issue" ? (
        <>
          <p className="mt-5 max-w-3xl text-[0.95rem] leading-relaxed text-ink-soft">
            {view.area.question} Parties are ordered left to right by our placement on the spectrum.
            Each line is the position in brief — open <em>in full</em> for the detail and where it is
            contested.
          </p>
          <IssueComparison view={view} />
          <p className="mt-4 text-[0.82rem] text-ink-faint">
            {coverageFor(view.area.id).stated} of {coverageFor(view.area.id).total} parties have a
            position we could source on this. A blank row may mean the party has said little, or that
            we have not found what it has said.
          </p>
        </>
      ) : (
        <>
          <p className="mt-5 max-w-3xl text-[0.95rem] leading-relaxed text-ink-soft">
            {view.left.name} and {view.right.name} across all ten areas, in their own stated terms.
            Open <em>in full</em> for the detail beneath any line.
          </p>
          <PairComparison view={view} />
        </>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
        <p className="text-[0.82rem] leading-relaxed text-ink-soft">
          Positions are summarised from each party&rsquo;s published material.{" "}
          <Link href="/how-we-work#spectrum" className="link-underline">
            How we place parties
          </Link>
          .
        </p>
        <MoreLink href="/compare">Compare something else</MoreLink>
      </div>

      {/* Cross-links: real navigation, and it spreads ranking between the pages */}
      <nav aria-label="Other comparisons" className="mt-8">
        <p className="eyebrow mb-3">
          {view.kind === "issue" ? "The same six on another issue" : "Other pairings"}
        </p>
        <div className="flex flex-wrap gap-2">
          {view.kind === "issue"
            ? POLICY_AREAS.filter((a) => a.id !== view.area.id).map((area) => (
                <Link
                  key={area.id}
                  href={`/compare/${area.id}`}
                  className="border border-rule bg-[color:var(--paper-raised)] px-3 py-1.5 text-[0.78rem] font-semibold transition-colors hover:border-oxblood hover:text-oxblood"
                >
                  {area.name}
                </Link>
              ))
            : allPairs()
                .filter((p) => p.slug !== slug)
                .slice(0, 8)
                .map((pair) => (
                  <Link
                    key={pair.slug}
                    href={`/compare/${pair.slug}`}
                    className="border border-rule bg-[color:var(--paper-raised)] px-3 py-1.5 text-[0.78rem] font-semibold transition-colors hover:border-oxblood hover:text-oxblood"
                  >
                    {pair.left.shortName} vs {pair.right.shortName}
                  </Link>
                ))}
        </div>
      </nav>
    </div>
  );
}
