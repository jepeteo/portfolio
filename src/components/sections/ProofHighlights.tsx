import React from "react"
import { Link } from "react-router-dom"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import { site } from "../../config/site"
import { certificateStats } from "../../content/certificateModel"

const ProofHighlights: React.FC = () => {
  const certTotal = certificateStats().total
  const stats = [
    { value: site.stats.yearsExperienceLabel, label: "Years experience" },
    { value: site.stats.projectCountLabel, label: "Projects delivered" },
    { value: site.stats.clientCountLabel, label: "Clients served" },
    { value: String(certTotal), label: "Public certificates" },
  ]

  return (
    <MotionSection
      id="proof"
      aria-labelledby="proof-heading"
      className="relative py-16 md:py-20"
    >
      <div className="container relative mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="proof-heading"
          label="Proof"
          title="Full-stack range, one owner."
          copy="Frontend, WordPress, hosting, DNS, email and technical SEO in one practical workflow. Berlin-based, remote across Europe."
        />

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                {stat.label}
              </dt>
              <dd
                className="mt-2 font-display text-4xl font-black tracking-tight text-[var(--v2-text)]"
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--v2-muted)]">
          <li>WordPress / WooCommerce</li>
          <li>Infrastructure and DNS</li>
          <li>{site.location.label}</li>
          <li>
            <a
              href={site.social.github}
              className="underline-offset-4 hover:text-[var(--v2-acid)] hover:underline"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={site.social.linkedin}
              className="underline-offset-4 hover:text-[var(--v2-acid)] hover:underline"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <Link
              to="/certifications"
              className="underline-offset-4 hover:text-[var(--v2-acid)] hover:underline"
            >
              Verified certificates
            </Link>
          </li>
        </ul>
      </div>
    </MotionSection>
  )
}

export default ProofHighlights
