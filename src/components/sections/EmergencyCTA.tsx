import React from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowRight } from "lucide-react"

const issues = [
  "WordPress critical errors",
  "Broken contact forms",
  "WooCommerce checkout issues",
  "DNS, email & SSL problems",
  "Plugin or update conflicts",
]

const EmergencyCTA: React.FC = () => {
  return (
    <section
      aria-labelledby="emergency-heading"
      className="relative py-12 md:py-16"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--v2-line-strong)] bg-[radial-gradient(circle_at_12%_20%,rgb(from_var(--v2-brand)_r_g_b/0.2),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(from_var(--v2-acid)_r_g_b/0.16),transparent_44%),var(--v2-panel)] p-7 shadow-[var(--v2-shadow)] md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--v2-acid)]">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Emergency help
              </p>
              <h2
                id="emergency-heading"
                className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[0.98] tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
              >
                Website broken or losing enquiries?
              </h2>
              <p className="mt-4 max-w-xl text-[var(--v2-muted)]">
                If something is down or costing you leads, I can help diagnose and
                fix it — fast turnaround when available, depending on scope. No
                guesswork, no surprise invoices.
              </p>

              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Common emergencies">
                {issues.map((issue) => (
                  <li
                    key={issue}
                    className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel)] px-3 py-1.5 text-xs font-semibold text-[var(--v2-muted)]"
                  >
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/services/emergency-website-help"
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--v2-acid)] px-6 py-3.5 text-center font-bold tracking-tight text-[var(--v2-acid-ink)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-acid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Get emergency help
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#contact"
                className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-6 py-3.5 text-center font-bold tracking-tight text-[var(--v2-text)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Describe the problem
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmergencyCTA
