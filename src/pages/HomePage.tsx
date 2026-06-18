import React, { Suspense } from "react"
import Hero from "../components/sections/Hero"
import ErrorBoundary from "../components/system/ErrorBoundary"
import ProofHighlights from "../components/sections/ProofHighlights"
import FastHelpSection from "../components/services/FastHelpSection"
import ProcessSection from "../components/sections/ProcessSection"
import EmergencyCTA from "../components/sections/EmergencyCTA"
import {
  LoadingSpinner,
  ProjectGridSkeleton,
  ExperienceCardSkeleton,
  SkillsSkeleton,
} from "../components/system/loading/LoadingStates"
import {
  createLazyComponent,
  ComponentPreloader,
} from "../utils/performanceOptimization"
import {
  useEnhancedSEO,
  defaultSEOConfig,
  seoManager,
} from "../utils/enhancedSEO"
import useServiceWorker from "../hooks/useServiceWorker"
import { useTheme } from "../context/ThemeContext"
import { site, sitePersonSchema } from "../config/site"

const Skills = createLazyComponent(
  () => import("../components/sections/Skills"),
  { preload: true }
)

const Bio = createLazyComponent(
  () => import("../components/sections/Bio"),
  {}
)

const Contact = createLazyComponent(
  () => import("../components/sections/Contact"),
  {}
)

const Projects = createLazyComponent(
  () => import("../components/sections/Projects"),
  {}
)

const Experience = createLazyComponent(
  () => import("../components/sections/Experience"),
  { preload: true }
)

const Certificates = createLazyComponent(
  () => import("../components/sections/Certificates"),
  {}
)

const BackToTopButton = createLazyComponent(
  () =>
    import("../components/ui/BackToTopButton").then((m) => ({
      default: m.BackToTopButton,
    })),
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

const HomePage: React.FC = () => {
  const { isDark } = useTheme()

  useServiceWorker()

  React.useEffect(() => {
    import("../utils/productionMonitor").then(
      ({ default: productionMonitor }) => {
        productionMonitor.trackPageView()
      }
    )
  }, [])

  React.useEffect(() => {
    import("../utils/productionMonitor").then(
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
        () => import("../components/sections/Projects")
      )(proofSection)
      if (dispose) disposers.push(dispose)
    }

    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      const dispose = ComponentPreloader.preloadOnIntersection(
        "experience",
        () => import("../components/sections/Experience")
      )(skillsSection)
      if (dispose) disposers.push(dispose)
    }

    const projectsNav = document.querySelector('a[href="#projects"]')
    if (projectsNav) {
      const preloadHandlers = ComponentPreloader.preloadOnHover(
        "projects",
        () => import("../components/sections/Projects")
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
      ...sitePersonSchema,
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
      owns: [
        {
          "@type": "CreativeWork",
          "@id": `${site.url}/#portfolio`,
          name: "Professional Portfolio",
        },
      ],
    },
  })

  return (
    <>
      <Hero />
      <ProofHighlights />
      <FastHelpSection />

      <ErrorBoundary componentName="Projects">
        <Suspense fallback={<ProjectsLoader />}>
          <Projects />
        </Suspense>
      </ErrorBoundary>

      <ProcessSection />
      <EmergencyCTA />

      <ErrorBoundary componentName="Skills">
        <Suspense fallback={<SkillsSkeleton />}>
          <Skills />
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
    </>
  )
}

export default HomePage
