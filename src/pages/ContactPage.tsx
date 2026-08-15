import React, { Suspense } from "react"
import V2PageHero from "../components/ui/V2PageHero"
import { createLazyComponent } from "../utils/performanceOptimization"
import { LoadingSpinner } from "../components/system/loading/LoadingStates"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"

const Contact = createLazyComponent(
  () => import("../components/sections/Contact"),
  {}
)

const ContactPage: React.FC = () => {
  useRoutePageMeta("/contact")

  return (
    <div>
      <V2PageHero
        id="contact-hero"
        eyebrow="Contact"
        title="Name, email, and what you need."
        subtitle="A website URL helps for fixes, DNS, and SEO. Optional selectors stay collapsed until you need them."
        compact
      />
      <Suspense
        fallback={
          <div className="flex min-h-[120px] items-center justify-center py-8">
            <LoadingSpinner size="lg" className="text-primary" />
          </div>
        }
      >
        <Contact />
      </Suspense>
    </div>
  )
}

export default ContactPage
