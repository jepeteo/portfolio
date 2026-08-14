import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import { v2SecondaryButton } from "../ui/v2Styles"

const EngineeringDirection: React.FC = () => (
  <MotionSection
    id="engineering-direction"
    aria-labelledby="engineering-direction-heading"
    className="relative py-16 md:py-20"
  >
    <div className="container relative mx-auto max-w-6xl px-6">
      <V2SectionHead
        titleId="engineering-direction-heading"
        label="Direction"
        title="Building toward financial systems."
        copy="I am applying years of production problem-solving to automation, financial technology and more structured engineering environments. I document the work as that experience grows."
      />
      <Link to="/engineering" className={v2SecondaryButton}>
        Open the engineering archive
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </MotionSection>
)

export default EngineeringDirection
