import React, { Suspense, lazy, useEffect, useState } from "react"
import Hero from "../components/sections/Hero"
import { useEnhancedSEO, defaultSEOConfig } from "../utils/enhancedSEO"
import { useTheme } from "../context/ThemeContext"

const ProofHighlights = lazy(
  () => import("../components/sections/ProofHighlights")
)
const ServicePaths = lazy(() => import("../components/sections/ServicePaths"))
const FeaturedCaseStudies = lazy(
  () => import("../components/sections/FeaturedCaseStudies")
)
const EngineeringDirection = lazy(
  () => import("../components/sections/EngineeringDirection")
)
const ProcessSection = lazy(
  () => import("../components/sections/ProcessSection")
)
const ExperiencePreview = lazy(
  () => import("../components/sections/ExperiencePreview")
)
const CertificationsPreview = lazy(
  () => import("../components/sections/CertificationsPreview")
)
const ContactCTA = lazy(() => import("../components/sections/ContactCTA"))

const HomeBelowFold: React.FC = () => (
  <>
    <ProofHighlights />
    <ServicePaths />
    <FeaturedCaseStudies />
    <EngineeringDirection />
    <ProcessSection />
    <ExperiencePreview />
    <CertificationsPreview />
    <ContactCTA />
  </>
)

const HomePage: React.FC = () => {
  const { isDark } = useTheme()
  const [showBelowFold, setShowBelowFold] = useState(false)

  useEffect(() => {
    import("../utils/productionMonitor").then(({ default: productionMonitor }) => {
      productionMonitor.trackPageView()
    })
  }, [])

  useEffect(() => {
    import("../utils/productionMonitor").then(({ default: productionMonitor }) => {
      productionMonitor.trackEvent("theme_change", {
        theme: isDark ? "dark" : "light",
      })
    })
  }, [isDark])

  // Paint the LCP hero first; defer the rest of the homepage until after the
  // next frame (or idle) so framer-motion sections do not compete with H1.
  useEffect(() => {
    let cancelled = false
    const reveal = () => {
      if (!cancelled) setShowBelowFold(true)
    }

    const win = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          cb: IdleRequestCallback,
          opts?: IdleRequestOptions
        ) => number
        cancelIdleCallback?: (id: number) => void
      }

    if (typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback(reveal, { timeout: 400 })
      return () => {
        cancelled = true
        win.cancelIdleCallback?.(idleId)
      }
    }

    const frameId = requestAnimationFrame(() => {
      setTimeout(reveal, 0)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [])

  useEnhancedSEO(defaultSEOConfig)

  return (
    <>
      <Hero />
      {showBelowFold ? (
        <Suspense fallback={null}>
          <HomeBelowFold />
        </Suspense>
      ) : null}
    </>
  )
}

export default HomePage
