import React from "react"
import { Link } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { site } from "../config/site"

const sectionTitle =
  "mt-10 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]"
const copy = "mt-3 text-base leading-relaxed text-[var(--v2-muted)]"
const list = "mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--v2-muted)]"

const PrivacyPage: React.FC = () => {
  useRoutePageMeta("/privacy")

  return (
    <div>
      <V2PageHero
        id="privacy-hero"
        eyebrow="Privacy"
        title="Privacy notice"
        subtitle="Draft for the site owner to review. This is not legal advice."
        compact
      />
      <article className="container mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-5 text-sm leading-relaxed text-[var(--v2-muted)]">
          This is a draft written so the contact form is not collecting names
          and email addresses with no explanation. It is not a finished privacy
          policy and it is not legal advice. Theodoros should read it, correct
          the retention line, and only then treat it as the notice for this
          site.
        </div>

        <h2 className={sectionTitle}>Who this is</h2>
        <p className={copy}>
          This site is run by {site.name}, based in {site.location.label}. For
          privacy questions, email{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-bold text-[var(--v2-brand)] underline-offset-2 hover:underline"
          >
            {site.email}
          </a>
          . Because the site is operated from Berlin, the GDPR applies to the
          contact form and to the analytics tools below.
        </p>

        <h2 className={sectionTitle}>Contact form</h2>
        <p className={copy}>
          The form at{" "}
          <Link
            to="/contact"
            className="font-bold text-[var(--v2-brand)] underline-offset-2 hover:underline"
          >
            /contact
          </Link>{" "}
          asks for your name, email address, and message. You can also add a
          request type, how urgent it is, a budget range, and a website URL.
          Those details are used to read the request and reply. They are not
          sold and they are not added to a marketing list.
        </p>
        <p className={copy}>
          The form is checked by Cloudflare Turnstile, then sent to{" "}
          <code>/api/contact</code> and delivered by{" "}
          <a
            href="https://resend.com/legal/privacy-policy"
            className="font-bold text-[var(--v2-brand)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resend
          </a>{" "}
          to the inbox above. Resend processes the message so it can be
          delivered. A copy stays in that inbox.
        </p>
        <p className={copy}>
          Draft retention: keep each message while the conversation is open,
          and for ordinary business records after that. Replace this sentence
          with the period you actually use.
        </p>

        <h2 className={sectionTitle}>Cloudflare Turnstile</h2>
        <p className={copy}>
          Turnstile runs on the form to reject automated submissions. Cloudflare
          may see technical data such as your IP address and browser so it can
          make that check. The token is used for the submission and is not kept
          as a profile. Cloudflare describes that processing in its{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            className="font-bold text-[var(--v2-brand)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>
          .
        </p>

        <h2 className={sectionTitle}>PostHog, EU</h2>
        <p className={copy}>
          Product analytics are loaded from PostHog&apos;s EU host (
          <code>eu.i.posthog.com</code>) after the page is idle. They record
          page views and similar product events so it is possible to see which
          pages are used. Session recording is turned off in the site code.
          PostHog may store an identifier in a cookie or in local storage.
          Their{" "}
          <a
            href="https://posthog.com/privacy"
            className="font-bold text-[var(--v2-brand)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy notice
          </a>{" "}
          describes the EU service.
        </p>

        <h2 className={sectionTitle}>Vercel Analytics</h2>
        <p className={copy}>
          The site is hosted on Vercel. Vercel Web Analytics and Speed Insights
          collect aggregated visits and performance measurements such as Core
          Web Vitals. Vercel may also keep short-lived server logs, including
          IP address and user agent, to operate and protect the hosting. See{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="font-bold text-[var(--v2-brand)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel&apos;s privacy policy
          </a>
          .
        </p>

        <h2 className={sectionTitle}>What this site stores in the browser</h2>
        <ul className={list}>
          <li>A theme choice, so light or dark mode survives a reload.</li>
          <li>
            A PostHog identifier, when analytics is enabled, for the page-view
            counts above.
          </li>
          <li>A Cloudflare Turnstile cookie while the form check runs.</li>
        </ul>
        <p className={copy}>There are no advertising cookies.</p>

        <h2 className={sectionTitle}>Your choices</h2>
        <p className={copy}>
          You can email {site.email} to ask for a copy of a contact message,
          to correct it, or to ask for it to be deleted. You can also object to
          analytics on this site. If you are not satisfied, you can complain to
          a supervisory authority. For Berlin, that is the Berliner Beauftragte
          für Datenschutz und Informationsfreiheit.
        </p>
        <p className={copy}>
          The practical basis for the form is answering a request you chose to
          send. Analytics are there to understand how the site is used. Confirm
          both with whoever reviews this draft before publishing it as final.
        </p>
      </article>
    </div>
  )
}

export default PrivacyPage
