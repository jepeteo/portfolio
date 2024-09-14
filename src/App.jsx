import React, { lazy, Suspense } from "react"
import Hero from "./components/Hero"
import Skills from "./components/Skills"
import Experience from "./components/Experience"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Bio from "./components/Bio"
import Certificates from "./components/Certificates"
import ReactProjects from "./components/ReactProjects"

import "flowbite"
import "flowbite/dist/flowbite.css"

const Projects = lazy(() => import("./components/Projects"))

function App() {
  const [darkMode, setDarkMode] = React.useState(true)
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
