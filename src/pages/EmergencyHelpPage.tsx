import React from "react"
import { Link } from "react-router-dom"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { routeMeta, absoluteUrl } from "../config/routeMeta.js"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
import SectionShell from "../components/ui/SectionShell"
import SurfaceCard from "../components/ui/SurfaceCard"
import StatBlock from "../components/ui/StatBlock"
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
      <SectionShell
        id="emergency-hero"
        eyebrow="Emergency Support"
        headingLevel="h1"
        title="Emergency Website Help"
        subtitle="Website broken or losing enquiries? I can help diagnose and fix urgent website, WordPress, WooCommerce, DNS, email, SSL, and performance issues."
        variant="muted"
        decoration="grid"
        className="!pb-12"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {trustStats.map((stat, index) => (
            <StatBlock
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={index}
              animate={false}
            />
          ))}
        </div>
      </SectionShell>

      <div className="container mx-auto max-w-6xl space-y-16 px-6 pb-20">
        <section aria-labelledby="common-problems-heading">
          <h2
            id="common-problems-heading"
            className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
          >
            Common Problems I Can Help With
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {commonProblems.map((problem) => (
              <li key={problem}>
                <SurfaceCard className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                  {problem}
                </SurfaceCard>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-heading">
          <h2
            id="process-heading"
            className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
          >
            How the Emergency Process Works
          </h2>
          <ol className="space-y-4">
            {processSteps.map((step, index) => (
              <li key={step}>
                <SurfaceCard className="flex gap-4 p-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-slate-700 dark:text-slate-200">
                    {step}
                  </p>
                </SurfaceCard>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="starting-prices-heading">
          <h2
            id="starting-prices-heading"
            className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
          >
            Starting Prices
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Final pricing depends on scope. I confirm a fixed quote before work
            begins.
          </p>
        </section>

        <section aria-labelledby="what-i-need-heading">
          <SurfaceCard className="p-8">
            <h2
              id="what-i-need-heading"
              className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
            >
              What I Need From You
            </h2>
            <ul className="space-y-3">
              {whatINeed.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </SurfaceCard>
        </section>

        <EmergencyHelpCTA />

        <p className="text-center">
          <Link
            to="/services"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View full service catalog →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmergencyHelpPage
