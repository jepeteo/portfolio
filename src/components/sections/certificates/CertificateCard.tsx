import React from "react"
import {
  Calendar,
  ExternalLink,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { ModernCertificate } from "../../../hooks/useCertificatesData"
import SurfaceCard from "../../ui/SurfaceCard"

interface CertificateCardProps {
  certificate: ModernCertificate
  isDark: boolean
  isExpanded: boolean
  onToggleExpanded: () => void
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  isExpanded,
  onToggleExpanded,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <SurfaceCard interactive className="group relative overflow-hidden">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-bold tracking-tight text-[var(--v2-text)] transition-colors group-hover:text-[var(--v2-acid)]">
              {certificate.title}
            </h3>

            <div className="mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-[var(--v2-soft)]" aria-hidden="true" />
              <span className="font-semibold text-[var(--v2-muted)]">
                {certificate.issuer}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-1.5">
              <Calendar
                className="h-4 w-4 text-[var(--v2-soft)]"
                aria-hidden="true"
              />
              <span className="text-sm text-[var(--v2-muted)]">
                {formatDate(certificate.date)}
              </span>
            </div>
          </div>

          <div className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--v2-muted)]">
            {certificate.level || "Intermediate"}
          </div>
        </div>

        {certificate.verified && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/15 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-[var(--v2-ok)]" />
              <span className="text-xs font-semibold text-[var(--v2-ok)]">
                Verified
              </span>
            </div>
          </div>
        )}

        {certificate.description && (
          <p className="mb-4 leading-relaxed text-[var(--v2-muted)]">
            {certificate.description}
          </p>
        )}

        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--v2-muted)]">
              <Users className="h-4 w-4" aria-hidden="true" />
              Skills covered
            </h4>
            <div className="flex flex-wrap gap-2">
              {certificate.skills
                .slice(0, isExpanded ? undefined : 6)
                .map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-3 py-1 text-sm font-medium text-[var(--v2-muted)]"
                  >
                    {skill}
                  </span>
                ))}
              {!isExpanded && certificate.skills.length > 6 && (
                <span className="px-3 py-1 text-sm text-[var(--v2-soft)]">
                  +{certificate.skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="space-y-4">
            {certificate.credentialId && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-[var(--v2-muted)]">
                  Credential ID
                </h4>
                <p className="font-mono text-sm text-[var(--v2-soft)]">
                  {certificate.credentialId}
                </p>
              </div>
            )}

            {certificate.duration && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-[var(--v2-muted)]">
                  Duration
                </h4>
                <p className="text-sm text-[var(--v2-soft)]">
                  {certificate.duration}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onToggleExpanded}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-4 py-2 text-sm font-medium text-[var(--v2-text)] transition-colors hover:border-[var(--v2-acid)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                Show more
              </>
            )}
          </button>

          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--v2-acid)] px-4 py-2 text-sm font-bold text-[var(--v2-acid-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-acid)] motion-reduce:hover:translate-y-0"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View certificate
            </a>
          )}
        </div>
      </div>
    </SurfaceCard>
  )
}
