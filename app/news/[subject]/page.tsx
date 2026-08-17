import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Storyline from "@/components/Storyline";
import EmailCapture from "@/components/EmailCapture";
import StoryRow from "@/components/StoryRow";
import { MoreLink, formatDate } from "@/components/ui";
import { subjectBySlug, subjects } from "@/data/subjects";
import { getNews } from "@/lib/news";
import { getPortrait } from "@/lib/portraits";
import { getPhoto } from "@/lib/photos";
import { coverageFor, labelFor, LEAN_LABEL, type Lean, MIN_INDEXABLE } from "@/lib/subjects";

export const revalidate = 600;

export function generateStaticParams() {
  return subjects.map((subject) => ({ subject: subject.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[subject]">): Promise<Metadata> {
  const { subject: slug } = await params;
  const subject = subjectBySlug[slug];
  if (!subject) return { title: "Subject not found" };

  const { items } = await getNews();
  const coverage = coverageFor(subject, items);
  const thin = coverage.stories.length < MIN_INDEXABLE;

  return {
    // The title carries the language people actually search; the h1 stays human.
    title: `${subject.name}: what the left and right are saying`,
    description: `Every story about ${subject.name} from the UK press, sorted by where each masthead sits on the political spectrum. ${coverage.stories.length} stories, updated ${formatDate(new Date().toISOString().slice(0, 10))}.`,
    alternates: { canonical: `/news/${subject.slug}` },
    /**
     * A page with almost nothing on it should not be asking to rank. Google
     * reads a cluster of near-empty templated pages as low quality and applies
     * that judgement across the site, so thin subjects stay out of the index
     * until coverage arrives — the page still works for anyone who clicks it.
     */
    robots: thin ? { index: false, follow: true } : undefined,
  };
}

const LEAN_ORDER: Lean[] = ["left", "centre", "right"];
const LEAN_ACCENT: Record<Lean, string> = {
  left: "#2b4a7a",
  centre: "var(--ink-faint)",
  right: "var(--oxblood)",
};

export default async function SubjectPage({ params }: PageProps<"/news/[subject]">) {
  const { subject: slug } = await params;
  const subject = subjectBySlug[slug];
  if (!subject) notFound();

  const { items } = await getNews();
  const coverage = coverageFor(subject, items);
  const portrait = subject.portrait ? getPortrait(subject.portrait) : undefined;
  const photo = subject.photo ? getPhoto(subject.photo) : undefined;
  const singleCount = LEAN_ORDER.reduce((n, lean) => n + coverage.singles[lean].length, 0);

  return (
    <div className="shell py-9">
      <nav className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.78rem] text-ink-soft">
        <Link href="/news" className="link-underline font-medium">
          The news desk
        </Link>
        <span aria-hidden="true" className="text-ink-faint">
          ›
        </span>
        <span>{subject.name}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-end gap-5 border-t-2 border-ink pt-5">
        {portrait || photo ? (
          <div className="relative h-[118px] w-[104px] shrink-0 overflow-hidden bg-[color:var(--paper-sunk)] ring-1 ring-inset ring-[color:var(--rule)]">
            <Image
              src={portrait?.file ?? photo!.file}
              alt={portrait ? `${subject.name} — portrait` : subject.name}
              fill
              sizes="104px"
              className="object-cover object-top"
              style={photo && !portrait ? { objectPosition: photo.position } : undefined}
            />
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="eyebrow">Subject · {subject.role}</p>
          <h1 className="mt-1 font-display text-4xl leading-none sm:text-5xl">{subject.name}</h1>
          <p className="measure mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">
            {coverage.stories.length === 0 ? (
              <>Nothing in the feeds mentions {subject.name} at the moment. This page fills as the papers cover them.</>
            ) : (
              <>
                {coverage.stories.length} stories in the current feeds.{" "}
                {coverage.own} name {subject.kind === "issue" ? "it" : "them"} directly
                {coverage.linked > 0 && subject.linkedName ? (
                  <>
                    ; {coverage.linked} arrived through {subject.linkedName} and are marked as such
                  </>
                ) : null}
                .
              </>
            )}
          </p>
        </div>
      </header>

      {coverage.storylines.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl leading-tight">Covered from more than one side</h2>
          <p className="measure mt-1.5 text-[0.88rem] leading-relaxed text-ink-soft">
            The same event, as different mastheads told it. Headlines are theirs, unedited.
          </p>
          {coverage.storylines.map((storyline) => (
            <Storyline
              key={storyline.id}
              storyline={storyline}
              title={labelFor(storyline)}
            />
          ))}
        </section>
      ) : null}

      {singleCount > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl leading-tight">
            Everything else, by where the paper sits
          </h2>
          <p className="measure mt-1.5 text-[0.88rem] leading-relaxed text-ink-soft">
            Stories only one masthead is carrying. Grouped by lean so you can read one side, then
            the other.
          </p>

          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            {LEAN_ORDER.map((lean) => {
              const stories = coverage.singles[lean];
              return (
                <div key={lean} className="border-t-[3px]" style={{ borderColor: LEAN_ACCENT[lean] }}>
                  <p
                    className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em]"
                    style={{ color: LEAN_ACCENT[lean] }}
                  >
                    {LEAN_LABEL[lean]}
                    <span className="ml-1.5 text-ink-faint">{stories.length}</span>
                  </p>
                  {stories.length ? (
                    <ul className="divide-y divide-rule/60">
                      {stories.map((story) => (
                        <StoryRow key={story.url} story={story} />
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-[0.8rem] italic leading-snug text-ink-faint">
                      Our system was unable to detect coverage from this side of the political
                      spectrum on this subject.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <EmailCapture
        className="mt-10"
        heading={`Follow ${subject.name} from both sides`}
        blurb="The day's stories as the left and the right each told them, in one email before breakfast."
        reason={`Coverage of ${subject.name}`}
      />

      <footer className="mt-10 border-t border-rule pt-4">
        <p className="measure text-[0.84rem] leading-relaxed text-ink-soft">
          Headlines and thumbnails belong to the publishers and link back to them. Where a
          masthead sits on the spectrum is a fixed rating explained at{" "}
          <Link href="/how-we-work" className="link-underline font-medium">
            how we work
          </Link>
          . Two of the thirteen feeds publish no images, and those stories carry a generic
          picture rather than one of the story.
        </p>
        <p className="mt-3">
          <MoreLink href="/news">Every subject we track</MoreLink>
        </p>
      </footer>
    </div>
  );
}
