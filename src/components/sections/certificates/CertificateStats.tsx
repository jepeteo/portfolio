import React from "react"
import { Award, Calendar, Users, TrendingUp } from "lucide-react"
import { CertificateStats } from "../../../hooks/useCertificatesData"

interface CertificateStatsProps {
  stats: CertificateStats
  isDark: boolean
}

export const CertificateStatsComponent: React.FC<CertificateStatsProps> = ({
  stats,
}) => {
  const statItems = [
    {
      icon: Award,
      label: "Total Certificates",
      value: stats.total.toString(),
    },
    {
      icon: Calendar,
      label: "Recent (This Year)",
      value: stats.recentCount.toString(),
    },
    {
      icon: TrendingUp,
      label: "Categories",
      value: Object.keys(stats.byCategory).length.toString(),
    },
    {
      icon: Users,
      label: "Skills Covered",
      value: `${stats.totalSkills}+`,
    },
  ]

  return (
    <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="group rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <div className="mb-4 inline-flex rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] p-3 text-[var(--v2-acid)]">
            <item.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="font-display text-3xl font-bold tracking-tight text-[var(--v2-text)]">
            {item.value}
          </div>
          <div className="mt-2 text-sm font-medium text-[var(--v2-muted)]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
