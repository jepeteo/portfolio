import React from "react"
import Hero from "../components/sections/Hero"
import ProofHighlights from "../components/sections/ProofHighlights"
import ServicePaths from "../components/sections/ServicePaths"
import FeaturedCaseStudies from "../components/sections/FeaturedCaseStudies"
import EngineeringDirection from "../components/sections/EngineeringDirection"
import ProcessSection from "../components/sections/ProcessSection"
import ExperiencePreview from "../components/sections/ExperiencePreview"
import CertificationsPreview from "../components/sections/CertificationsPreview"
import ContactCTA from "../components/sections/ContactCTA"
import { useEnhancedSEO, defaultSEOConfig } from "../utils/enhancedSEO"
import { useTheme } from "../context/ThemeContext"

const HomePage: React.FC = () => {
  const { isDark } = useTheme()

  React.useEffect(() => {
    import("../utils/productionMonitor").then(({ default: productionMonitor }) => {
      productionMonitor.trackPageView()
    })
  }, [])

  React.useEffect(() => {
    import("../utils/productionMonitor").then(({ default: productionMonitor }) => {
      productionMonitor.trackEvent("theme_change", {
        theme: isDark ? "dark" : "light",
      })
    })
  }, [isDark])

  useEnhancedSEO(defaultSEOConfig)

  return (
    <>
      <Hero />
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
}

export default HomePage
