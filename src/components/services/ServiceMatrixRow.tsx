import React, { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import type { ServiceItem } from "../../content/services"
import { mapServiceIdToRequestType } from "../../content/services"
import { serviceLandingPath } from "../../content/serviceLandings"
import useReducedMotion from "../../hooks/useReducedMotion"

type ServiceMatrixRowProps = {
  service: ServiceItem
  index: number
}

const ServiceMatrixRow: React.FC<ServiceMatrixRowProps> = ({
  service,
  index,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const hasDetail = Boolean(service.matrixDetail)
  const contactHref = `/?type=${mapServiceIdToRequestType(service.id)}#contact`
  const landingPath = serviceLandingPath(service.id)

  return (
    <li className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)]">
      <div
        className="grid grid-cols-[auto_1fr] items-center gap-4 p-5 sm:grid-cols-[5rem_1fr_auto] sm:gap-5"
        onMouseEnter={() => hasDetail && setExpanded(true)}
        onMouseLeave={() => hasDetail && setExpanded(false)}
        onFocus={() => hasDetail && setExpanded(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setExpanded(false)
          }
        }}
      >
        <span className="font-mono text-xs font-black uppercase tracking-[0.08em] text-[var(--v2-acid)]">
          SVC.{String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <div className="group block rounded-xl">
            <h3 className="m-0 text-lg font-bold tracking-tight text-[var(--v2-text)]">
              {service.matrixCommand ? (
                <>
                  <span className="font-mono text-sm text-[var(--v2-soft)]">
                    {service.matrixCommand}
                  </span>
                  <span className="mt-1 block text-base text-[var(--v2-text)]">
                    {service.title}
                  </span>
                </>
              ) : (
                service.title
              )}
            </h3>
            <p className="m-0 mt-1 text-sm text-[var(--v2-muted)]">
              {service.shortDescription}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
              {landingPath ? (
                <Link
                  to={landingPath}
                  className="text-[var(--v2-text)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                >
                  Learn more
                </Link>
              ) : null}
              <Link
                to={contactHref}
                className="text-[var(--v2-brand)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
              >
                Ask about this →
              </Link>
            </div>
          </div>
        </div>

        {service.priceLabel ? (
          <span className="justify-self-start whitespace-nowrap rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-3 py-2 text-sm font-bold text-[var(--v2-text)] sm:justify-self-end">
            {service.priceLabel}
          </span>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {expanded && service.matrixDetail ? (
          <motion.div
            id={`service-detail-${service.id}`}
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: "easeOut" }
            }
            className="overflow-hidden border-t border-[var(--v2-line)]"
          >
            <dl className="grid gap-3 p-5 pt-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--v2-soft)]">
                  Typical problem
                </dt>
                <dd className="mt-1 text-[var(--v2-muted)]">
                  {service.matrixDetail.typicalProblem}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--v2-soft)]">
                  What I check
                </dt>
                <dd className="mt-1 text-[var(--v2-muted)]">
                  {service.matrixDetail.whatICheck}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--v2-soft)]">
                  What to send
                </dt>
                <dd className="mt-1 text-[var(--v2-muted)]">
                  {service.matrixDetail.whatToSend}
                </dd>
              </div>
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {service.matrixDetail ? (
        <div className="sr-only">
          <p>{service.matrixDetail.typicalProblem}</p>
          <p>{service.matrixDetail.whatICheck}</p>
          <p>{service.matrixDetail.whatToSend}</p>
        </div>
      ) : null}
    </li>
  )
}

export default ServiceMatrixRow
