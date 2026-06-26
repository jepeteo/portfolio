import React from "react"
import {
  MessageSquare,
  Search,
  FileText,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"
import { MotionCard } from "../../motion"

const stepIcons: LucideIcon[] = [
  MessageSquare,
  Search,
  FileText,
  CheckCircle2,
]

export type ProcessStep = {
  title: string
  copy: string
}

type ProcessTimelineProps = {
  steps: ProcessStep[]
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps }) => (
  <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
    {steps.map((step, index) => {
      const Icon = stepIcons[index] ?? CheckCircle2
      const isLast = index === steps.length - 1

      return (
        <li key={step.title} className="relative">
          <MotionCard index={index} className="h-full">
            <div className="relative h-full rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs font-black tracking-[0.08em] text-[var(--v2-acid)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-2 text-xl font-bold leading-tight tracking-tight text-[var(--v2-text)]">
                {step.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-[var(--v2-muted)]">
                {step.copy}
              </p>
            </div>
          </MotionCard>

          {!isLast ? (
            <div
              className="pointer-events-none absolute -right-3 top-10 hidden h-px w-6 bg-[var(--v2-line-strong)] lg:block"
              aria-hidden="true"
            />
          ) : null}
        </li>
      )
    })}
  </ol>
)

export default ProcessTimeline
