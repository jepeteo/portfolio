import React, { useCallback, useEffect, useState } from "react"
import SectionShell from "../../ui/SectionShell"
import ProjectTabBar from "./ProjectTabBar"
import WordPressProjectGrid from "./WordPressProjectGrid"
import WebProjectGrid from "./WebProjectGrid"
import { projectTabFromSearch, type ProjectTab } from "../../../config/navigation"
import {
  generateWebProjectsSchema,
  generateWordPressProjectsSchema,
} from "../../../content/schemas/projectsSchema"
import {
  getWebProjectsForTab,
  wordpressProjects,
} from "../../../content/projects"

const getInitialTab = (): ProjectTab => {
  if (typeof window === "undefined") return "wordpress"
  const fromQuery = projectTabFromSearch(window.location.search)
  if (fromQuery) return fromQuery
  const hash = window.location.hash
  if (hash.startsWith("#projects")) {
    const queryIndex = hash.indexOf("?")
    if (queryIndex !== -1) {
      const fromHash = projectTabFromSearch(hash.slice(queryIndex))
      if (fromHash) return fromHash
    }
  }
  return "wordpress"
}

const ProjectsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectTab>(getInitialTab)

  const updateTabInUrl = useCallback((tab: ProjectTab) => {
    const base = `${window.location.pathname}#projects`
    const nextUrl =
      tab === "wordpress" ? base : `${base}?tab=${tab}`
    history.replaceState(null, "", nextUrl)
  }, [])

  const handleTabChange = useCallback(
    (tab: ProjectTab) => {
      setActiveTab(tab)
      updateTabInUrl(tab)
    },
    [updateTabInUrl]
  )

  useEffect(() => {
    const syncTabFromUrl = () => {
      const fromQuery = projectTabFromSearch(window.location.search)
      if (fromQuery) {
        setActiveTab(fromQuery)
        return
      }
      const hash = window.location.hash
      if (hash.startsWith("#projects")) {
        const queryIndex = hash.indexOf("?")
        if (queryIndex !== -1) {
          const fromHash = projectTabFromSearch(hash.slice(queryIndex))
          if (fromHash) setActiveTab(fromHash)
        }
      }
    }

    window.addEventListener("hashchange", syncTabFromUrl)
    window.addEventListener("popstate", syncTabFromUrl)
    syncTabFromUrl()

    return () => {
      window.removeEventListener("hashchange", syncTabFromUrl)
      window.removeEventListener("popstate", syncTabFromUrl)
    }
  }, [])

  const schemaPayload =
    activeTab === "wordpress"
      ? generateWordPressProjectsSchema(wordpressProjects)
      : generateWebProjectsSchema(
          activeTab === "client"
            ? getWebProjectsForTab("client")
            : getWebProjectsForTab("personal")
        )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaPayload, null, 2),
        }}
      />
      <SectionShell
        id="projects"
        eyebrow="Portfolio"
        title="Projects"
        subtitle="WordPress client work, modern web apps, and personal builds — organized so you can browse by what matters to you."
        variant="default"
      >
        <ProjectTabBar activeTab={activeTab} onTabChange={handleTabChange} />

        <div
          role="tabpanel"
          id={`projects-panel-${activeTab}`}
          aria-labelledby={`projects-tab-${activeTab}`}
        >
          {activeTab === "wordpress" ? (
            <WordPressProjectGrid />
          ) : (
            <WebProjectGrid type={activeTab} />
          )}
        </div>
      </SectionShell>
    </>
  )
}

export default ProjectsSection
