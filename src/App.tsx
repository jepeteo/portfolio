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
import productionMonitor from "./utils/productionMonitor"

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

const ReactProjects = createLazyComponent(
  () => import("./components/ReactProjects"),
  { chunkName: "react-projects" }
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

  useServiceWorker()

  React.useEffect(() => {
    productionMonitor.trackPageView()
  }, [])

  React.useEffect(() => {
    productionMonitor.trackEvent("theme_change", {
      theme: isDark ? "dark" : "light",
    })
  }, [isDark])

  React.useEffect(() => {
    seoManager.optimizeCorewWebVitals()
  }, [])

  React.useEffect(() => {
    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      ComponentPreloader.preloadOnIntersection(
        "experience",
        () => import("./components/ModernExperience")
      )(skillsSection)
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
    structuredData: seoManager.generatePersonSchema({
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
      email: "th.mentis@gmail.com",
      url: "https://theodorosmentis.com",
      image: "https://theodorosmentis.com/src/assets/images/teo.png",
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
        <Hero />
        <ModernBio />
        <ModernSkills />

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
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
