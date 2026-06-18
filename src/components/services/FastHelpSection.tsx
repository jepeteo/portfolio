import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { getFastHelpServices, mapServiceIdToRequestType } from "../../content/services"

const FastHelpSection: React.FC = () => {
  const services = getFastHelpServices()

  return (
    <section
      id="fast-help"
      aria-labelledby="fast-help-heading"
      className="v2-grid-bg relative py-20 md:py-24"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="fast-help-heading"
          label="Service matrix"
          title="Offers with names, prices and intent."
          copy="Common, well-scoped work with starting prices. Pick the closest match — the contact form opens pre-filled so you can describe the rest."
        />

        <ul className="grid gap-3">
          {services.map((service, index) => (
            <li key={service.id}>
              <Link
                to={`/?type=${mapServiceIdToRequestType(service.id)}#contact`}
                className="group grid grid-cols-[auto_1fr] items-center gap-4 rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-5 transition-all duration-200 hover:translate-x-1 hover:border-[var(--v2-acid)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-x-0 sm:grid-cols-[5rem_1fr_auto] sm:gap-5"
              >
                <span className="font-mono text-xs font-black uppercase tracking-[0.08em] text-[var(--v2-acid)]">
                  SVC.{String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 flex items-center gap-1.5 text-lg font-bold tracking-tight text-[var(--v2-text)]">
                    {service.title}
                    <ArrowUpRight
                      className="h-4 w-4 flex-none text-[var(--v2-soft)] transition-colors group-hover:text-[var(--v2-acid)]"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="m-0 mt-1 text-sm text-[var(--v2-muted)]">
                    {service.shortDescription}
                  </p>
                </div>
                {service.priceLabel ? (
                  <span className="justify-self-start whitespace-nowrap rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-3 py-2 text-sm font-bold text-[var(--v2-text)] sm:justify-self-end">
                    {service.priceLabel}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/services"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--v2-acid)] px-6 py-3 font-bold tracking-tight text-[var(--v2-acid-ink)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-acid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            View all services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/services/emergency-website-help"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-6 py-3 font-bold tracking-tight text-[var(--v2-text)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Get emergency help
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FastHelpSection
