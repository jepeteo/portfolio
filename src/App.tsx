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
import { LoadingSpinner, ProjectGridSkeleton, ExperienceCardSkeleton } from "./components/loading/ModernLoadingStates"
import { BackToTopButton } from "./components/ui/BackToTopButton"
import { VercelIntegrations } from "./components/VercelIntegrations"
import { ToastProvider } from "./components/ui/Toast"
import { SkipLink } from "./components/accessibility/SkipLink"
import { ScrollProgress } from "./components/ui/ScrollProgress"
import { OfflineIndicator } from "./components/ui/OfflineIndicator"
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

const ModernProjects = createLazyComponent(
  () => import("./components/ModernProjects"),
  { preload: true }
)

const ModernExperience = createLazyComponent(
  () => import("./components/ModernExperience"),
  { preload: true }
)

const UnifiedProjects = createLazyComponent(
  () => import("./components/UnifiedProjects"),
  { preload: true }
)

const ModernCertificates = createLazyComponent(
  () => import("./components/ModernCertificates"),
  {}
)

const SectionLoader: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px] py-16">
    <LoadingSpinner size="lg" className="text-primary" />
  </div>
)

const ProjectsLoader: React.FC = () => (
  <div className="container py-20">
    <div className="text-center mb-12">
      <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-4 animate-pulse" />
      <div className="h-4 w-96 max-w-full bg-slate-200 dark:bg-slate-700 rounded mx-auto animate-pulse" />
    </div>
    <ProjectGridSkeleton count={6} />
  </div>
)

const ExperienceLoader: React.FC = () => (
  <div className="container py-20">
    <div className="text-center mb-12">
      <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-4 animate-pulse" />
      <div className="h-4 w-80 max-w-full bg-slate-200 dark:bg-slate-700 rounded mx-auto animate-pulse" />
    </div>
    <div className="space-y-6 max-w-4xl mx-auto">
      <ExperienceCardSkeleton />
      <ExperienceCardSkeleton />
      <ExperienceCardSkeleton />
    </div>
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
      location: "Berlin, Germany",
      description:
        "Senior Full-Stack Developer with 18+ years of experience in WordPress, React, and modern web technologies. Based in Berlin, Germany. Specializing in scalable web solutions and server administration.",
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "18+ Years Professional Web Development Experience",
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
      <SkipLink href="#main-content" />
      <ScrollProgress position="top" height={3} colorScheme="gradient" hideAtTop={true} />
      <PortfolioSchema
        includePersonSchema={false}
        includeOrganizationSchema={true}
      />
      <ModernHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />

        <ErrorBoundary componentName="Experience">
          <Suspense fallback={<ExperienceLoader />}>
            <ModernExperience />
          </Suspense>
        </ErrorBoundary>

        <ModernSkills />

        <ErrorBoundary componentName="Projects">
          <Suspense fallback={<ProjectsLoader />}>
            <ModernProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Web Projects">
          <Suspense fallback={<ProjectsLoader />}>
            <UnifiedProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Certificates">
          <Suspense fallback={<SectionLoader />}>
            <ModernCertificates />
          </Suspense>
        </ErrorBoundary>

        <ModernBio />

        <Contact />
        <BackToTopButton />
      </main>
      <Footer />

      <OfflineIndicator position="bottom" />
      <PerformanceDashboard />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider position="top-right">
          <AppContent />
          <VercelIntegrations />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
