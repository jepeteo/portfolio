import React from "react"
import { useTheme } from "../../context/ThemeContext"
import { cn } from "../../utils/styles"

type SectionShellProps = {
  id: string
  title: string
  subtitle?: string
  eyebrow?: string
  variant?: "default" | "muted"
  className?: string
  children: React.ReactNode
}

const SectionShell: React.FC<SectionShellProps> = ({
  id,
  title,
  subtitle,
  eyebrow,
  variant = "default",
  className,
  children,
}) => {
  const { isDark } = useTheme()

  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-24 transition-colors duration-300",
        variant === "muted"
          ? isDark
            ? "bg-slate-950"
            : "bg-slate-50"
          : isDark
            ? "bg-slate-900"
            : "bg-white",
        className
      )}
    >
      <div className="container max-w-6xl mx-auto px-6">
        <header className="mb-12 md:mb-16 text-center md:text-left">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-500">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              "font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className={cn(
                "mt-4 max-w-2xl text-lg leading-relaxed",
                isDark ? "text-slate-300" : "text-slate-600",
                "mx-auto md:mx-0"
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  )
}

export default SectionShell
