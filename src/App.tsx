import React, { lazy, Suspense } from "react"
import Hero from "./components/Hero.tsx"
import Skills from "./components/Skills.tsx"
import Experience from "./components/Experience.tsx"
import Contact from "./components/Contact.tsx"
import Footer from "./components/Footer.tsx"
import Header from "./components/Header.tsx"
import Bio from "./components/Bio.tsx"
import Certificates from "./components/Certificates.tsx"
import ReactProjects from "./components/ReactProjects.tsx"

import "flowbite"
import "flowbite/dist/flowbite.css"

const Projects = lazy(() => import("./components/Projects.tsx"))

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState<boolean>(true)
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="{darkMode ? 'dark' : ''}">
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Hero />
      <Bio />
      <Skills />
      <Experience />
      <Certificates />
      <ReactProjects />
      <Suspense fallback={<div>Loading...</div>}>
        <Projects />
      </Suspense>
      <Contact />
      <Footer />
    </div>
  )
}

export default App
