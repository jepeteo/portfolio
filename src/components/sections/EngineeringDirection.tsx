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
        title="Expanding into fintech without rewriting the past."
        copy="The commercial offer today is website rescue, WordPress/WooCommerce, and reliable infrastructure. In parallel I am building toward financial systems, automation, and more structured engineering environments."
      />
      <Link to="/engineering" className={v2SecondaryButton}>
        Open the engineering archive
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </MotionSection>
)

export default EngineeringDirection
