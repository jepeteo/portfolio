import React from "react"
import { cn } from "../../utils/styles"

export type BeforeAfterCompareProps = {
  beforeTitle: string
  afterTitle: string
  beforeItems: string[]
  afterItems: string[]
  className?: string
}

const BeforeAfterCompare: React.FC<BeforeAfterCompareProps> = ({
  beforeTitle,
  afterTitle,
  beforeItems,
  afterItems,
  className,
}) => (
  <div
    className={cn(
      "overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)]",
      className
    )}
  >
    <div className="grid md:grid-cols-2">
      <article className="border-b border-[var(--v2-line)] p-6 md:border-b-0 md:border-r md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-sm font-bold text-[var(--v2-soft)]"
            aria-hidden="true"
          >
            ×
          </span>
          <h3 className="m-0 text-lg font-bold text-[var(--v2-text)]">
            {beforeTitle}
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-[var(--v2-muted)]">
          {beforeItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-[var(--v2-line)] text-[10px] font-bold text-[var(--v2-soft)]"
                aria-hidden="true"
              >
                ×
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="bg-[var(--v2-panel-2)]/35 p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/10 text-sm font-bold text-[var(--v2-ok)]"
            aria-hidden="true"
          >
            ✓
          </span>
          <h3 className="m-0 text-lg font-bold text-[var(--v2-text)]">
            {afterTitle}
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-[var(--v2-muted)]">
          {afterItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/10 text-[10px] font-bold text-[var(--v2-ok)]"
                aria-hidden="true"
              >
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </div>
)

export default BeforeAfterCompare
