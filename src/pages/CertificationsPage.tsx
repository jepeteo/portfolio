import React, { Suspense } from "react"
import ArchiveSectionPage from "./ArchiveSectionPage"
import { createLazyComponent } from "../utils/performanceOptimization"
import { LoadingSpinner } from "../components/system/loading/LoadingStates"

const Certificates = createLazyComponent(
  () => import("../components/sections/Certificates"),
  {}
)

const CertificationsPage: React.FC = () => (
  <ArchiveSectionPage path="/certifications" heading="Certifications">
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center py-16">
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
      }
    >
      <Certificates />
    </Suspense>
  </ArchiveSectionPage>
)

export default CertificationsPage
