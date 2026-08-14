import React from "react"
import V2PageHero from "../components/ui/V2PageHero"
import Experience from "../components/sections/Experience"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { freelanceOverlapNote } from "../content/experienceModel"
import { site } from "../config/site"

const ExperiencePage: React.FC = () => {
  useRoutePageMeta("/experience")

  return (
    <div>
      <V2PageHero
        id="experience-hero"
        eyebrow="Experience"
        title="Employment and freelance, in parallel."
        subtitle={`${site.stats.yearsExperienceLabel} years across ${site.stats.projectCountLabel} projects and ${site.stats.clientCountLabel} clients. ${freelanceOverlapNote}`}
      />
      <Experience />
    </div>
  )
}

export default ExperiencePage
