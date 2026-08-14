import React from "react"
import { ArrowRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionCard, MotionSection } from "../motion"
import { featuredCaseStudies } from "../../content/caseStudies"
import CaseStudyCard from "./caseStudies/CaseStudyCard"

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
        label="Proof"
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
        <a
          href="/projects"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] px-6 py-3 font-bold tracking-tight text-[var(--v2-text)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Browse full project grid
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </MotionSection>
)

export default FeaturedCaseStudies
