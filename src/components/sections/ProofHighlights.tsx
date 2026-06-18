import React from "react"
import V2SectionHead from "../ui/V2SectionHead"

const cardBase =
  "relative overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 shadow-[0_18px_55px_-20px_rgba(0,0,0,0.35)] md:p-7"

const ProofHighlights: React.FC = () => {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="relative py-20 md:py-24"
    >
      <div className="container relative mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="proof-heading"
          label="Proof layer"
          title="Less decoration. More confidence."
          copy="Full-stack range across the parts of a website that actually break: code, WordPress, hosting, DNS, email and technical SEO — handled in one place."
        />

        <div className="grid auto-rows-[minmax(170px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            className={`${cardBase} lg:row-span-2 bg-[radial-gradient(circle_at_15%_20%,rgb(from_var(--v2-brand)_r_g_b/0.22),transparent_42%),radial-gradient(circle_at_90%_90%,rgb(from_var(--v2-brand-2)_r_g_b/0.2),transparent_44%),var(--v2-panel)]`}
          >
            <h3 className="m-0 max-w-md font-display text-2xl font-bold leading-tight tracking-tight text-[var(--v2-text)] md:text-3xl">
              Full-stack means fewer handoffs.
            </h3>
            <p className="mt-3 max-w-md text-[var(--v2-muted)]">
              Frontend, WordPress, PHP, React, hosting, DNS, email and technical
              SEO in one practical workflow — so problems get solved instead of
              passed around.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Core stack">
              {["WordPress", "WooCommerce", "React", "PHP", "DNS"].map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--v2-line)] px-2.5 py-1.5 font-mono text-[11px] font-bold text-[var(--v2-muted)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </article>

          <article className="relative overflow-hidden rounded-3xl border-0 bg-[var(--v2-acid)] p-6 text-[var(--v2-acid-ink)] shadow-[0_18px_55px_-20px_rgba(0,0,0,0.35)] md:p-7">
            <div className="font-display text-5xl font-black leading-none tracking-tight md:text-6xl">
              18+
            </div>
            <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight">
              Years building for real businesses.
            </h3>
          </article>

          <article className={cardBase}>
            <h3 className="m-0 text-xl font-bold tracking-tight text-[var(--v2-text)]">
              Emergency-ready
            </h3>
            <p className="mt-2 text-[var(--v2-muted)]">
              Broken forms, checkout issues, plugin conflicts, SSL, Outlook and
              DNS problems.
            </p>
          </article>

          <article className={cardBase}>
            <h3 className="m-0 text-xl font-bold tracking-tight text-[var(--v2-text)]">
              SEO-aware builds
            </h3>
            <p className="mt-2 text-[var(--v2-muted)]">
              Sitemaps, metadata, schema, redirects and migration risks handled
              before they cause damage.
            </p>
          </article>

          <article className={`${cardBase} sm:col-span-2`}>
            <h3 className="m-0 text-xl font-bold tracking-tight text-[var(--v2-text)]">
              From diagnosis to delivery
            </h3>
            <p className="mt-2 max-w-2xl text-[var(--v2-muted)]">
              You get a clear picture of the business problem, a scoped plan and
              a fixed quote before any work touches production — then the fix or
              build, explained in plain language.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ProofHighlights
