import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { PORTRAITS_FETCHED_AT, allPortraits } from "@/lib/portraits";
import { allPhotos } from "@/lib/photos";
import { allCouncilPhotos } from "@/lib/council-photos";
import { SEAT_PHOTO_COUNT, allSeatPhotos } from "@/lib/seat-photos";

export const metadata: Metadata = {
  title: "Colophon and image credits",
  description:
    "Every portrait used on ukpoliticshub, with its photographer, licence and link to the original file on Wikimedia Commons.",
};

export default function ColophonPage() {
  const portraits = allPortraits();
  const photos = allPhotos();
  const councilPhotos = allCouncilPhotos();
  const seatPhotos = allSeatPhotos();

  return (
    <div className="mx-auto max-w-4xl px-5 py-11">
      <SectionHeading
        as="h1"
        eyebrow="Credits"
        title="Colophon"
        standfirst="Every photograph on this site is freely licensed and credited to its author. If a credit here is wrong, it is our error and we will correct it."
      />

      <section className="panel mt-8 p-6">
        <h2 className="font-display text-2xl">Type</h2>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
          Headings are set in Times New Roman, a system face on every platform this site targets.
          Body text is Source Sans 3, served locally. Nothing is loaded from a third-party font CDN.
        </p>

        <h2 className="mt-7 font-display text-2xl">Emblems</h2>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
          The party emblems, the Union Flag ornament, the No.10 door and the briefing mark are all
          original drawings made for this site. They are deliberately{" "}
          <strong className="font-semibold text-ink">not</strong> the parties&rsquo; official logos,
          which are registered trademarks and are not reproduced here. Each emblem uses a generic
          symbol long associated with the party, drawn in a single consistent house style and in the
          party&rsquo;s own colour, taken from Wikipedia&rsquo;s party-colour template.
        </p>

        <h2 className="mt-7 font-display text-2xl">Photographs</h2>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
          Portraits come from Wikimedia Commons — in most cases the official parliamentary portrait
          released under the Open Government Licence, or a photograph released under a Creative
          Commons licence. They remain under those licences; reuse from this site carries the same
          conditions. Retrieved{" "}
          {new Date(PORTRAITS_FETCHED_AT).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
      </section>

      <h2 className="mt-10 font-display text-2xl">Photographs</h2>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
        The Downing Street, Westminster, Royal Navy, Buckingham Palace, London and polling station
        images are freely licensed photographs from Wikimedia Commons, resized for the web. Several
        are share-alike licensed, and one is Crown copyright released under the Open Government
        Licence: if you reuse them, the original licence travels with the image.
      </p>

      <div className="panel mt-4 divide-y divide-[color:var(--rule)]">
        {photos.map((photo) => (
          <div key={photo.slug} className="px-5 py-3">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="w-44 shrink-0 text-sm font-semibold">{photo.use}</span>
              <span className="min-w-0 flex-1 text-[0.82rem] text-ink-soft">
                {photo.author ?? "Author not recorded"}
              </span>
              <span className="shrink-0 text-[0.78rem] font-semibold text-ink-faint">
                {photo.licence}
              </span>
              {photo.descriptionUrl ? (
                <a
                  href={photo.descriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline shrink-0 text-[0.78rem] text-ink-faint"
                >
                  File
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl">Council photographs</h2>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
        Each by-election page carries a photograph of the council area rather than of the ward
        being contested. No free source of representative pictures of individual wards exists, so
        every one of these is captioned on the page with what it actually shows.
      </p>

      <div className="panel mt-4 divide-y divide-[color:var(--rule)]">
        {councilPhotos.map((photo) => (
          <div key={photo.slug} className="px-5 py-3">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="w-44 shrink-0 text-sm font-semibold">{photo.council}</span>
              <span className="min-w-0 flex-1 text-[0.82rem] text-ink-soft">
                {photo.shows} · {photo.author ?? "Author not recorded"}
              </span>
              <span className="shrink-0 text-[0.78rem] font-semibold text-ink-faint">
                {photo.licence}
              </span>
              {photo.descriptionUrl ? (
                <a
                  href={photo.descriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline shrink-0 text-[0.78rem] text-ink-faint"
                >
                  File
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl">Constituency photographs</h2>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
        {SEAT_PHOTO_COUNT} of the 650 seat pages carry a photograph of a named town or village
        inside the constituency, in place of the nation photograph they used to share. None is a
        picture of a whole constituency — no such thing exists for most of them — so each page
        names the place shown and says it is not the whole seat. Where nothing suitable was
        found, the nation photograph still stands in.
      </p>

      <div className="panel mt-4 divide-y divide-[color:var(--rule)]">
        {seatPhotos.map((photo) => (
          <div key={photo.slug} className="px-5 py-3">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="w-52 shrink-0 text-sm font-semibold">{photo.seat}</span>
              <span className="min-w-0 flex-1 text-[0.82rem] text-ink-soft">
                {photo.shows} · {photo.author ?? "Author not recorded"}
              </span>
              <span className="shrink-0 text-[0.78rem] font-semibold text-ink-faint">
                {photo.licence}
              </span>
              {photo.descriptionUrl ? (
                <a
                  href={photo.descriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline shrink-0 text-[0.78rem] text-ink-faint"
                >
                  File
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl">Portraits</h2>

      <div className="panel mt-6 divide-y divide-[color:var(--rule)]">
        {portraits.map((portrait) => (
          <div key={portrait.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
            <span className="w-48 shrink-0 text-sm font-semibold">{portrait.title}</span>
            <span className="min-w-0 flex-1 text-[0.82rem] text-ink-soft">
              {portrait.author ?? "Author not recorded"}
            </span>
            <span className="shrink-0 text-[0.78rem] font-semibold text-ink-faint">
              {portrait.licence ?? "Licence not recorded"}
            </span>
            {portrait.descriptionUrl ? (
              <a
                href={portrait.descriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline shrink-0 text-[0.78rem] text-ink-faint"
              >
                File
              </a>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.78rem] leading-relaxed text-ink-faint">
        OGL 3 refers to the Open Government Licence v3.0. CC BY licences require attribution, given
        above. Where no freely licensed portrait exists, the site shows a typographic monogram rather
        than an unlicensed photograph.
      </p>
    </div>
  );
}
