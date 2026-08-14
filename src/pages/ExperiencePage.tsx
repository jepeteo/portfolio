import React, { Suspense } from "react"
import ArchiveSectionPage from "./ArchiveSectionPage"
import { createLazyComponent } from "../utils/performanceOptimization"
import { ExperienceCardSkeleton } from "../components/system/loading/LoadingStates"

const Experience = createLazyComponent(
  () => import("../components/sections/Experience"),
  {}
)

const ExperiencePage: React.FC = () => (
  <ArchiveSectionPage path="/experience" heading="Experience">
    <Suspense
      fallback={
        <div className="container space-y-6 py-20">
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
        </div>
      }
    >
      <Experience />
    </Suspense>
  </ArchiveSectionPage>
)

export default ExperiencePage
