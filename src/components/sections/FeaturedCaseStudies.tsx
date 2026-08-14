import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionCard, MotionSection } from "../motion"
import { featuredCaseStudies } from "../../content/caseStudies"
import CaseStudyCard from "./caseStudies/CaseStudyCard"
import { v2SecondaryButton } from "../ui/v2Styles"

const FeaturedCaseStudies: React.FC = () => (
  <MotionSection
    id="featured-case-studies"
    aria-labelledby="featured-case-studies-heading"
    className="v2-grid-bg relative py-20 md:py-24"
  >
    <div className="container relative z-10 mx-auto max-w-6xl px-6">
      <V2SectionHead
        layout="stacked"
        titleId="featured-case-studies-heading"
        label="Work"
        title="Featured case studies"
        copy="Selected work shown by problem, implementation and practical outcome."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {featuredCaseStudies.map((study, index) => (
          <MotionCard key={study.id} index={index} className="group h-full">
            <CaseStudyCard study={study} index={index} />
          </MotionCard>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/projects" className={v2SecondaryButton}>
          Browse full project grid
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </MotionSection>
)

export default FeaturedCaseStudies
