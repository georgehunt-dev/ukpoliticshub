import Image from "next/image";
import { credit, getPhoto, type PhotoSlug } from "@/lib/photos";

/**
 * A photographic band introducing a section — the picture carries the section
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
}: {
  photo: PhotoSlug;
  eyebrow: string;
  title: string;
  standfirst?: string;
  alt: string;
  height?: string;
  action?: React.ReactNode;
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
          {/* Two light washes rather than one heavy one: a diagonal to seat the
              type on the left, and a shallow foot so the credit stays readable.
              A single strong top-to-bottom wash flattened every photograph to
              near-black in a band this short. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(8,16,30,0.88) 0%, rgba(8,16,30,0.72) 34%, rgba(8,16,30,0.32) 58%, rgba(8,16,30,0.08) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background: "linear-gradient(to top, rgba(8,16,30,0.55) 0%, rgba(8,16,30,0) 100%)",
            }}
          />
        </>
      ) : null}

      <div
        className="relative flex w-full max-w-3xl flex-wrap items-end justify-between gap-4 px-5 py-5 text-[color:var(--paper)] sm:px-7 sm:py-6"
        style={{ textShadow: "0 1px 12px rgba(8,16,30,0.75)" }}
      >
        <div className="min-w-0">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--paper)]/70">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 font-display text-3xl leading-none sm:text-5xl">{title}</h2>
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
