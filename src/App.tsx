import React, { lazy, Suspense } from "react"
import Hero from "./components/Hero"
import ModernSkills from "./components/ModernSkills"
import ModernExperience from "./components/ModernExperience"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import ModernHeader from "./components/navigation/ModernHeader"
import ModernBio from "./components/ModernBio"
import ModernCertificates from "./components/ModernCertificates"
import ReactProjects from "./components/ReactProjects"
import ErrorBoundary from "./components/ErrorBoundary"
import Loading from "./components/Loading"
import { BackToTopButton } from "./components/ui/BackToTopButton"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import useSEO from "./hooks/useSEO"
import useServiceWorker from "./hooks/useServiceWorker"

import "flowbite"
import "flowbite/dist/flowbite.css"

const ModernProjects = lazy(() => import("./components/ModernProjects"))

const AppContent: React.FC = () => {
  const { isDark } = useTheme()

  // Initialize service worker for performance
  useServiceWorker()

  // SEO configuration
  useSEO({
    title: "Theodoros Mentis - Senior Full Stack Developer Portfolio",
    description:
      "Senior Full Stack Developer with 15+ years of experience in WordPress, React, and modern web technologies. Specializing in scalable web solutions and server administration.",
    keywords:
      "theodoros mentis, full stack developer, wordpress expert, react developer, web development, javascript, typescript, php, mysql, server administration, greece developer",
    ogTitle: "Theodoros Mentis - Senior Full Stack Developer",
    ogDescription:
      "Experienced developer creating seamless web experiences with WordPress, React, and modern web technologies.",
    schema: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
      description:
        "Senior Full Stack Developer specializing in WordPress, React, and modern web technologies",
      url: "https://jepeteo.github.io/portfolio/",
      sameAs: [
        "https://www.linkedin.com/in/thmentis/",
        "https://github.com/jepeteo",
      ],
      knowsAbout: [
        "WordPress Development",
        "React Development",
        "Full Stack Development",
        "Server Administration",
        "Web Development",
      ],
    },
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
        <ModernExperience />
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <ModernProjects />
          </Suspense>
        </ErrorBoundary>
        <ReactProjects />
        <ModernCertificates />
        <Contact />
        <BackToTopButton />
      </main>
      <Footer />
      {/* Remove the extra wrapper */}
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
