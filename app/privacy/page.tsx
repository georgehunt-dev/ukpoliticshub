import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy and cookies",
  description:
    "What ukpoliticshub stores, what it does not, and how analytics cookies are handled — written to be read rather than clicked past.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-11">
      <SectionHeading
        as="h1"
        eyebrow="Data"
        title="Privacy and cookies"
        standfirst="Short, because there is not much to tell. This site collects very little and sells nothing."
      />

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-display text-2xl">What we always collect</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            Visit counts, which pages are read, roughly where in the world readers are, and which
            site referred them. This runs through Vercel Analytics, which is{" "}
            <strong className="font-semibold text-ink">cookieless</strong>: it stores nothing on your
            device and does not build a profile of you or follow you to other sites. It cannot
            identify you, and there is nothing to opt out of because nothing is kept about you
            individually.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">What we collect only if you agree</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            Google Analytics, which gives us a more detailed picture of how people move through the
            site. It <strong className="font-semibold text-ink">does</strong> set a cookie, which is
            why we ask first. If you decline, the Google script is never loaded and no Google cookie
            is ever written — it is not loaded and then switched off, it is simply not fetched.
          </p>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            Your choice is remembered in your browser&rsquo;s local storage under{" "}
            <code className="bg-[color:var(--paper-sunk)] px-1 py-0.5 text-[0.85rem]">
              ukph-consent
            </code>
            . Clearing your browser data resets it and we will ask again.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">What we do not do</h2>
          <ul className="mt-2.5 space-y-2 text-[0.95rem] leading-relaxed text-ink-soft">
            {[
              "No advertising, and no advertising trackers.",
              "No selling or sharing of data with third parties.",
              "No accounts, so no passwords and no personal details to lose.",
              "No advertising profile built from what you read.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-oxblood" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">If you sign up for the email</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            We ask for one thing: your email address. It is passed straight to the mailing provider
            that sends the newsletter and is{" "}
            <strong className="font-semibold text-ink">not stored on this site</strong>, so there is
            no subscriber list here to lose. It is used for the daily email and nothing else — never
            sold, never shared, never used to build an advertising profile.
          </p>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            Every issue carries a one-click unsubscribe, which takes effect immediately and removes
            your address from the provider. You can also email us to be removed. Under UK GDPR the
            lawful basis is your consent, given by submitting the form, and you may withdraw it at
            any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Links to other sites</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            The news section links out to publishers&rsquo; own websites. Once you follow one of
            those links you are on their site, under their privacy policy, not ours. We do not host
            or alter their articles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Your rights</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            Under UK GDPR you can ask what personal data an organisation holds about you and request
            its deletion. In our case the honest answer is that we hold none that identifies you: the
            always-on analytics are aggregate and cookieless, and the optional analytics are Google&rsquo;s
            to explain. You can withdraw consent at any time by clearing this site&rsquo;s data in your
            browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Changes</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
            If this site ever starts collecting something it does not collect today, this page
            changes first, and it will say what and why.
            See also{" "}
            <Link href="/how-we-work" className="link-underline">
              how we work
            </Link>{" "}
            for the editorial side of the same question.
          </p>
        </section>
      </div>
    </div>
  );
}
