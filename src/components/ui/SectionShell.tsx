import React from "react"
import { cn } from "../../utils/styles"

type SectionShellProps = {
  id: string
  title: string
  subtitle?: string
  eyebrow?: string
  variant?: "default" | "muted"
  decoration?: "none" | "grid" | "gradient-orb"
  align?: "center" | "left"
  className?: string
  children: React.ReactNode
}

const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  (
    {
      id,
      title,
      subtitle,
      eyebrow,
      variant = "default",
      decoration = "none",
      align = "left",
      className,
      children,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "relative overflow-hidden py-20 transition-colors duration-300 md:py-24",
          variant === "muted"
            ? "bg-slate-50 dark:bg-slate-950/80"
            : "bg-white/80 dark:bg-slate-900/80",
          className
        )}
      >
        {decoration === "grid" && (
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.12)_1px,transparent_1px)]"
            aria-hidden="true"
          />
        )}
        {decoration === "gradient-orb" && (
          <>
            <div
              className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/15"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/15"
              aria-hidden="true"
            />
          </>
        )}

        <div className="container relative mx-auto max-w-6xl px-6">
          <header
            className={cn(
              "mb-12 md:mb-16",
              align === "center" ? "text-center" : "text-center md:text-left"
            )}
          >
            {eyebrow ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle ? (
              <p
                className={cn(
                  "mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300",
                  align === "center" ? "mx-auto" : "mx-auto md:mx-0"
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
)

SectionShell.displayName = "SectionShell"

export default SectionShell
