import React from "react"
import { cn } from "../../utils/styles"

type SurfaceCardElement = "div" | "article" | "a" | "button"

type SurfaceCardProps<T extends SurfaceCardElement = "div"> = {
  as?: T
  interactive?: boolean
  accent?: "none" | "left"
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">

const SurfaceCard = <T extends SurfaceCardElement = "div">({
  as,
  interactive = false,
  accent = "none",
  className,
  children,
  ...props
}: SurfaceCardProps<T>) => {
  const Component = (as ?? "div") as React.ElementType

  return (
    <Component
      className={cn(
        "rounded-2xl border transition-all duration-300",
        "bg-white border-slate-200/90 shadow-sm",
        "dark:bg-slate-800 dark:border-slate-600/70 dark:shadow-lg dark:shadow-black/30",
        interactive &&
          "hover:-translate-y-0.5 hover:border-blue-400/60 hover:shadow-md dark:hover:border-blue-500/50 dark:hover:bg-slate-700/90",
        accent === "left" &&
          "border-l-4 border-l-transparent hover:border-l-blue-500 dark:hover:border-l-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default SurfaceCard
