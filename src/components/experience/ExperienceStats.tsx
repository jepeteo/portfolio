import React from "react"
import { Users, Award, Activity, Briefcase, Clock } from "lucide-react"
import { ExperienceStats } from "../../hooks/useExperienceData"

interface StatItem {
  icon: React.ElementType
  label: string
  value: string
  color: string
  tooltip?: string
}

interface ExperienceStatsProps {
  stats: ExperienceStats
  isDark: boolean
}

export const ExperienceStatsComponent: React.FC<ExperienceStatsProps> = ({
  stats,
  isDark,
}) => {
  const statItems: StatItem[] = [
    {
      icon: Activity,
      label: "Total Experience",
      value: `${stats.totalYears}+`,
      color: "from-blue-500 to-cyan-500",
      tooltip: `Total professional experience (employment and freelance)`,
    },
    {
      icon: Briefcase,
      label: "Projects Delivered",
      value: `${stats.totalProjects}+`,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      label: "Clients Served",
      value: `${stats.totalClients}+`,
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Award,
      label: "Current Roles",
      value: stats.currentRoles.toString(),
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="mb-12">
      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
              isDark
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white/70 border border-slate-200/50"
            } backdrop-blur-sm`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            <div className="relative">
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}
              >
                <item.icon className="w-6 h-6" />
              </div>

              <div
                className={`text-3xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {item.value}
              </div>

              <div
                className={`text-sm font-medium ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {item.label}
              </div>

              {item.tooltip && (
                <div className="mt-2 hidden group-hover:block absolute bottom-full left-0 w-64 p-2 bg-black/80 text-white text-xs rounded-md z-10">
                  {item.tooltip}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Employment breakdown */}
      <div
        className={`rounded-xl p-5 ${
          isDark
            ? "bg-slate-800/30 border border-slate-700/30"
            : "bg-white/50 border border-slate-200/30"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div
              className={`text-sm font-medium mb-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Experience Breakdown
            </div>
            <div
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {stats.employmentYears}+ years employment • {stats.freelanceYears}
              + years freelance
            </div>
          </div>

          <div
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span>
                Freelancing began {new Date(2011, 0).getFullYear()} and
                continues alongside employment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
