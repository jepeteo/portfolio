import React from "react"
import { Link } from "react-router-dom"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { routeMeta, absoluteUrl } from "../config/routeMeta.js"
import FeaturedServices from "../components/services/FeaturedServices"
import ServiceCategorySection from "../components/services/ServiceCategorySection"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
import V2PageHero from "../components/ui/V2PageHero"
import V2SectionHead from "../components/ui/V2SectionHead"
import { v2PrimaryButton, v2SecondaryButton, v2Panel } from "../components/ui/v2Styles"
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
      <V2PageHero
        id="services-hero"
        eyebrow="Services"
        title="Practical web development, WordPress, SEO and technical support."
        subtitle="I help small businesses, agencies, and independent professionals fix website problems, improve performance, launch better pages, and build reliable digital systems."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/?type=not-sure#contact" className={v2PrimaryButton}>
            Request a quote
          </Link>
          <Link
            to="/services/emergency-website-help"
            className={v2SecondaryButton}
          >
            View emergency help
          </Link>
        </div>
      </V2PageHero>

      <div className="container mx-auto max-w-6xl space-y-20 px-6 py-16 md:py-20">
        <FeaturedServices />

        <section aria-labelledby="all-services-heading">
          <V2SectionHead
            titleId="all-services-heading"
            label="Full catalog"
            title="Browse every service by category."
            copy="Each service is scoped clearly so you know exactly what you are asking for before we start."
          />
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
          <V2SectionHead
            titleId="how-i-work-heading"
            label="How I work"
            title="Clear scope before any code."
          />
          <ol className="grid gap-4 md:grid-cols-3">
            {howIWorkSteps.map((step, index) => (
              <li key={step.title} className={`${v2Panel} p-6`}>
                <span
                  className="font-mono text-xs font-black tracking-[0.08em] text-[var(--v2-acid)]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 mt-6 text-lg font-bold tracking-tight text-[var(--v2-text)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--v2-muted)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="related-proof-heading">
          <div className={`${v2Panel} p-8`}>
            <h2
              id="related-proof-heading"
              className="m-0 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)] md:text-3xl"
            >
              Proof and related projects
            </h2>
            <p className="mt-3 mb-6 max-w-2xl text-lg text-[var(--v2-muted)]">
              See how these services show up in real client work across WordPress,
              Next.js, and internal tools.
            </p>
            <Link
              to="/#projects"
              className="inline-flex rounded-sm font-bold text-[var(--v2-brand)] transition-transform hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-x-0"
            >
              View portfolio projects →
            </Link>
          </div>
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
