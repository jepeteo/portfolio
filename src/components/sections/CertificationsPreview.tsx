import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ExternalLink } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import {
  certificateStats,
  getFeaturedCertificates,
} from "../../content/certificateModel"
import { v2SecondaryButton } from "../ui/v2Styles"

const CertificationsPreview: React.FC = () => {
  const preview = getFeaturedCertificates()
  const total = certificateStats().total

  return (
    <MotionSection
      id="certificates-preview"
      aria-labelledby="certificates-preview-heading"
      className="v2-grid-bg relative py-16 md:py-20"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="certificates-preview-heading"
          label="Certifications"
          title={`${total} public certificates.`}
          copy="Featured and recent credentials. Every certificate stays on the dedicated archive — never dropped from the homepage by deletion."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((cert) => (
            <li
              key={cert.id}
              className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-5"
            >
              <p className="m-0 font-mono text-[11px] text-[var(--v2-soft)]">
                {cert.year} · {cert.issuer}
              </p>
              <h3 className="mt-2 text-base font-bold tracking-tight text-[var(--v2-text)]">
                {cert.title}
              </h3>
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--v2-brand)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Verify
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link to="/certifications" className={v2SecondaryButton}>
            View all certifications
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </MotionSection>
  )
}

export default CertificationsPreview
