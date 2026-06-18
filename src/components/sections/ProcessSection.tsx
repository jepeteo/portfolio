import React from "react"
import V2SectionHead from "../ui/V2SectionHead"

const steps = [
  {
    title: "Send the problem",
    copy: "Website URL, symptoms, timeline and what changed recently.",
  },
  {
    title: "Scope the risk",
    copy: "I check likely causes, access needs and whether the work is safe to start.",
  },
  {
    title: "Quote clearly",
    copy: "You get a fixed scope and price before I touch production.",
  },
  {
    title: "Deliver and explain",
    copy: "You receive the fix or build plus a plain-English technical summary.",
  },
]

const ProcessSection: React.FC = () => {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative py-20 md:py-24"
    >
      <div className="container relative mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="process-heading"
          label="Process"
          title="A clear path from problem to delivery."
          copy="What happens after you get in touch — designed to remove uncertainty before any money or production access changes hands."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6"
            >
              <span
                className="font-mono text-xs font-black tracking-[0.08em] text-[var(--v2-acid)]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 mt-8 text-xl font-bold leading-tight tracking-tight text-[var(--v2-text)]">
                {step.title}
              </h3>
              <p className="m-0 text-sm text-[var(--v2-muted)]">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default ProcessSection
