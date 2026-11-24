import React from "react"
import { Download } from "lucide-react"
import V2PageHero from "../components/ui/V2PageHero"
import Experience from "../components/sections/Experience"
import { v2SecondaryButton } from "../components/ui/v2Styles"
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
      >
        <a
          href={site.cvPath}
          target="_blank"
          rel="noopener noreferrer"
          className={v2SecondaryButton}
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Download CV
        </a>
      </V2PageHero>
      <Experience />
    </div>
  )
}

export default ExperiencePage
