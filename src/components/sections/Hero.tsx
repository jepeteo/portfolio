import React, { memo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Wrench } from "lucide-react"
import { useReducedMotion } from "../../utils/accessibilityOptimization"

const signals: { label: string; value: string }[] = [
  { label: "Experience", value: "18+ yrs" },
  { label: "Mode", value: "Remote" },
  { label: "Best for", value: "Fixes" },
  { label: "Approach", value: "Clear" },
]

const terminalLines = [
  { prompt: "$", text: "diagnose website_issue" },
  { text: "✓ forms checked" },
  { text: "✓ SEO risks mapped" },
  { text: "✓ DNS / email reviewed" },
  { text: "→ fixed quote before work starts" },
]

/**
 * Service-led hero with a "diagnostic console" panel.
 * Replaces the previous generic developer hero. LCP is the H1 text (no large
 * hero image), keeping first paint fast.
 */
const Hero: React.FC = memo(() => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="v2-grid-bg relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="container relative z-10">
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left: message */}
          <div className="min-w-0">
            <ul
              className="mb-7 flex flex-wrap gap-2"
              aria-label="Availability and focus"
            >
              <li className="inline-flex items-center gap-2 rounded-full border border-[var(--v2-acid)]/45 bg-[var(--v2-panel)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--v2-acid)]">
                <span
                  className={`h-2 w-2 rounded-full bg-[var(--v2-ok)] ${
                    prefersReducedMotion ? "" : "animate-soft-pulse"
                  }`}
                  aria-hidden="true"
                />
                Available for selected work
              </li>
              <li className="inline-flex items-center rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--v2-muted)]">
                Berlin · Remote Europe
              </li>
              <li className="inline-flex items-center rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--v2-muted)]">
                WordPress · Woo · React · DNS
              </li>
            </ul>

            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.6rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
            >
              Practical web systems for businesses that{" "}
              <span className="bg-[linear-gradient(120deg,var(--v2-brand),var(--v2-brand-2)_55%,var(--v2-acid))] bg-clip-text text-transparent">
                can&apos;t afford broken websites.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg text-[var(--v2-muted)] md:text-xl">
              I help small businesses and agencies fix, improve and ship websites
              with clear scope, clean implementation and no technical theatre.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#contact"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[var(--v2-acid)] px-6 py-3.5 font-bold tracking-tight text-[var(--v2-acid-ink)] shadow-[0_18px_48px_-12px_var(--v2-acid)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-acid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                Request a fix or quote
              </a>
              <Link
                to="/services"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-6 py-3.5 font-bold tracking-tight text-[var(--v2-text)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Browse services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: diagnostic console */}
          <aside
            aria-label="At a glance"
            className="relative overflow-hidden rounded-3xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] shadow-[var(--v2-shadow)] backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--v2-line)] px-5 py-4 font-mono text-xs text-[var(--v2-soft)]">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--v2-soft)]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--v2-soft)]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--v2-soft)]/70" />
              </span>
              <span>portfolio://service-console</span>
            </div>

            <div className="p-6">
              <div className="mb-5 flex items-center gap-4">
                <span
                  className="grid h-16 w-16 flex-none place-items-center rounded-2xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel-2)] font-mono text-xl font-black text-[var(--v2-acid)]"
                  aria-hidden="true"
                >
                  TM
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-lg font-bold tracking-tight text-[var(--v2-text)]">
                    Theodoros Mentis
                  </p>
                  <p className="m-0 text-sm text-[var(--v2-muted)]">
                    Senior full-stack developer — WordPress, WooCommerce, React,
                    technical SEO, hosting &amp; DNS.
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {signals.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 p-3.5"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                      {s.label}
                    </dt>
                    <dd className="m-0 mt-1.5 text-xl font-bold tracking-tight text-[var(--v2-text)]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div
                className="mt-4 overflow-hidden rounded-2xl border border-[var(--v2-line)] bg-[#020617] p-4 font-mono text-xs leading-relaxed text-[#d9f99d]"
                aria-label="How a typical engagement starts"
              >
                {terminalLines.map((line, i) => (
                  <div key={i}>
                    {line.prompt && (
                      <span className="text-[#7dd3fc]">{line.prompt} </span>
                    )}
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"
export default Hero
