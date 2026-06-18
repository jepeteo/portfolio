import React from "react"
import { Users, Activity, Briefcase, Code } from "lucide-react"
import { ExperienceStats } from "../../../hooks/useExperienceData"
import { Tooltip } from "../../ui/Tooltip"

interface StatItem {
  icon: React.ElementType
  label: string
  value: string
  tooltip?: string
}

interface ExperienceStatsProps {
  stats: ExperienceStats
  isDark: boolean
}

export const ExperienceStatsComponent: React.FC<ExperienceStatsProps> = ({
  stats,
}) => {
  const statItems: StatItem[] = [
    {
      icon: Activity,
      label: "Total Experience",
      value: `${stats.totalYears} Years`,
    },
    {
      icon: Briefcase,
      label: "Projects Delivered",
      value: `${stats.totalProjects}+`,
    },
    {
      icon: Users,
      label: "Clients Served",
      value: `${stats.totalClients}+`,
    },
    {
      icon: Code,
      label: "Technical Skills",
      value: "20+",
      tooltip:
        "WordPress, Laravel, React, Python, PHP, MySQL, Server Administration, and more",
    },
  ]

  const Card = ({ item }: { item: StatItem }) => (
    <div className="group rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
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
  )

  return (
    <div className="mb-12">
      <div className="mb-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {statItems.map((item, index) =>
          item.tooltip ? (
            <Tooltip key={index} content={item.tooltip}>
              <Card item={item} />
            </Tooltip>
          ) : (
            <Card key={index} item={item} />
          )
        )}
      </div>

      <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--v2-soft)]">
              Experience breakdown
            </div>
            <div className="text-lg font-bold text-[var(--v2-text)]">
              {stats.employmentYears}+ years employment • {stats.freelanceYears}+
              years freelance
            </div>
          </div>

          <div className="text-sm text-[var(--v2-muted)]">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" aria-hidden="true" />
              <span>
                Freelancing began {new Date(2011, 0).getFullYear()} and continues
                alongside employment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
