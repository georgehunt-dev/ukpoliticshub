import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ConsentGate from "@/components/ConsentGate";
import SignupModal from "@/components/SignupModal";
import SiteFooter from "@/components/SiteFooter";
import { SiteStructuredData } from "@/components/StructuredData";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

/**
 * Source Sans carries all body text. Headings use Times New Roman, which is
 * a system face on every platform this site targets — so it is set in CSS
 * rather than loaded, and costs nothing.
 */
/**
 * GA4 measurement IDs are public by design — they appear in the page source of
 * every site using them — so this is not a secret. It can still be overridden
 * per-environment without a code change.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-BY5YWVF0PR";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ukpoliticshub.com"),
  title: {
    default: "ukpoliticshub — UK politics from both sides, sourced and dated",
    template: "%s · ukpoliticshub",
  },
  description:
    "Stop scanning social media and news sites for hours. Polls, threat levels, elections and news from across the political spectrum — every figure sourced. Not endorsed by or affiliated with any political party.",
  openGraph: {
    title: "ukpoliticshub",
    description:
      "Up-to-date information from both sides of the political spectrum about the United Kingdom.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteStructuredData />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-ink focus:bg-[color:var(--paper-raised)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        {/* Cookieless, so it needs no consent and runs for everyone. */}
        <Analytics />
        {/* GA4 is loaded only if the visitor accepts. */}
        <ConsentGate gaId={GA_ID} />
        {/* Shown once, well after arrival, and never again once answered. */}
        <SignupModal />
      </body>
    </html>
  );
}
