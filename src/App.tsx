import React, { Suspense } from "react"
import Hero from "./components/Hero"
import ModernSkills from "./components/ModernSkills"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import ModernHeader from "./components/navigation/ModernHeader"
import ModernBio from "./components/ModernBio"
import ErrorBoundary from "./components/ErrorBoundary"
import PerformanceDashboard from "./components/PerformanceDashboard"
import { LoadingSpinner } from "./components/loading/ModernLoadingStates"
import { BackToTopButton } from "./components/ui/BackToTopButton"
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

import "flowbite"
import "flowbite/dist/flowbite.css"

// Lazy load non-critical components with enhanced loading
const ModernProjects = createLazyComponent(
  () => import("./components/ModernProjects"),
  { chunkName: "modern-projects", preload: true }
)

const ModernExperience = createLazyComponent(
  () => import("./components/ModernExperience"),
  { chunkName: "experience" }
)

const ReactProjects = createLazyComponent(
  () => import("./components/ReactProjects"),
  { chunkName: "react-projects" }
)

const ModernCertificates = createLazyComponent(
  () => import("./components/ModernCertificates"),
  { chunkName: "certificates" }
)

// Enhanced loading component for better UX
const SectionLoader: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px] py-16">
    <LoadingSpinner size="lg" className="text-primary" />
  </div>
)

const AppContent: React.FC = () => {
  const { isDark } = useTheme()

  // Initialize service worker for performance
  useServiceWorker()

  // Optimize Core Web Vitals
  React.useEffect(() => {
    seoManager.optimizeCorewWebVitals()
  }, [])

  // Preload components on hover/intersection
  React.useEffect(() => {
    // Preload experience section when user scrolls past skills
    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      ComponentPreloader.preloadOnIntersection(
        "experience",
        () => import("./components/ModernExperience")
      )(skillsSection)
    }

    // Preload projects when user interacts with navigation
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

  // Enhanced SEO configuration with structured data
  useEnhancedSEO({
    ...defaultSEOConfig,
    structuredData: seoManager.generatePersonSchema({
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
      email: "th.mentis@gmail.com",
      url: "https://jepeteo.github.io/portfolio/",
      image: "https://jepeteo.github.io/portfolio/src/assets/images/teo.png",
      skills: [
        "WordPress Development",
        "React Development",
        "JavaScript",
        "TypeScript",
        "PHP",
        "MySQL",
        "Server Administration",
        "Web Development",
      ],
      location: "Greece",
      description:
        "Senior Full Stack Developer with 15+ years of experience in WordPress, React, and modern web technologies.",
    }),
  })

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      }`}
    >
      <ModernHeader />
      <main>
        {/* Critical above-the-fold content - loaded immediately */}
        <Hero />
        <ModernBio />
        <ModernSkills />

        {/* Non-critical content - lazy loaded */}
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ModernExperience />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ModernProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ReactProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader />}>
            <ModernCertificates />
          </Suspense>
        </ErrorBoundary>

        {/* Contact is critical for user interaction */}
        <Contact />
        <BackToTopButton />
      </main>
      <Footer />

      {/* Development Performance Dashboard */}
      <PerformanceDashboard />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
