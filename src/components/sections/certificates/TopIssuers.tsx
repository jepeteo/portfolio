import React from "react"
import { Building, TrendingUp } from "lucide-react"
import { CertificateStats } from "../../../hooks/useCertificatesData"
import { cn } from "../../../utils/styles"

interface TopIssuersProps {
  stats: CertificateStats
  isDark: boolean
}

export const TopIssuers: React.FC<TopIssuersProps> = ({ stats }) => {
  const topIssuers = Object.entries(stats.byIssuer)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)

  return (
    <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight text-[var(--v2-text)]">
        <Building className="h-5 w-5 text-[var(--v2-acid)]" aria-hidden="true" />
        Top learning providers
      </h3>

      <div className="space-y-3">
        {topIssuers.map(([issuer, count], index) => (
          <div
            key={issuer}
            className="flex items-center justify-between rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                  index === 0
                    ? "bg-[var(--v2-acid)] text-[var(--v2-acid-ink)]"
                    : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)]"
                )}
              >
                {index + 1}
              </div>

              <span className="font-medium text-[var(--v2-muted)]">
                {issuer}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--v2-text)]">{count}</span>
              <span className="text-sm text-[var(--v2-soft)]">certs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CertificationTimelineProps {
  stats: CertificateStats
  isDark: boolean
}

export const CertificationTimeline: React.FC<CertificationTimelineProps> = ({
  stats,
}) => {
  const yearData = Object.entries(stats.byYear)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .slice(0, 5)

  const maxCount = Math.max(...yearData.map(([, count]) => count))

  return (
    <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight text-[var(--v2-text)]">
        <TrendingUp
          className="h-5 w-5 text-[var(--v2-acid)]"
          aria-hidden="true"
        />
        Learning activity
      </h3>

      <div className="space-y-4">
        {yearData.map(([year, count]) => (
          <div key={year} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--v2-muted)]">{year}</span>
              <span className="font-bold text-[var(--v2-text)]">
                {count} certificates
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-[var(--v2-line)]">
              <div
                className="h-full rounded-full bg-[var(--v2-acid)] transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
