import { getPhoto } from "@/lib/photos";
import type { MatchedStory } from "@/lib/subjects";

/**
 * One story: the publisher's own thumbnail, its masthead, where that masthead
 * sits, and the headline as written.
 *
 * The image is a plain <img> rather than next/image on purpose. These are
 * other publishers' press photographs served from their own CDNs; routing
 * them through our optimiser would mean caching and re-serving their pictures
 * from our infrastructure, which is a bigger imposition than linking to them.
 *
 * Two of the thirteen feeds (Channel 4 and the Financial Times) publish no
 * images at all, so those fall back to a generic press photograph rather than
 * leaving a hole in the row.
 */
export default function StoryRow({ story }: { story: MatchedStory }) {
  const fallback = getPhoto("press-generic");
  const src = story.imageUrl ?? fallback?.file;

  return (
    <li>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 py-2.5"
      >
        <span className="relative block h-[62px] w-[84px] shrink-0 overflow-hidden bg-[color:var(--paper-sunk)] ring-1 ring-inset ring-[color:var(--rule)]">
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span
              className={`text-[0.68rem] font-bold ${
                story.lean === "left"
                  ? "text-[#2b4a7a]"
                  : story.lean === "right"
                    ? "text-oxblood"
                    : "text-ink-faint"
              }`}
            >
              {story.outletName}
            </span>
            {story.via === "linked" ? (
              <span className="text-[0.58rem] uppercase tracking-[0.1em] text-ink-faint">
                via {story.viaName}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block font-display text-[0.97rem] font-bold leading-tight group-hover:text-oxblood">
            {story.title}
          </span>
        </span>
      </a>
    </li>
  );
}
