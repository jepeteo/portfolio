import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "../../utils/styles"

type IconWellProps = {
  icon: LucideIcon
  gradient?: string
  size?: "sm" | "md" | "lg"
  active?: boolean
  className?: string
}

const sizeClasses = {
  sm: { well: "w-9 h-9 rounded-lg", icon: "w-4 h-4" },
  md: { well: "w-12 h-12 rounded-xl", icon: "w-6 h-6" },
  lg: { well: "w-14 h-14 rounded-xl", icon: "w-7 h-7" },
}

const IconWell: React.FC<IconWellProps> = ({
  icon: Icon,
  gradient = "from-blue-500 to-purple-500",
  size = "md",
  active = false,
  className,
}) => {
  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        "flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
        sizes.well,
        active
          ? cn("bg-gradient-to-br text-white shadow-lg shadow-blue-500/20", gradient)
          : "border border-slate-200 bg-blue-50 text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-blue-300",
        className
      )}
    >
      <Icon className={sizes.icon} aria-hidden="true" />
    </div>
  )
}

export default IconWell
