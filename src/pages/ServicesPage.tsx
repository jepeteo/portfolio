import React from "react"
import { Link } from "react-router-dom"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { routeMeta, absoluteUrl } from "../config/routeMeta.js"
import FeaturedServices from "../components/services/FeaturedServices"
import ServiceCategorySection from "../components/services/ServiceCategorySection"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
import SectionShell from "../components/ui/SectionShell"
import SurfaceCard from "../components/ui/SurfaceCard"
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

const meta = routeMeta["/services"]

const ServicesPage: React.FC = () => {
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
        id="services-hero"
        eyebrow="Services"
        headingLevel="h1"
        title="Practical Web Development, WordPress, SEO and Technical Support"
        subtitle="I help small businesses, agencies, and independent professionals fix website problems, improve performance, launch better pages, and build reliable digital systems."
        decoration="gradient-orb"
        className="!pb-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/?type=not-sure#contact"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-600"
          >
            Request a quote
          </Link>
          <Link
            to="/services/emergency-website-help"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-500"
          >
            View emergency help
          </Link>
        </div>
      </SectionShell>

      <div className="container mx-auto max-w-6xl space-y-20 px-6 pb-20">
        <FeaturedServices />

        <section aria-labelledby="all-services-heading">
          <h2
            id="all-services-heading"
            className="mb-3 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
          >
            Full Service Catalog
          </h2>
          <p className="mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
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
            className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
          >
            How I Work
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howIWorkSteps.map((step, index) => (
              <SurfaceCard key={step.title} className="p-6">
                <p className="mb-2 text-sm font-semibold text-blue-500">
                  Step {index + 1}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section aria-labelledby="related-proof-heading">
          <SurfaceCard className="p-8">
            <h2
              id="related-proof-heading"
              className="mb-4 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
            >
              Proof and Related Projects
            </h2>
            <p className="mb-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              See how these services show up in real client work across WordPress,
              Next.js, and internal tools.
            </p>
            <Link
              to="/#projects"
              className="inline-flex font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View portfolio projects →
            </Link>
          </SurfaceCard>
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
