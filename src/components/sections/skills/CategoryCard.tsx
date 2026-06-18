import React from "react"
import { useTheme } from "../../../context/ThemeContext"
import { LucideIcon } from "lucide-react"
import { cn } from "../../../utils/styles"
import IconWell from "../../ui/IconWell"

interface CategoryCardProps {
  categoryKey: string
  category: {
    title: string
    subtitle: string
    icon: LucideIcon
    gradient: string
    skills: { name: string; level: number; yearsExperience?: number }[]
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
        className={cn(
          "relative flex-shrink-0 rounded-lg px-3 py-2 text-left transition-all duration-300",
          isActive
            ? cn("bg-gradient-to-br text-white shadow-lg ring-2 ring-white/20", category.gradient)
            : isDark
              ? "bg-slate-800/50 hover:shadow-md"
              : "bg-white/80 hover:shadow-md"
        )}
      >
        <div className="flex items-center gap-2">
          <IconComponent
            className={cn(
              "h-4 w-4 flex-shrink-0",
              isActive ? "text-white" : isDark ? "text-slate-300" : "text-slate-600"
            )}
          />
          <div className="min-w-0">
            <div
              className={cn(
                "truncate text-sm font-semibold",
                isActive ? "text-white" : isDark ? "text-slate-200" : "text-slate-700"
              )}
            >
              {category.title}
            </div>
            <div
              className={cn(
                "text-xs opacity-80",
                isActive ? "text-white" : isDark ? "text-slate-400" : "text-slate-600"
              )}
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
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 hover:scale-[1.02]",
        isActive
          ? cn("bg-gradient-to-br text-white shadow-2xl ring-2 ring-white/20", category.gradient)
          : isDark
            ? "bg-slate-800/50 hover:shadow-xl"
            : "bg-white/50 hover:shadow-xl"
      )}
    >
      <div className="relative z-10">
        <div className="mb-3 flex items-start gap-4">
          {isActive ? (
            <IconWell icon={IconComponent} active size="md" />
          ) : (
            <IconWell icon={IconComponent} size="md" />
          )}
          <div className="flex-1">
            <h3
              className={cn(
                "text-lg font-bold",
                isActive ? "text-white" : isDark ? "text-white" : "text-slate-900"
              )}
            >
              {category.title}
            </h3>
            <p
              className={cn(
                "text-sm",
                isActive
                  ? "text-white/80"
                  : isDark
                    ? "text-slate-400"
                    : "text-slate-600"
              )}
            >
              {category.subtitle}
            </p>
          </div>
        </div>

        <p
          className={cn(
            "text-sm leading-relaxed",
            isActive
              ? "text-white/70"
              : isDark
                ? "text-slate-400"
                : "text-slate-600"
          )}
        >
          {category.skills.length} technologies
        </p>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>
    </button>
  )
}

export default CategoryCard
