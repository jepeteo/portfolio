import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { TrendingUp, Target, Coffee, Heart, Star } from "lucide-react"

interface SkillCardProps {
  skill: {
    name: string
    level: number
    experience: string
    experienceYears: number
    icon: string
    trend: "up" | "stable" | "down"
    description: string
    mastery: string
  }
  index: number
  isVisible: boolean
  hoveredSkill: string | null
  onHover: (skillName: string | null) => void
  mobile?: boolean
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  index,
  isVisible,
  hoveredSkill,
  onHover,
  mobile = false,
}) => {
  const { isDark } = useTheme()
  const isHovered = hoveredSkill === skill.name

  const getMasteryIcon = (level: number) => {
    if (level >= 90) return <Heart className="w-4 h-4 text-red-500" />
    if (level >= 80) return <Star className="w-4 h-4 text-yellow-500" />
    return <Coffee className="w-4 h-4 text-blue-500" />
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-emerald-500" />
      case "down":
        return <TrendingUp className="w-3 h-3 text-orange-500 rotate-180" />
      default:
        return <Target className="w-3 h-3 text-slate-400" />
    }
  }

  return (
    <div
      className="group"
      onMouseEnter={() => !mobile && onHover(skill.name)}
      onMouseLeave={() => !mobile && onHover(null)}
    >
      <div
        className={`relative transition-all duration-500 cursor-pointer backdrop-blur-sm ${
          mobile
            ? `p-4 rounded-xl border ${
                isDark
                  ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                  : "bg-white/30 border-slate-200/50 hover:bg-white/50 hover:shadow-md"
              }`
            : `p-6 rounded-2xl border ${
                isDark
                  ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
                  : "bg-white/30 border-slate-200/50 hover:bg-white/50 hover:border-slate-300/50 hover:shadow-lg"
              }`
        } ${isHovered && !mobile ? "scale-[1.01] shadow-xl" : ""}`}
        style={{
          animationDelay: `${index * 100}ms`,
          backdropFilter: "blur(12px)",
        }}
        onClick={() => mobile && onHover(isHovered ? null : skill.name)}
      >
        {mobile ? (
          // Compact mobile layout
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-2xl block">{skill.icon}</span>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    {getMasteryIcon(skill.level)}
                  </div>
                </div>
                <div>
                  <h4
                    className={`font-bold text-base ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {skill.name}
                  </h4>
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {skill.mastery}
                  </span>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  skill.level >= 90
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : skill.level >= 80
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {skill.level}%
              </span>
            </div>

            {/* Compact progress bar */}
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                isDark ? "bg-slate-700/50" : "bg-slate-200/50"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  skill.level >= 90
                    ? "bg-gradient-to-r from-red-400 to-red-500"
                    : skill.level >= 80
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                }`}
                style={{
                  width: isVisible ? `${skill.level}%` : "0%",
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            </div>

            {/* Expandable description for mobile */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isHovered ? "max-h-32 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`pt-3 border-t ${
                  isDark ? "border-slate-700/50" : "border-slate-200/50"
                }`}
              >
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {skill.description}
                </p>
                <div className={`mt-2 text-xs font-medium ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  {skill.experience}
                </div>
              </div>
            </div>

            {/* Tap to expand hint */}
            {!isHovered && (
              <div className={`text-center mt-2 text-xs opacity-60 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Tap to learn more
              </div>
            )}
          </>
        ) : (
          // Desktop layout (existing)
          <>
            {/* Header with personal touch */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="text-3xl block">{skill.icon}</span>
                  <div className="absolute -bottom-1 -right-1">
                    {getMasteryIcon(skill.level)}
                  </div>
                </div>
                <div>
                  <h4
                    className={`font-bold text-xl ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {skill.name}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(skill.trend)}
              </div>
            </div>

            {/* Mastery level with personality */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {skill.mastery}
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    skill.level >= 90
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : skill.level >= 80
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {skill.level}%
                </span>
              </div>

              {/* Beautiful progress visualization */}
              <div
                className={`w-full h-3 rounded-full overflow-hidden ${
                  isDark ? "bg-slate-700/50" : "bg-slate-200/50"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-1500 ease-out ${
                    skill.level >= 90
                      ? "bg-gradient-to-r from-red-400 via-pink-400 to-red-500"
                      : skill.level >= 80
                      ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500"
                      : "bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500"
                  }`}
                  style={{
                    width: isVisible ? `${skill.level}%` : "0%",
                    transitionDelay: `${index * 150}ms`,
                  }}
                />
              </div>
            </div>

            {/* Story on hover */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isHovered ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`pt-4 border-t ${
                  isDark ? "border-slate-700/50" : "border-slate-200/50"
                }`}
              >
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {skill.description}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SkillCard
