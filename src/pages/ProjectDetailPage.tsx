import React from "react"
import { Link, useParams } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { site } from "../config/site"
import { allNormalizedProjects } from "../content/projectTaxonomy"
import { featuredCaseStudies } from "../content/caseStudies"
import { v2SecondaryButton } from "../components/ui/v2Styles"

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const project = allNormalizedProjects().find((item) => item.slug === slug)
  const study = featuredCaseStudies.find(
    (item) => item.id === slug || item.sourceProjectId === slug
  )

  const title = study?.title ?? project?.title ?? "Project"
  const description = study?.problem ?? project?.description ?? ""

  useEnhancedSEO({
    title: `${title} | ${site.name}`,
    description: description.slice(0, 155),
    canonical: `${site.url}/projects/${slug ?? ""}`,
    ogUrl: `${site.url}/projects/${slug ?? ""}`,
    ogType: "article",
  })

  if (!project && !study) {
    return (
      <V2PageHero
        id="project-missing"
        eyebrow="Projects"
        title="This project is not in the archive."
        subtitle="It may have been renamed. Browse the full project list instead."
      >
        <Link to="/projects" className={v2SecondaryButton}>
          View all projects
        </Link>
      </V2PageHero>
    )
  }

  return (
    <div>
      <V2PageHero
        id="project-detail"
        eyebrow={project?.source === "wordpress" ? "WordPress" : "Project"}
        title={title}
        subtitle={description}
      />
      <section className="container mx-auto max-w-3xl space-y-6 px-6 py-16">
        {study?.approach ? (
          <p className="text-lg text-[var(--v2-muted)]">{study.approach}</p>
        ) : null}
        {study?.outcome ? (
          <p className="text-lg text-[var(--v2-muted)]">{study.outcome}</p>
        ) : null}
        <ul className="flex flex-wrap gap-2">
          {(study?.stack ?? project?.technologies ?? []).map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--v2-line)] px-3 py-1 font-mono text-xs text-[var(--v2-muted)]"
            >
              {item}
            </li>
          ))}
        </ul>
        {project?.url || study?.url ? (
          <a
            href={study?.url ?? project?.url}
            className={v2SecondaryButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live site
          </a>
        ) : null}
      </section>
    </div>
  )
}

export default ProjectDetailPage
