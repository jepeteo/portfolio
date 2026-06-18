import React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useEnhancedSEO, SEOUtils } from "../utils/enhancedSEO"
import { site } from "../config/site"
import FeaturedServices from "../components/services/FeaturedServices"
import ServiceCategorySection from "../components/services/ServiceCategorySection"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
import { serviceCategories } from "../content/services"

const howIWorkSteps = [
  {
    title: "Understand the problem",
    description:
      "You share the website URL, symptoms, and business impact so I can focus on what matters.",
  },
  {
    title: "Confirm scope and quote",
    description:
      "I review the issue, clarify what is included, and provide a fixed quote before work starts.",
  },
  {
    title: "Deliver with clarity",
    description:
      "I fix, improve, or build the agreed work and send a clear summary of what changed.",
  },
]

const ServicesPage: React.FC = () => {
  const { isDark } = useTheme()
  const canonical = `${site.url}/services`
  const description =
    "Practical web development, WordPress, WooCommerce, technical SEO, and website support for small businesses and agencies."

  useEnhancedSEO({
    title: SEOUtils.generateTitle(
      "Practical Web Development, WordPress, SEO and Technical Support"
    ),
    description,
    canonical,
    ogUrl: canonical,
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Web Development and Technical Support Services",
      url: canonical,
      provider: {
        "@type": "Person",
        name: site.name,
        url: site.url,
      },
      itemListElement: serviceCategories.flatMap((category) =>
        category.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.shortDescription,
          },
          ...(service.priceLabel && {
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "EUR",
              description: service.priceLabel,
            },
          }),
        }))
      ),
    },
  })

  return (
    <div className="container max-w-6xl mx-auto px-6 py-16 md:py-24">
      <header className="mb-16 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-500">
          Services
        </p>
        <h1
          className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Practical Web Development, WordPress, SEO and Technical Support
        </h1>
        <p
          className={`text-lg leading-relaxed mb-8 ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          I help small businesses, agencies, and independent professionals fix
          website problems, improve performance, launch better pages, and build
          reliable digital systems.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/?type=not-sure#contact"
            className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              isDark
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            }`}
          >
            Request a quote
          </Link>
          <Link
            to="/services/emergency-website-help"
            className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border transition-colors ${
              isDark
                ? "border-slate-600 text-slate-200 hover:border-blue-500"
                : "border-slate-300 text-slate-700 hover:border-blue-500"
            }`}
          >
            View emergency help
          </Link>
        </div>
      </header>

      <div className="space-y-20">
        <FeaturedServices />

        <section aria-labelledby="all-services-heading">
          <h2
            id="all-services-heading"
            className={`text-2xl md:text-3xl font-bold mb-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Full Service Catalog
          </h2>
          <p
            className={`mb-8 max-w-2xl text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Browse by category. Each service is scoped clearly so you know what
            you are asking for before we start.
          </p>
          <div className="space-y-4">
            {serviceCategories.map((category, index) => (
              <ServiceCategorySection
                key={category.id}
                category={category}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="how-i-work-heading">
          <h2
            id="how-i-work-heading"
            className={`text-2xl md:text-3xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            How I Work
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howIWorkSteps.map((step, index) => (
              <div
                key={step.title}
                className={`rounded-2xl border p-6 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <p className="text-sm font-semibold text-blue-500 mb-2">
                  Step {index + 1}
                </p>
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="related-proof-heading">
          <h2
            id="related-proof-heading"
            className={`text-2xl md:text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Proof and Related Projects
          </h2>
          <p
            className={`mb-6 max-w-2xl text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            See how these services show up in real client work across WordPress,
            Next.js, and internal tools.
          </p>
          <Link
            to="/#projects"
            className={`inline-flex font-semibold ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            View portfolio projects →
          </Link>
        </section>

        <EmergencyHelpCTA
          title="Ready to discuss a project?"
          description="Tell me what you need, your timeline, and your website URL. I will reply with a clear scope and quote."
          primaryLabel="Request a quote"
          primaryHref="/?type=not-sure#contact"
          secondaryLabel="Emergency help"
          secondaryHref="/services/emergency-website-help"
        />
      </div>
    </div>
  )
}

export default ServicesPage
