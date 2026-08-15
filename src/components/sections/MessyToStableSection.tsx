import React from "react"
import V2SectionHead from "../ui/V2SectionHead"
import { BeforeAfterCompare, MotionSection } from "../motion"
import { messyToStableContent } from "../../content/messyToStable"

const MessyToStableSection: React.FC = () => (
  <MotionSection
    id="messy-to-stable"
    aria-labelledby="messy-to-stable-heading"
    className="relative py-20 md:py-24"
  >
    <div className="container relative mx-auto max-w-6xl px-6">
      <V2SectionHead
        layout="stacked"
        titleId="messy-to-stable-heading"
        label="Outcomes"
        title={messyToStableContent.title}
        copy={messyToStableContent.subtitle}
      />

      <BeforeAfterCompare
        beforeTitle={messyToStableContent.beforeTitle}
        afterTitle={messyToStableContent.afterTitle}
        beforeItems={messyToStableContent.beforeItems}
        afterItems={messyToStableContent.afterItems}
      />
    </div>
  </MotionSection>
)

export default MessyToStableSection
