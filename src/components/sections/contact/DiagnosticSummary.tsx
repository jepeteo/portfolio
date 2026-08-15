import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { RequestType } from "../../../content/services"
import { getContactDiagnostic } from "../../../content/contactDiagnostics"
import useReducedMotion from "../../../hooks/useReducedMotion"

type DiagnosticSummaryProps = {
  requestType: string
}

const DiagnosticSummary: React.FC<DiagnosticSummaryProps> = ({
  requestType,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const diagnostic = requestType
    ? getContactDiagnostic(requestType as RequestType)
    : undefined

  return (
    <AnimatePresence mode="wait">
      {diagnostic ? (
        <motion.aside
          key={diagnostic.requestType}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          className="rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 p-4"
          aria-label="Diagnostic summary for your request type"
        >
          <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--v2-acid)]">
            Diagnostic summary
          </p>
          <h3 className="mt-2 text-base font-bold text-[var(--v2-text)]">
            {diagnostic.title}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--v2-soft)]">
                What to send
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--v2-muted)]">
                {diagnostic.whatToSend.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--v2-acid)]" aria-hidden="true">
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--v2-soft)]">
                What you get back
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--v2-muted)]">
                {diagnostic.whatYouGet.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--v2-ok)]" aria-hidden="true">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-xs text-[var(--v2-soft)]">
            Send your URL, describe symptoms, mention any deadline. I reply with
            scope, access needs, and a clear quote before production changes.
          </p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}

export default DiagnosticSummary
