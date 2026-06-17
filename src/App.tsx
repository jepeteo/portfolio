import React, { Suspense, lazy } from "react"
import Hero from "./components/sections/Hero"
import Footer from "./components/layout/Footer"
import ErrorBoundary from "./components/system/ErrorBoundary"
import PortfolioSchema from "./components/seo/PortfolioSchema"
import BuyerIntentSection from "./components/sections/BuyerIntentSection"
import ProofHighlights from "./components/sections/ProofHighlights"
import {
  LoadingSpinner,
  ProjectGridSkeleton,
  ExperienceCardSkeleton,
  SkillsSkeleton,
} from "./components/system/loading/LoadingStates"
import { SkipLink } from "./components/accessibility/SkipLink"
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

const Header = lazy(() => import("./components/layout/Header"))
const ToastProvider = lazy(() =>
  import("./components/ui/Toast").then((m) => ({ default: m.ToastProvider }))
)
const BackToTopButton = lazy(() =>
  import("./components/ui/BackToTopButton").then((m) => ({
    default: m.BackToTopButton,
  }))
)
const ScrollProgress = lazy(() =>
  import("./components/ui/ScrollProgress").then((m) => ({
    default: m.ScrollProgress,
  }))
)
const OfflineIndicator = lazy(() =>
  import("./components/ui/OfflineIndicator").then((m) => ({
    default: m.OfflineIndicator,
  }))
)

const VercelIntegrations = createLazyComponent(
  () =>
    import("./components/system/VercelIntegrations").then((m) => ({
      default: m.VercelIntegrations,
    })),
  {}
)

const PerformanceDashboard = createLazyComponent(
  () => import("./components/system/PerformanceDashboard"),
  {}
)

if (process.env.NODE_ENV === "development") {
  import("./utils/schemaTesting")
}

const Skills = createLazyComponent(
  () => import("./components/sections/Skills"),
  { preload: true }
)

const Bio = createLazyComponent(
  () => import("./components/sections/Bio"),
  {}
)

const Contact = createLazyComponent(
  () => import("./components/sections/Contact"),
  {}
)

const Projects = createLazyComponent(
  () => import("./components/sections/Projects"),
  {}
)

const Experience = createLazyComponent(
  () => import("./components/sections/Experience"),
  { preload: true }
)

const WebProjects = createLazyComponent(
  () => import("./components/sections/WebProjects"),
  {}
)

const Certificates = createLazyComponent(
  () => import("./components/sections/Certificates"),
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

  useServiceWorker()

  React.useEffect(() => {
    import("./utils/productionMonitor").then(
      ({ default: productionMonitor }) => {
        productionMonitor.trackPageView()
      }
    )
  }, [])

  React.useEffect(() => {
    import("./utils/productionMonitor").then(
      ({ default: productionMonitor }) => {
        productionMonitor.trackEvent("theme_change", {
          theme: isDark ? "dark" : "light",
        })
      }
    )
  }, [isDark])

  React.useEffect(() => {
    seoManager.optimizeCorewWebVitals()
  }, [])

  React.useEffect(() => {
    const disposers: Array<() => void> = []

    const proofSection = document.getElementById("proof")
    if (proofSection) {
      const dispose = ComponentPreloader.preloadOnIntersection(
        "projects",
        () => import("./components/sections/Projects")
      )(proofSection)
      if (dispose) disposers.push(dispose)
    }

    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      const dispose = ComponentPreloader.preloadOnIntersection(
        "web-projects",
        () => import("./components/sections/WebProjects")
      )(skillsSection)
      if (dispose) disposers.push(dispose)
    }

    const projectsNav = document.querySelector('a[href*="projects"]')
    if (projectsNav) {
      const preloadHandlers = ComponentPreloader.preloadOnHover(
        "web-projects",
        () => import("./components/sections/WebProjects")
      )

      projectsNav.addEventListener("mouseenter", preloadHandlers.onMouseEnter)
      projectsNav.addEventListener("touchstart", preloadHandlers.onTouchStart)

      disposers.push(() => {
        projectsNav.removeEventListener(
          "mouseenter",
          preloadHandlers.onMouseEnter
        )
        projectsNav.removeEventListener(
          "touchstart",
          preloadHandlers.onTouchStart
        )
      })
    }

    return () => disposers.forEach((fn) => fn())
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
      <Suspense fallback={null}>
        <ScrollProgress
          position="top"
          height={3}
          colorScheme="gradient"
          hideAtTop={true}
        />
      </Suspense>
      <PortfolioSchema
        includePersonSchema={false}
        includeOrganizationSchema={true}
      />
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <BuyerIntentSection />
        <ProofHighlights />

        <ErrorBoundary componentName="Skills">
          <Suspense fallback={<SkillsSkeleton />}>
            <Skills />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Projects">
          <Suspense fallback={<ProjectsLoader />}>
            <Projects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Web Projects">
          <Suspense fallback={<ProjectsLoader />}>
            <WebProjects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Experience">
          <Suspense fallback={<ExperienceLoader />}>
            <Experience />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Certificates">
          <Suspense fallback={<SectionLoader />}>
            <Certificates />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Bio">
          <Suspense fallback={<SectionLoader />}>
            <Bio />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="Contact">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </ErrorBoundary>
        <Suspense fallback={null}>
          <BackToTopButton />
        </Suspense>
      </main>
      <Footer />

      <Suspense fallback={null}>
        <OfflineIndicator position="bottom" />
      </Suspense>
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
        <Suspense fallback={null}>
          <ToastProvider position="top-right">
            <AppContent />
            <Suspense fallback={null}>
              <VercelIntegrations />
            </Suspense>
          </ToastProvider>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
