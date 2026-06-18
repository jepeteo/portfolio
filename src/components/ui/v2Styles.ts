/**
 * Shared class strings for the V2 "service console" aesthetic so buttons and
 * surfaces stay consistent across the homepage and sub-pages.
 */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)]"

export const v2PrimaryButton = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--v2-acid)] px-6 py-3 text-center font-bold tracking-tight text-[var(--v2-acid-ink)] transition-transform duration-200 hover:-translate-y-0.5 ${focusRing} focus-visible:ring-[var(--v2-acid)] motion-reduce:transition-none motion-reduce:hover:translate-y-0`

export const v2SecondaryButton = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-6 py-3 text-center font-bold tracking-tight text-[var(--v2-text)] transition-transform duration-200 hover:-translate-y-0.5 ${focusRing} focus-visible:ring-[var(--v2-brand)] motion-reduce:transition-none motion-reduce:hover:translate-y-0`

export const v2Panel =
  "rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)]"
