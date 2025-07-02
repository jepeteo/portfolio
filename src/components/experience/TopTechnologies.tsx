import React from "react"
import { ExperienceStats } from "../../hooks/useExperienceData"

interface TopTechnologiesProps {
  stats: ExperienceStats
  isDark: boolean
}

export const TopTechnologies: React.FC<TopTechnologiesProps> = ({
  stats,
  isDark,
}) => {
  return (
    <div
      className={`rounded-2xl p-6 ${
        isDark
          ? "bg-slate-800/50 border border-slate-700/50"
          : "bg-white/70 border border-slate-200/50"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Most Used Technologies
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.topTechnologies.map((tech, index) => (
          <div
            key={tech}
            className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${
              isDark ? "bg-slate-700/50" : "bg-slate-100/50"
            }`}
          >
            {/* Ranking indicator */}
            <div
              className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0
                  ? "bg-yellow-500 text-white"
                  : index === 1
                  ? "bg-slate-400 text-white"
                  : index === 2
                  ? "bg-orange-400 text-white"
                  : isDark
                  ? "bg-slate-600 text-slate-300"
                  : "bg-slate-300 text-slate-600"
              }`}
            >
              {index + 1}
            </div>

            <div
              className={`font-semibold text-sm ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {tech}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
