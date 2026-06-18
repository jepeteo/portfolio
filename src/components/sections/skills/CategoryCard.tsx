import React from "react"
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
  const IconComponent = category.icon

  if (mobile) {
    return (
      <button
        onClick={() => onClick(categoryKey)}
        className={cn(
          "relative flex-shrink-0 rounded-xl px-3 py-2 text-left transition-all duration-300",
          isActive
            ? cn(
                "bg-gradient-to-br text-white shadow-lg ring-2 ring-white/20",
                category.gradient
              )
            : "border border-[var(--v2-line)] bg-[var(--v2-panel)]"
        )}
      >
        <div className="flex items-center gap-2">
          <IconComponent
            className={cn(
              "h-4 w-4 flex-shrink-0",
              isActive ? "text-white" : "text-[var(--v2-muted)]"
            )}
          />
          <div className="min-w-0">
            <div
              className={cn(
                "truncate text-sm font-semibold",
                isActive ? "text-white" : "text-[var(--v2-text)]"
              )}
            >
              {category.title}
            </div>
            <div
              className={cn(
                "text-xs",
                isActive ? "text-white/80" : "text-[var(--v2-soft)]"
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
        "group relative w-full overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        isActive
          ? cn(
              "bg-gradient-to-br text-white shadow-2xl ring-2 ring-white/20",
              category.gradient
            )
          : "border border-[var(--v2-line)] bg-[var(--v2-panel)] hover:border-[var(--v2-acid)]/40"
      )}
      aria-pressed={isActive}
    >
      <div className="relative z-10">
        <div className="mb-3 flex items-start gap-4">
          <IconWell icon={IconComponent} active={isActive} size="md" />
          <div className="flex-1">
            <h3
              className={cn(
                "text-lg font-bold tracking-tight",
                isActive ? "text-white" : "text-[var(--v2-text)]"
              )}
            >
              {category.title}
            </h3>
            <p
              className={cn(
                "text-sm",
                isActive ? "text-white/80" : "text-[var(--v2-muted)]"
              )}
            >
              {category.subtitle}
            </p>
          </div>
        </div>

        <p
          className={cn(
            "font-mono text-xs font-bold uppercase tracking-[0.08em]",
            isActive ? "text-white/70" : "text-[var(--v2-soft)]"
          )}
        >
          {category.skills.length} technologies
        </p>
      </div>
    </button>
  )
}

export default CategoryCard
