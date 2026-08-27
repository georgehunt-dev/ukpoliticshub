import Link from "next/link";
import Image from "next/image";
import { LogoLockup } from "@/components/Logo";
import { credit, getPhoto } from "@/lib/photos";

export default function SiteFooter() {
  const skyline = getPhoto("london");

  return (
    <footer className="mt-16 border-t border-rule bg-[color:var(--paper-raised)]">
      {/* A thin band of the Thames at sunset, closing the page */}
      {skyline ? (
        <div className="relative h-28 w-full overflow-hidden sm:h-36">
          <Image
            src={skyline.file}
            alt="The Thames and the London skyline at sunset"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: skyline.position }}
          />
          <span className="absolute right-2 top-2 text-[0.6rem] text-white/55">
            {credit(skyline)}
          </span>
        </div>
      ) : null}
      <div className="shell py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <LogoLockup size={34} showDomain />
            <p className="mt-3 max-w-sm text-[0.85rem] leading-relaxed text-ink-soft">
              Up-to-date information from both sides of the political spectrum about the United
              Kingdom.
            </p>
            <p className="mt-4 border border-ink/25 bg-[color:var(--paper-sunk)] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.1em]">
              Not endorsed by or affiliated with any political party
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-2.5">Sections</p>
            <ul className="space-y-1.5 text-[0.85rem]">
              <li><Link href="/#polls" className="link-underline text-ink-soft">The Race for No.10</Link></li>
              <li><Link href="/#immigration" className="link-underline text-ink-soft">Channel crossings</Link></li>
              <li><Link href="/#threat" className="link-underline text-ink-soft">Threat levels</Link></li>
              <li><Link href="/news" className="link-underline text-ink-soft">News by topic</Link></li>
              <li><Link href="/parties" className="link-underline text-ink-soft">The parties</Link></li>
              <li><Link href="/elections" className="link-underline text-ink-soft">Elections</Link></li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-2.5">About</p>
            <ul className="space-y-1.5 text-[0.85rem]">
              <li><Link href="/mission" className="link-underline text-ink-soft">Our mission</Link></li>
              <li><Link href="/how-we-work" className="link-underline text-ink-soft">How we work</Link></li>
              <li><Link href="/how-we-work#bias" className="link-underline text-ink-soft">How we rate outlets</Link></li>
              <li><Link href="/how-we-work#russia" className="link-underline text-ink-soft">The Russia assessment</Link></li>
              <li><Link href="/colophon" className="link-underline text-ink-soft">Image credits</Link></li>
              <li><Link href="/privacy" className="link-underline text-ink-soft">Privacy &amp; cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="measure mt-8 border-t border-rule pt-5 text-[0.75rem] leading-relaxed text-ink-faint">
          <p>
            Photographs and portraits are from Wikimedia Commons and remain under their original
            licences: full credits at{" "}
            <Link href="/colophon" className="link-underline">the colophon</Link>. Party crests and
            outlet name-marks on this site are our own work, not the parties&rsquo; or
            publishers&rsquo; official logos, which are trademarks and are not reproduced here.
            Headlines and article links belong to their publishers.
          </p>
          <p className="mt-2">
            Poll figures are reported from published aggregators and pollsters. The terrorism threat
            level is the official government figure. The Russia score is our own editorial
            assessment and carries no official standing.
          </p>
        </div>
      </div>
    </footer>
  );
}
