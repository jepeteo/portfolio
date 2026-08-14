import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import { getFastHelpServiceWithMatrix } from "../../content/services"
import ServiceMatrixRow from "./ServiceMatrixRow"

const FastHelpSection: React.FC = () => {
  const services = getFastHelpServiceWithMatrix()

  return (
    <MotionSection
      id="fast-help"
      aria-labelledby="fast-help-heading"
      className="v2-grid-bg relative py-20 md:py-24"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="fast-help-heading"
          label="Service matrix"
          title="What needs fixing?"
          copy="Common, well-scoped work with starting prices. Pick the closest match. The contact form opens pre-filled so you can describe the rest."
        />

        <ul className="grid gap-3">
          {services.map((service, index) => (
            <ServiceMatrixRow key={service.id} service={service} index={index} />
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
    </MotionSection>
  )
}

export default FastHelpSection
