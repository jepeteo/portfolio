import React from "react"
import V2PageHero from "../components/ui/V2PageHero"
import ProjectsArchive from "../components/sections/projects/ProjectsArchive"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"

const EngineeringPage: React.FC = () => {
  useRoutePageMeta("/engineering")

  return (
    <div>
      <V2PageHero
        id="engineering-hero"
        eyebrow="Engineering"
        title="Applications, tools, and technical experiments."
        subtitle="React, TypeScript, internal tools, and self-hosted work — kept separate from client WordPress delivery so both audiences can find what they need."
      />
      <ProjectsArchive engineeringOnly />
    </div>
  )
}

export default EngineeringPage
