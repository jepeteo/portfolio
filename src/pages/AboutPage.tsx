import React, { Suspense } from "react"
import V2PageHero from "../components/ui/V2PageHero"
import HomeFAQ from "../components/sections/HomeFAQ"
import { createLazyComponent } from "../utils/performanceOptimization"
import { LoadingSpinner } from "../components/system/loading/LoadingStates"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { site } from "../config/site"

const Bio = createLazyComponent(() => import("../components/sections/Bio"), {})
const Skills = createLazyComponent(
  () => import("../components/sections/Skills"),
  {}
)

const AboutPage: React.FC = () => {
  useRoutePageMeta("/about")

  return (
    <div>
      <V2PageHero
        id="about-hero"
        eyebrow="About"
        title={`${site.name} — ${site.title}.`}
        subtitle={`${site.location.label}. ${site.stats.yearsExperienceLabel} years building and rescuing digital systems, now expanding into fintech.`}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[200px] items-center justify-center py-16">
            <LoadingSpinner size="lg" className="text-primary" />
          </div>
        }
      >
        <Bio />
      </Suspense>
      <Suspense fallback={null}>
        <Skills />
      </Suspense>
      <HomeFAQ />
    </div>
  )
}

export default AboutPage
