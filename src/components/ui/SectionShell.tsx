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
  headingLevel?: "h1" | "h2"
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
      headingLevel = "h2",
      className,
      children,
    },
    ref
  ) => {
    const Heading = headingLevel
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "relative overflow-hidden py-20 transition-colors duration-300 md:py-24",
          variant === "muted"
            ? "bg-[var(--v2-panel-2)]/40 dark:bg-[var(--v2-panel-2)]/30"
            : "",
          decoration === "grid" && "v2-grid-bg",
          className
        )}
      >
        {decoration === "gradient-orb" && (
          <>
            <div
              className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-[var(--v2-brand)]/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-[var(--v2-brand-2)]/10 blur-3xl"
              aria-hidden="true"
            />
          </>
        )}

        <div className="container relative z-10 mx-auto max-w-6xl px-6">
          <header
            className={cn(
              "mb-12 md:mb-16",
              align === "center" ? "text-center" : "text-center md:text-left"
            )}
          >
            {eyebrow ? (
              <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--v2-acid)]">
                {eyebrow}
              </p>
            ) : null}
            <Heading className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.98] tracking-tight text-[var(--v2-text)] [text-wrap:balance]">
              {title}
            </Heading>
            {subtitle ? (
              <p
                className={cn(
                  "mt-4 max-w-2xl text-lg leading-relaxed text-[var(--v2-muted)]",
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
