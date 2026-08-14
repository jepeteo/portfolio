import React from "react"
import { Link } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import ProjectsArchive from "../components/sections/projects/ProjectsArchive"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { featuredCaseStudies } from "../content/caseStudies"
import { v2Panel } from "../components/ui/v2Styles"

const ProjectsPage: React.FC = () => {
  useRoutePageMeta("/projects")

  return (
    <div>
      <V2PageHero
        id="projects-hero"
        eyebrow="Projects"
        title="Client delivery, WordPress, and product work in one archive."
        subtitle="Filter by ownership, domain, and work type together — not as mutually exclusive WordPress / Client / Personal tabs."
      />
      <p className="container mx-auto max-w-6xl px-6 pb-8 text-sm text-[var(--v2-muted)]">
        Historical delivery windows are not a promise for new work. Current
        quotes are scoped per job before production access changes hands.
      </p>
      <section className="container mx-auto max-w-6xl px-6 pb-10">
        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
          Featured case studies
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
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
