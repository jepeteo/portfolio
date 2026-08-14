import React from "react"
import { Link } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { engineeringProjects } from "../content/projectTaxonomy"

const EngineeringPage: React.FC = () => {
  useRoutePageMeta("/engineering")
  const projects = engineeringProjects()

  return (
    <div>
      <V2PageHero
        id="engineering-hero"
        eyebrow="Engineering"
        title="Applications, tools, and technical experiments."
        subtitle="React, TypeScript, internal tools, and self-hosted work — kept separate from client WordPress delivery so both audiences can find what they need."
      />
      <section className="container mx-auto max-w-6xl px-6 py-16">
        <ul className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                to={`/projects/${project.slug}`}
                className="block rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 transition-colors hover:border-[var(--v2-acid)]/40"
              >
                <h2 className="m-0 font-display text-xl font-bold tracking-tight text-[var(--v2-text)]">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--v2-muted)]">
                  {project.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default EngineeringPage
