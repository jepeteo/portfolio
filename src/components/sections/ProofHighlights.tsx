import React from "react"
import SectionShell from "../ui/SectionShell"
import StatBlock from "../ui/StatBlock"

const proofItems = [
  { label: "Years of experience", value: "18+" },
  { label: "Projects delivered", value: "100+" },
  { label: "Client focus", value: "WordPress, React, Infra" },
]

const ProofHighlights: React.FC = () => {
  return (
    <SectionShell
      id="proof"
      eyebrow="Track record"
      title="Proof You Can Trust"
      decoration="gradient-orb"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {proofItems.map((item, index) => (
          <StatBlock
            key={item.label}
            value={item.value}
            label={item.label}
            index={index}
            animate={/\d/.test(item.value)}
          />
        ))}
      </div>
    </SectionShell>
  )
}

export default ProofHighlights
