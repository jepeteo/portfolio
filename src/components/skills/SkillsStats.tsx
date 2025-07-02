import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { Coffee, Heart, Star } from "lucide-react"

interface SkillsStatsProps {
  totalSkills: number
  masteredSkills: number
  proficientSkills: number
}

const SkillsStats: React.FC<SkillsStatsProps> = ({
  totalSkills,
  masteredSkills,
  proficientSkills,
}) => {
  const { isDark } = useTheme()

  return (
    <div
      className={`p-6 rounded-2xl backdrop-blur-sm border ${
        isDark
          ? "bg-slate-800/30 border-slate-700/50"
          : "bg-white/30 border-slate-200/50"
      }`}
    >
      <h4
        className={`font-bold text-lg mb-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        My Journey So Far
      </h4>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm flex items-center gap-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <Coffee className="w-4 h-4" />
            Technologies learned
          </span>
          <span
            className={`font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {totalSkills}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm flex items-center gap-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <Heart className="w-4 h-4" />
            Mastered with love
          </span>
          <span className="font-bold text-red-500">{masteredSkills}</span>
        </div>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm flex items-center gap-2 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <Star className="w-4 h-4" />
            Proficiently using
          </span>
          <span className="font-bold text-yellow-500">{proficientSkills}</span>
        </div>
      </div>
    </div>
  )
}

export default SkillsStats
