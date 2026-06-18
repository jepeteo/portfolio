import React from "react"
import { LucideIcon } from "lucide-react"

interface CategoryHeaderProps {
  category: {
    title: string
    subtitle: string
    icon: LucideIcon
    gradient: string
    description: string
  }
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category }) => {
  const Icon = category.icon
  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] p-8">
      <div className="flex items-center gap-6">
        <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--v2-text)] md:text-3xl">
            {category.title}
          </h3>
          <p className="mt-1 text-[var(--v2-muted)]">{category.subtitle}</p>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-[var(--v2-muted)]">
        {category.description}
      </p>
    </div>
  )
}

export default CategoryHeader
