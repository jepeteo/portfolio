import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { LucideIcon } from "lucide-react"

interface CategoryCardProps {
  categoryKey: string
  category: {
    title: string
    subtitle: string
    icon: LucideIcon
    gradient: string
    skills: any[]
  }
  isActive: boolean
  onClick: (categoryKey: string) => void
  mobile?: boolean
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryKey,
  category,
  isActive,
  onClick,
  mobile = false,
}) => {
  const { isDark } = useTheme()
  const IconComponent = category.icon

  if (mobile) {
    return (
      <button
        onClick={() => onClick(categoryKey)}
        className={`relative flex-shrink-0 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
          isActive ? "ring-2 ring-white/20 shadow-lg" : "hover:shadow-md"
        }`}
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${category.gradient
                .replace("from-", "")
                .replace(" via-", ", ")
                .replace(" to-", ", ")})`
            : isDark
            ? "rgba(30, 41, 59, 0.5)"
            : "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center gap-2">
          <IconComponent
            className={`w-4 h-4 flex-shrink-0 ${
              isActive
                ? "text-white"
                : isDark
                ? "text-slate-300"
                : "text-slate-600"
            }`}
          />
          <div className="min-w-0">
            <div
              className={`text-sm font-semibold truncate ${
                isActive
                  ? "text-white"
                  : isDark
                  ? "text-slate-200"
                  : "text-slate-700"
              }`}
            >
              {category.title}
            </div>
            <div
              className={`text-xs opacity-80 ${
                isActive
                  ? "text-white"
                  : isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              {category.skills.length} skills
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(categoryKey)}
      className={`relative w-full p-6 rounded-2xl text-left transition-all duration-500 hover:scale-[1.02] group overflow-hidden ${
        isActive ? "ring-2 ring-white/20 shadow-2xl" : "hover:shadow-xl"
      }`}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${category.gradient
              .replace("from-", "")
              .replace(" via-", ", ")
              .replace(" to-", ", ")})`
          : isDark
          ? "rgba(30, 41, 59, 0.5)"
          : "rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isActive
                ? isDark
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-slate-700/20"
                : isDark
                ? "bg-slate-700"
                : "bg-slate-100"
            }`}
          >
            <IconComponent
              className={`w-6 h-6 ${
                isActive
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            />
          </div>
          <div className="flex-1">
            <h3
              className={`font-bold text-lg ${
                isActive
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : isDark
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {category.title}
            </h3>
            <p
              className={`text-sm ${
                isActive
                  ? isDark
                    ? "text-white/80"
                    : "text-slate-700"
                  : isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              {category.subtitle}
            </p>
          </div>
        </div>

        <p
          className={`text-sm leading-relaxed ${
            isActive
              ? isDark
                ? "text-white/70"
                : "text-slate-800"
              : isDark
              ? "text-slate-400"
              : "text-slate-600"
          }`}
        >
          {category.skills.length} technologies
        </p>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>
    </button>
  )
}

export default CategoryCard
