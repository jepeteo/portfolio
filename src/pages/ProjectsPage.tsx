import React from "react"
import { Link } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import ProjectsArchive from "../components/sections/projects/ProjectsArchive"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { featuredCaseStudies } from "../content/caseStudies"
import { allNormalizedProjects } from "../content/projectTaxonomy"
import { site } from "../config/site"
import { v2Panel } from "../components/ui/v2Styles"

const ProjectsPage: React.FC = () => {
  useRoutePageMeta("/projects")
  const publicCount = allNormalizedProjects().length

  return (
    <div>
      <V2PageHero
        id="projects-hero"
        eyebrow="Projects"
        title="Client delivery, WordPress, and product work in one archive."
        subtitle="Explore selected client delivery, product work and technical experiments by domain, role and technology."
      />
      <p className="container mx-auto max-w-6xl px-6 pb-8 text-sm text-[var(--v2-muted)]">
        {site.stats.projectCountLabel} is the total number of projects
        delivered. {publicCount} are currently documented in this public
        archive.
      </p>
      <section className="container mx-auto max-w-6xl px-6 pb-10">
        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
          Featured case studies
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {featuredCaseStudies.map((study) => (
            <li key={study.id}>
              <Link to={`/projects/${study.id}`} className={`${v2Panel} block p-5`}>
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                  {study.label}
                </p>
                <h3 className="mt-2 font-bold text-[var(--v2-text)]">{study.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ProjectsArchive />
    </div>
  )
}

export default ProjectsPage
