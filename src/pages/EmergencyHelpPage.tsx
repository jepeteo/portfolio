import React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useEnhancedSEO, SEOUtils } from "../utils/enhancedSEO"
import { site } from "../config/site"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
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

const EmergencyHelpPage: React.FC = () => {
  const { isDark } = useTheme()
  const canonical = `${site.url}/services/emergency-website-help`
  const description =
    "Fast help for WordPress errors, broken forms, WooCommerce checkout issues, DNS problems, email setup, SSL errors, and urgent website problems."

  useEnhancedSEO({
    title: SEOUtils.generateTitle("Emergency Website Help"),
    description,
    canonical,
    ogUrl: canonical,
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Emergency Website Help",
      description,
      url: canonical,
      provider: {
        "@type": "Person",
        name: site.name,
        url: site.url,
      },
      areaServed: "Worldwide",
      serviceType: "Emergency website support",
    },
  })

  return (
    <div className="container max-w-6xl mx-auto px-6 py-16 md:py-24">
      <header className="mb-16 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-500">
          Emergency Support
        </p>
        <h1
          className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Emergency Website Help
        </h1>
        <p
          className={`text-lg leading-relaxed ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Website broken or losing enquiries? I can help diagnose and fix urgent
          website, WordPress, WooCommerce, DNS, email, SSL, and performance
          issues.
        </p>
      </header>

      <div className="space-y-16">
        <section aria-labelledby="common-problems-heading">
          <h2
            id="common-problems-heading"
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Common Problems I Can Help With
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {commonProblems.map((problem) => (
              <li
                key={problem}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 text-slate-200"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {problem}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-heading">
          <h2
            id="process-heading"
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            How the Emergency Process Works
          </h2>
          <ol className="space-y-4">
            {processSteps.map((step, index) => (
              <li
                key={step}
                className={`flex gap-4 rounded-xl border p-4 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isDark
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {index + 1}
                </span>
                <p
                  className={`pt-1 ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="starting-prices-heading">
          <h2
            id="starting-prices-heading"
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Starting Prices
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyServices.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3
                  className={`font-semibold mb-1 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-sm mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {service.shortDescription}
                </p>
                {service.priceLabel && (
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    {service.priceLabel}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p
            className={`mt-4 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Final pricing depends on scope. I confirm a fixed quote before work
            begins.
          </p>
        </section>

        <section aria-labelledby="what-i-need-heading">
          <h2
            id="what-i-need-heading"
            className={`text-2xl md:text-3xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            What I Need From You
          </h2>
          <ul className="space-y-3">
            {whatINeed.map((item) => (
              <li
                key={item}
                className={`flex items-center gap-3 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDark ? "bg-blue-400" : "bg-blue-500"
                  }`}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <EmergencyHelpCTA />

        <p className="text-center">
          <Link
            to="/services"
            className={`text-sm font-semibold ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            View full service catalog →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmergencyHelpPage
