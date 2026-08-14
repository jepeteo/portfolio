import React, { Suspense } from "react"
import ArchiveSectionPage from "./ArchiveSectionPage"
import { createLazyComponent } from "../utils/performanceOptimization"
import { LoadingSpinner } from "../components/system/loading/LoadingStates"
import HomeFAQ from "../components/sections/HomeFAQ"

const Bio = createLazyComponent(() => import("../components/sections/Bio"), {})

const AboutPage: React.FC = () => (
  <ArchiveSectionPage path="/about" heading="About Theodoros Mentis">
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center py-16">
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
      }
    >
      <Bio />
    </Suspense>
    <HomeFAQ />
  </ArchiveSectionPage>
)

export default AboutPage
