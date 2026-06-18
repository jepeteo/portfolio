import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock } from "lucide-react"
import type { ServiceItem } from "../../content/services"
import { mapServiceIdToRequestType } from "../../content/services"
import { useMotionConfig } from "../../hooks/useMotionConfig"

type ServiceCardProps = {
  service: ServiceItem
  compact?: boolean
  index?: number
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  compact = false,
  index = 0,
}) => {
  const requestType = mapServiceIdToRequestType(service.id)
  const contactHref = `/?type=${requestType}#contact`
  const { stagger } = useMotionConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: stagger(index) }}
      viewport={{ once: true, margin: "-40px" }}
      className="h-full"
    >
      <article
        className={`group flex h-full flex-col rounded-3xl border bg-[var(--v2-panel)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--v2-acid)]/40 ${
          service.featured && !compact
            ? "border-[var(--v2-acid)]/40"
            : "border-[var(--v2-line)]"
        } motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
      >
        {(service.emergency || (service.featured && !compact)) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {service.emergency && (
              <span className="rounded-full border border-[var(--v2-line)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--v2-acid)]">
                Urgent
              </span>
            )}
            {service.featured && !compact && (
              <span className="rounded-full border border-[var(--v2-line)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--v2-muted)]">
                Featured
              </span>
            )}
          </div>
        )}

        <h3 className="mb-2 flex items-start gap-1.5 text-lg font-bold tracking-tight text-[var(--v2-text)]">
          {service.title}
          <ArrowUpRight
            className="mt-1 h-4 w-4 flex-none text-[var(--v2-soft)] transition-colors group-hover:text-[var(--v2-acid)]"
            aria-hidden="true"
          />
        </h3>

        <p className="mb-4 flex-grow text-sm leading-relaxed text-[var(--v2-muted)]">
          {service.shortDescription}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {service.priceLabel && (
              <span className="whitespace-nowrap rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-3 py-1.5 text-sm font-bold text-[var(--v2-text)]">
                {service.priceLabel}
              </span>
            )}
            {service.deliveryLabel && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--v2-soft)]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {service.deliveryLabel}
              </span>
            )}
          </div>

          <Link
            to={contactHref}
            className="inline-flex rounded-sm text-sm font-bold text-[var(--v2-brand)] transition-transform group-hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          >
            Ask about this →
          </Link>
        </div>
      </article>
    </motion.div>
  )
}

export default ServiceCard
