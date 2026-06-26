import React from "react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import ProcessTimeline from "./process/ProcessTimeline"

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

const ProcessSection: React.FC = () => (
  <MotionSection
    id="process"
    aria-labelledby="process-heading"
    className="relative py-20 md:py-24"
  >
    <div className="container relative mx-auto max-w-6xl px-6">
      <V2SectionHead
        layout="stacked"
        titleId="process-heading"
        label="Process"
        title="A clear path from problem to delivery."
        copy="What happens after you get in touch — designed to remove uncertainty before any money or production access changes hands."
      />

      <ProcessTimeline steps={steps} />
    </div>
  </MotionSection>
)

export default ProcessSection
