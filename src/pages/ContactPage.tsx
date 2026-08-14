import React, { Suspense } from "react"
import ArchiveSectionPage from "./ArchiveSectionPage"
import { createLazyComponent } from "../utils/performanceOptimization"
import { LoadingSpinner } from "../components/system/loading/LoadingStates"

const Contact = createLazyComponent(
  () => import("../components/sections/Contact"),
  {}
)

const ContactPage: React.FC = () => (
  <ArchiveSectionPage path="/contact" heading="Contact">
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center py-16">
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
      }
    >
      <Contact />
    </Suspense>
  </ArchiveSectionPage>
)

export default ContactPage
