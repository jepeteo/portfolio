import React, { Suspense } from "react"
import ArchiveSectionPage from "./ArchiveSectionPage"
import {
  createLazyComponent,
} from "../utils/performanceOptimization"
import { ProjectGridSkeleton } from "../components/system/loading/LoadingStates"

const Projects = createLazyComponent(
  () => import("../components/sections/Projects"),
  {}
)

const ProjectsPage: React.FC = () => (
  <ArchiveSectionPage path="/projects" heading="Projects">
    <Suspense
      fallback={
        <div className="container py-20">
          <ProjectGridSkeleton count={6} />
        </div>
      }
    >
      <Projects />
    </Suspense>
  </ArchiveSectionPage>
)

export default ProjectsPage
