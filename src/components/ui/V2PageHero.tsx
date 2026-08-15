import React from "react"
import { useAdoptedLcpHeading } from "../../hooks/useAdoptedLcpHeading"
import { useLayoutEffect, useRef, useState } from "react"

type V2PageHeroProps = {
  id: string
  eyebrow: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  /** Tighter vertical spacing for conversion pages such as Contact. */
  compact?: boolean
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
  compact = false,
}) => {
  const headingId = `${id}-heading`
  const headingClassName = compact
    ? "mt-3 max-w-4xl font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-bold leading-[0.95] tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
    : "mt-4 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
  const subtitleClassName = compact
    ? "mt-3 max-w-2xl text-base text-[var(--v2-muted)] md:text-lg"
    : "mt-5 max-w-2xl text-lg text-[var(--v2-muted)] md:text-xl"
  const { slotRef, renderReactHeading } = useAdoptedLcpHeading(
    headingId,
    headingClassName
  )
  const subtitleSlotRef = useRef<HTMLDivElement>(null!)
  const [renderReactSubtitle, setRenderReactSubtitle] = useState(() => {
    if (typeof document === "undefined") return true
    return !document.getElementById("lcp-static-subtitle")
  })

  useLayoutEffect(() => {
    if (renderReactSubtitle) return
    const slot = subtitleSlotRef.current
    const staticSubtitle = document.getElementById("lcp-static-subtitle")
    if (!slot || !staticSubtitle) {
      setRenderReactSubtitle(true)
      return
    }
    staticSubtitle.className = subtitleClassName
    slot.appendChild(staticSubtitle)
    document.getElementById("lcp-static-shell")?.remove()
  }, [renderReactSubtitle, subtitleClassName])

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={
        compact
          ? "v2-grid-bg relative overflow-hidden pt-24 pb-6 md:pt-28 md:pb-8"
          : "v2-grid-bg relative overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16"
      }
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <p className="m-0 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--v2-acid)]">
          {eyebrow}
        </p>
        <div ref={slotRef} />
        {renderReactHeading ? (
          <h1 id={headingId} className={headingClassName}>
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <>
            <div ref={subtitleSlotRef} />
            {renderReactSubtitle ? (
              <p className={subtitleClassName}>{subtitle}</p>
            ) : null}
          </>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}

export default V2PageHero
