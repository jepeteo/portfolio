import React, { Suspense } from "react"
import Hero from "./components/Hero"
import ModernSkills from "./components/ModernSkills"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import ModernHeader from "./components/navigation/ModernHeader"
import ModernBio from "./components/ModernBio"
import ErrorBoundary from "./components/ErrorBoundary"
import PerformanceDashboard from "./components/PerformanceDashboard"
import PortfolioSchema from "./components/PortfolioSchema"
import { LoadingSpinner } from "./components/loading/ModernLoadingStates"
import { BackToTopButton } from "./components/ui/BackToTopButton"
import { VercelIntegrations } from "./components/VercelIntegrations"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import {
  createLazyComponent,
  ComponentPreloader,
} from "./utils/performanceOptimization"
import {
  useEnhancedSEO,
  defaultSEOConfig,
  seoManager,
} from "./utils/enhancedSEO"
import useServiceWorker from "./hooks/useServiceWorker"
import { usePostHog } from "posthog-js/react"
import { postHogAnalytics } from "./utils/postHogAnalytics"

import productionMonitor from "./utils/productionMonitor"

if (process.env.NODE_ENV === "development") {
  import("./utils/schemaTesting")
}

import "flowbite"
import "flowbite/dist/flowbite.css"

const ModernProjects = createLazyComponent(
  () => import("./components/ModernProjects"),
  { chunkName: "modern-projects", preload: true }
)

const ModernExperience = createLazyComponent(
  () => import("./components/ModernExperience"),
  { chunkName: "experience", preload: true }
)

const UnifiedProjects = createLazyComponent(
  () => import("./components/UnifiedProjects"),
  { chunkName: "unified-projects", preload: true }
)

const ModernCertificates = createLazyComponent(
  () => import("./components/ModernCertificates"),
  { chunkName: "certificates" }
)

const SectionLoader: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px] py-16">
    <LoadingSpinner size="lg" className="text-primary" />
  </div>
)

const AppContent: React.FC = () => {
  const { isDark } = useTheme()

  const postHog = usePostHog()

  React.useEffect(() => {
    if (postHog) {
      postHogAnalytics.setPostHogInstance(postHog)
    }
  }, [postHog])

  useServiceWorker()

  React.useEffect(() => {
    productionMonitor.trackPageView()
  }, [])

  React.useEffect(() => {
    productionMonitor.trackEvent("theme_change", {
      theme: isDark ? "dark" : "light",
    })

    postHog?.capture("theme_changed", {
      theme: isDark ? "dark" : "light",
    })
  }, [isDark, postHog])

  React.useEffect(() => {
    seoManager.optimizeCorewWebVitals()
  }, [])

  React.useEffect(() => {
    const experienceSection = document.getElementById("experience")
    if (experienceSection) {
      ComponentPreloader.preloadOnIntersection(
        "modern-projects",
        () => import("./components/ModernProjects")
      )(experienceSection)
    }

    const projectsNav = document.querySelector('a[href*="projects"]')
    if (projectsNav) {
      const preloadHandlers = ComponentPreloader.preloadOnHover(
        "react-projects",
        () => import("./components/ReactProjects")
      )

      projectsNav.addEventListener("mouseenter", preloadHandlers.onMouseEnter)
      projectsNav.addEventListener("touchstart", preloadHandlers.onTouchStart)

      return () => {
        projectsNav.removeEventListener(
          "mouseenter",
          preloadHandlers.onMouseEnter
        )
        projectsNav.removeEventListener(
          "touchstart",
          preloadHandlers.onTouchStart
        )
      }
    }
  }, [])

  useEnhancedSEO({
    ...defaultSEOConfig,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://theodorosmentis.com/#person",
      name: "Theodoros Mentis",
      alternateName: "Theodore Mentis",
      jobTitle: "Senior Full Stack Developer",
      email: "th.mentis@gmail.com",
      url: "https://theodorosmentis.com",
      image: "https://theodorosmentis.com/src/assets/images/teo.png",
      sameAs: [
        "https://github.com/jepeteo",
        "https://linkedin.com/in/theodorosmentis",
      ],
      knowsAbout: [
        "WordPress Development",
        "React Development",
        "JavaScript",
        "TypeScript",
        "PHP",
        "MySQL",
        "Server Administration",
        "Web Development",
        "Full Stack Development",
        "E-commerce Development",
        "Custom Web Applications",
      ],
      location: "Greece",
      description:
        "Senior Full Stack Developer with 15+ years of experience in WordPress, React, and modern web technologies. Specializing in scalable web solutions and server administration.",
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "15+ Years Professional Web Development Experience",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "WordPress Expert Developer",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "React Specialist",
        },
      ],
      worksFor: {
        "@type": "Organization",
        name: "Freelance Web Development Services",
      },
      owns: [
        {
          "@type": "CreativeWork",
          "@id": "https://theodorosmentis.com/#portfolio",
          name: "Professional Portfolio",
        },
      ],
      address: {
        "@type": "Place",
        addressCountry: "GR",
        addressLocality: "Greece",
      },
    },
  })

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      }`}
    >
      <PortfolioSchema
        includePersonSchema={false}
        includeOrganizationSchema={true}
      />
      <ModernHeader />
      <main>
        <Hero />

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ModernExperience />
          </Suspense>
        </ErrorBoundary>

        <ModernSkills />

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ModernProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <UnifiedProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ModernCertificates />
          </Suspense>
        </ErrorBoundary>

        <ModernBio />

        <Contact />
        <BackToTopButton />
      </main>
      <Footer />

      <PerformanceDashboard />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
        <VercelIntegrations />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
