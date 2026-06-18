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
        "rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] transition-all duration-300",
        interactive &&
          "hover:-translate-y-0.5 hover:border-[var(--v2-acid)]/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        accent === "left" &&
          "border-l-4 border-l-transparent hover:border-l-[var(--v2-acid)]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default SurfaceCard
