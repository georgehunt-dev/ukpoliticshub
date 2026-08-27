import Image from "next/image";
import { credit, getPhoto, type PhotoSlug } from "@/lib/photos";

/**
 * A photographic band introducing a section: the picture carries the section
 * title, in place of a plain heading. Credit sits in the corner so no image on
 * this site is ever used without attribution.
 */
export default function SectionImage({
  photo: slug,
  eyebrow,
  title,
  standfirst,
  alt,
  height = "h-60 sm:h-72",
  action,
  /** Override where the band carries the page title and wants more weight. */
  titleClassName = "text-3xl sm:text-5xl",
  /**
   * Defaults to h2 because this band usually introduces a section inside a
   * page that already has its own h1. Where the band *is* the page title:
   * the state assessments: pass "h1" so the page is not published without
   * one.
   */
  as: Heading = "h2",
}: {
  photo: PhotoSlug;
  /** Omitted where the title alone should carry the band. */
  eyebrow?: string;
  title: string;
  /** Takes a node so a page can control where the line breaks. */
  standfirst?: React.ReactNode;
  alt: string;
  height?: string;
  action?: React.ReactNode;
  titleClassName?: string;
  as?: "h1" | "h2";
}) {
  const photo = getPhoto(slug);

  return (
    <div className={`relative isolate flex ${height} items-end overflow-hidden bg-ink`}>
      {photo ? (
        <>
          <Image
            src={photo.file}
            alt={alt}
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover"
            style={{
              objectPosition: photo.position,
              // Several of these are overcast British exteriors; a small lift
              // keeps them from reading as black once the wash is over them.
              filter: "brightness(1.28) contrast(0.96) saturate(1.08)",
            }}
          />
          {/* Both washes are defined in globals.css because they change shape
              between phone and desktop: see the ".section-wash" note there. */}
          <div className="section-wash absolute inset-0" />
          <div className="section-wash-foot absolute inset-x-0 bottom-0 h-1/2" />
        </>
      ) : null}

      <div
        className="relative flex w-full max-w-3xl flex-wrap items-end justify-between gap-4 px-5 py-5 text-[color:var(--paper)] sm:px-7 sm:py-6"
        style={{ textShadow: "0 1px 12px rgba(8,16,30,0.75)" }}
      >
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--paper)]/70">
              {eyebrow}
            </p>
          ) : null}
          <Heading
            className={`font-display leading-none ${eyebrow ? "mt-1.5" : ""} ${titleClassName}`}
          >
            {title}
          </Heading>
          {standfirst ? (
            <p className="mt-2.5 max-w-2xl text-[0.88rem] leading-relaxed text-[color:var(--paper)]/85">
              {standfirst}
            </p>
          ) : null}
        </div>
        {action}
      </div>

      {photo ? (
        <span
          className="absolute right-2 top-2 text-[0.6rem] text-[color:var(--paper)]/70"
          style={{ textShadow: "0 1px 4px rgba(8,16,30,0.9)" }}
        >
          {credit(photo)}
        </span>
      ) : null}
    </div>
  );
}
