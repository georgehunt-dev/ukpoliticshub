import Link from "next/link";
import { LogoLockup } from "@/components/Logo";

const NAV = [
  { href: "/news", label: "News" },
  { href: "/briefing", label: "Briefing" },
  { href: "/parties", label: "Parties" },
  { href: "/compare", label: "Compare" },
  { href: "/elections", label: "Elections" },
  { href: "/constituencies", label: "Your area" },
  { href: "/how-we-work", label: "How we work" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-[color:var(--paper)]/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-2.5">
        <Link href="/" aria-label="ukpoliticshub — front page">
          <LogoLockup size={30} />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-oxblood"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>

      {/* Mobile nav: scrolls horizontally rather than hiding behind a hamburger. */}
      <nav aria-label="Primary, mobile" className="border-t border-rule md:hidden">
        <ul className="flex gap-5 overflow-x-auto px-5 py-2">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-soft"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
