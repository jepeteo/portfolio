import React from "react"
import { Link } from "react-router-dom"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { routeMeta, absoluteUrl } from "../config/routeMeta.js"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
import V2PageHero from "../components/ui/V2PageHero"
import V2SectionHead from "../components/ui/V2SectionHead"
import { v2Panel } from "../components/ui/v2Styles"
import ServiceCard from "../components/services/ServiceCard"
import { emergencyServices } from "../content/services"

const commonProblems = [
  "WordPress critical errors",
  "Broken contact forms",
  "WooCommerce checkout issues",
  "DNS or domain problems",
  "Outlook or business email issues",
  "SSL and HTTPS issues",
  "Slow pages",
  "Broken layout after updates",
  "Plugin conflicts",
  "Launch problems",
]

const processSteps = [
  "You send the website URL and issue",
  "I check the scope",
  "I give a fixed quote",
  "You approve and pay the agreed upfront amount",
  "I start the fix",
  "I send a clear summary of what changed",
]

const whatINeed = [
  "Website URL",
  "Short description of the problem",
  "When it started or what changed recently",
  "Admin or hosting access if needed",
  "Your preferred contact method",
]

const trustStats = [
  { value: "18+", label: "Years experience" },
  { value: "Same day", label: "Response when possible" },
  { value: "Fixed quote", label: "Before work starts" },
]

const meta = routeMeta["/services/emergency-website-help"]

const EmergencyHelpPage: React.FC = () => {
  const canonical = absoluteUrl(meta.canonicalPath)

  useEnhancedSEO({
    title: meta.title,
    description: meta.description,
    canonical,
    ogUrl: canonical,
    ogType: meta.ogType,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": meta.jsonLd,
    },
  })

  return (
    <div>
      <V2PageHero
        id="emergency-hero"
        eyebrow="Emergency support"
        title="Website broken or losing enquiries?"
        subtitle="I can help diagnose and fix urgent website, WordPress, WooCommerce, DNS, email, SSL, and performance issues — fast turnaround when available, depending on scope."
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          {trustStats.map((stat) => (
            <div key={stat.label} className={`${v2Panel} p-5`}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                {stat.label}
              </dt>
              <dd className="m-0 mt-1.5 text-2xl font-bold tracking-tight text-[var(--v2-text)]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </V2PageHero>

      <div className="container mx-auto max-w-6xl space-y-16 px-6 py-16 md:py-20">
        <section aria-labelledby="common-problems-heading">
          <V2SectionHead
            titleId="common-problems-heading"
            label="Symptoms"
            title="Common problems I can help with."
          />
          <ul className="flex flex-wrap gap-2.5">
            {commonProblems.map((problem) => (
              <li
                key={problem}
                className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel)] px-4 py-2 text-sm font-medium text-[var(--v2-muted)]"
              >
                {problem}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-heading">
          <V2SectionHead
            titleId="process-heading"
            label="Process"
            title="How the emergency process works."
          />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <li
                key={step}
                className={`${v2Panel} flex gap-4 p-5`}
              >
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--v2-line)] font-mono text-sm font-black text-[var(--v2-acid)]"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <p className="m-0 pt-1 text-sm text-[var(--v2-muted)]">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="starting-prices-heading">
          <V2SectionHead
            titleId="starting-prices-heading"
            label="Pricing"
            title="Starting prices."
            copy="Final pricing depends on scope — I confirm a fixed quote before any work begins."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </section>

        <section aria-labelledby="what-i-need-heading">
          <div className={`${v2Panel} p-8`}>
            <h2
              id="what-i-need-heading"
              className="m-0 mb-6 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)] md:text-3xl"
            >
              What I need from you
            </h2>
            <ul className="space-y-3">
              {whatINeed.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-[var(--v2-muted)]"
                >
                  <span
                    className="h-2 w-2 flex-none rounded-full bg-[var(--v2-acid)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <EmergencyHelpCTA />

        <p className="text-center">
          <Link
            to="/services"
            className="rounded-sm text-sm font-bold text-[var(--v2-brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)]"
          >
            View full service catalog →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmergencyHelpPage
