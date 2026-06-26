import React from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { routeMeta, absoluteUrl } from "../config/routeMeta.js"
import {
  getServiceLanding,
  getLandingService,
} from "../content/serviceLandings"
import { getServiceById } from "../content/services"
import V2PageHero from "../components/ui/V2PageHero"
import V2SectionHead from "../components/ui/V2SectionHead"
import ServiceCard from "../components/services/ServiceCard"
import EmergencyHelpCTA from "../components/services/EmergencyHelpCTA"
import { v2Panel } from "../components/ui/v2Styles"

const ServiceLandingPage: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>()
  const landing = serviceSlug ? getServiceLanding(serviceSlug) : undefined
  const service = serviceSlug ? getLandingService(serviceSlug) : undefined

  if (!landing || !service) {
    return <Navigate to="/services" replace />
  }

  const canonicalPath = `/services/${landing.slug}`
  const meta = routeMeta[canonicalPath]
  const canonical = absoluteUrl(canonicalPath)

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

  const relatedServices = landing.relatedServiceIds
    .map((id) => getServiceById(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)

  const contactHref = `/?type=${landing.requestType}#contact`

  return (
    <div>
      <V2PageHero
        id={`${landing.slug}-hero`}
        eyebrow={landing.eyebrow}
        title={landing.heroTitle}
        subtitle={landing.heroSubtitle}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={contactHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--v2-acid)] px-6 py-3 font-bold tracking-tight text-[var(--v2-acid-ink)]"
          >
            Request a quote
          </Link>
          <Link
            to="/services"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-6 py-3 font-bold tracking-tight text-[var(--v2-text)]"
          >
            View all services
          </Link>
        </div>
      </V2PageHero>

      <div className="container mx-auto max-w-6xl space-y-16 px-6 py-16 md:py-20">
        <section aria-labelledby={`${landing.slug}-symptoms-heading`}>
          <V2SectionHead
            titleId={`${landing.slug}-symptoms-heading`}
            label="Symptoms"
            title="Common problems this service covers."
          />
          <ul className="flex flex-wrap gap-2.5">
            {landing.symptoms.map((symptom) => (
              <li
                key={symptom}
                className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel)] px-4 py-2 text-sm font-medium text-[var(--v2-muted)]"
              >
                {symptom}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`${landing.slug}-process-heading`}>
          <V2SectionHead
            titleId={`${landing.slug}-process-heading`}
            label="Process"
            title="How it works."
          />
          <ol className="grid gap-3 sm:grid-cols-2">
            {landing.processSteps.map((step, index) => (
              <li key={step} className={`${v2Panel} flex gap-4 p-5`}>
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

        <section aria-labelledby={`${landing.slug}-pricing-heading`}>
          <V2SectionHead
            titleId={`${landing.slug}-pricing-heading`}
            label="Pricing"
            title={service.title}
            copy="Final pricing depends on scope — I confirm a fixed quote before any work begins."
          />
          <ServiceCard service={service} index={0} />
        </section>

        {relatedServices.length > 0 ? (
          <section aria-labelledby={`${landing.slug}-related-heading`}>
            <V2SectionHead
              titleId={`${landing.slug}-related-heading`}
              label="Related"
              title="Often requested together."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {relatedServices.map((related, index) => (
                <ServiceCard
                  key={related.id}
                  service={related}
                  index={index}
                  compact
                />
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby={`${landing.slug}-needs-heading`}>
          <div className={`${v2Panel} p-8`}>
            <h2
              id={`${landing.slug}-needs-heading`}
              className="m-0 mb-6 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)] md:text-3xl"
            >
              What I need from you
            </h2>
            <ul className="space-y-3">
              {landing.whatINeed.map((item) => (
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
            className="rounded-sm text-sm font-bold text-[var(--v2-brand)] hover:underline"
          >
            View full service catalog →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ServiceLandingPage
