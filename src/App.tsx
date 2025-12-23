import React, { Suspense } from "react"
// Critical path components - loaded eagerly
import Hero from "./components/Hero"
import Footer from "./components/Footer"
import ModernHeader from "./components/navigation/ModernHeader"
import ErrorBoundary from "./components/ErrorBoundary"
import PortfolioSchema from "./components/PortfolioSchema"
import { LoadingSpinner, ProjectGridSkeleton, ExperienceCardSkeleton, SkillsSkeleton } from "./components/loading/ModernLoadingStates"
import { BackToTopButton } from "./components/ui/BackToTopButton"
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

// Lazy-loaded components (below the fold)
const VercelIntegrations = createLazyComponent(
  () => import("./components/VercelIntegrations").then(m => ({ default: m.VercelIntegrations })),
  {}
)

const PerformanceDashboard = createLazyComponent(
  () => import("./components/PerformanceDashboard"),
  {}
)

if (process.env.NODE_ENV === "development") {
  import("./utils/schemaTesting")
}

// Lazy-load all below-fold sections
const ModernSkills = createLazyComponent(
  () => import("./components/ModernSkills"),
  { preload: true }
)

const ModernBio = createLazyComponent(
  () => import("./components/ModernBio"),
  {}
)

const Contact = createLazyComponent(
  () => import("./components/Contact"),
  {}
)

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

  // Lazy-load production monitor and track page view
  React.useEffect(() => {
    import("./utils/productionMonitor").then(({ default: productionMonitor }) => {
      productionMonitor.trackPageView()
    })
  }, [])

  // Track theme changes (lazy load production monitor)
  React.useEffect(() => {
    import("./utils/productionMonitor").then(({ default: productionMonitor }) => {
      productionMonitor.trackEvent("theme_change", {
        theme: isDark ? "dark" : "light",
      })
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
      image: "https://theodorosmentis.com/images/teo-square.webp",
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

        <ErrorBoundary componentName="Skills">
          <Suspense fallback={<SkillsSkeleton />}>
            <ModernSkills />
          </Suspense>
        </ErrorBoundary>

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

        <ErrorBoundary componentName="Bio">
          <Suspense fallback={<SectionLoader />}>
            <ModernBio />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Contact">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </ErrorBoundary>
        <BackToTopButton />
      </main>
      <Footer />

      <OfflineIndicator position="bottom" />
      <Suspense fallback={null}>
        <PerformanceDashboard />
      </Suspense>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider position="top-right">
          <AppContent />
          <Suspense fallback={null}>
            <VercelIntegrations />
          </Suspense>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
