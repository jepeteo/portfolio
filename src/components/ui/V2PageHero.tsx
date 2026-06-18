import React from "react"

type V2PageHeroProps = {
  id: string
  eyebrow: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Shared "service console" hero for sub-pages (Services, Emergency).
 * Mono accent eyebrow, editorial H1, lead copy and an actions/extras slot,
 * over the masked technical grid backdrop.
 */
const V2PageHero: React.FC<V2PageHeroProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}) => {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="v2-grid-bg relative overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <p className="m-0 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--v2-acid)]">
          {eyebrow}
        </p>
        <h1
          id={headingId}
          className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-lg text-[var(--v2-muted)] md:text-xl">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}

export default V2PageHero
