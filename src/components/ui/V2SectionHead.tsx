import React from "react"

type V2SectionHeadProps = {
  label: string
  title: React.ReactNode
  copy?: React.ReactNode
  titleId?: string
  headingLevel?: "h1" | "h2"
  /** split = label left / title right on large screens; stacked = label above title */
  layout?: "split" | "stacked"
}

/**
 * Editorial section header for the V2 "service console" sections: a small
 * mono accent label beside a large, tightly-tracked title with optional copy.
 */
const V2SectionHead: React.FC<V2SectionHeadProps> = ({
  label,
  title,
  copy,
  titleId,
  headingLevel = "h2",
  layout = "split",
}) => {
  const Heading = headingLevel
  const isStacked = layout === "stacked"

  return (
    <div
      className={
        isStacked
          ? "mb-8 md:mb-10"
          : "mb-10 grid items-end gap-5 md:mb-12 lg:grid-cols-[0.5fr_1fr] lg:gap-8"
      }
    >
      <p className="m-0 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--v2-acid)]">
        {label}
      </p>
      <div className={isStacked ? "mt-3" : undefined}>
        <Heading
          id={titleId}
          className="m-0 font-display text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[0.95] tracking-tight text-[var(--v2-text)] [text-wrap:balance]"
        >
          {title}
        </Heading>
        {copy ? (
          <p className="mt-3 max-w-2xl text-base text-[var(--v2-muted)] md:text-lg">
            {copy}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default V2SectionHead
