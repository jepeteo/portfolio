import React from "react"
import { Link, useParams } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import CaseStudyTemplate from "../components/sections/caseStudies/CaseStudyTemplate"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { buildProjectPageJsonLd, buildRouteJsonLd, routeMeta } from "../config/routeMeta.js"
import { site } from "../config/site"
import {
  allNormalizedProjects,
  publicProjectDescription,
} from "../content/projectTaxonomy"
import { featuredCaseStudies } from "../content/caseStudies"
import { v2SecondaryButton } from "../components/ui/v2Styles"

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const project = allNormalizedProjects().find((item) => item.slug === slug)
  const study = featuredCaseStudies.find(
    (item) => item.id === slug || item.sourceProjectId === slug
  )

  const title = study?.title ?? project?.title ?? "Project"
  const path = `/projects/${slug ?? ""}`
  const route = routeMeta[path]
  const archiveDescription = `${title} is listed in Theodoros Mentis's public project archive.`
  const seoDescription = route?.description ?? archiveDescription
  const bodyDescription = project
    ? publicProjectDescription(project)
    : archiveDescription
  const structuredData = route
    ? buildRouteJsonLd(path)
    : buildProjectPageJsonLd({
        name: title,
        description: archiveDescription,
        path,
      })
  const ogImage = route?.ogImage ?? `${site.url}/social-card.webp`

  useEnhancedSEO({
    title: `${title} | ${site.name}`,
    description: seoDescription,
    canonical: `${site.url}${path}`,
    ogUrl: `${site.url}${path}`,
    ogType: "article",
    ogDescription: seoDescription,
    ogImage,
    twitterDescription: seoDescription,
    twitterImage: ogImage,
    structuredData,
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
        eyebrow={study?.label ?? (project?.engineering ? "Engineering" : "Project")}
        title={title}
        subtitle={study ? undefined : bodyDescription}
      />
      <section className="container mx-auto max-w-3xl space-y-6 px-6 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--v2-muted)]">
          <ol className="m-0 flex flex-wrap gap-2 p-0">
            <li>
              <Link to="/" className="hover:text-[var(--v2-text)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/projects" className="hover:text-[var(--v2-text)]">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--v2-text)]">{title}</li>
          </ol>
        </nav>
        {study ? (
          <CaseStudyTemplate study={study} />
        ) : (
          <>
            <p className="text-lg text-[var(--v2-muted)]">{bodyDescription}</p>
            <ul className="flex flex-wrap gap-2">
              {(project?.technologies ?? []).map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--v2-line)] px-3 py-1 font-mono text-xs text-[var(--v2-muted)]"
                >
                  {item}
                </li>
              ))}
            </ul>
            {project?.url && !project.confidential ? (
              <a
                href={project.url}
                className={v2SecondaryButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit live site
              </a>
            ) : null}
            {project?.githubUrl ? (
              <a
                href={project.githubUrl}
                className={v2SecondaryButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                View source
              </a>
            ) : null}
          </>
        )}
        <Link to="/projects" className="inline-block font-bold text-[var(--v2-muted)]">
          Back to projects
        </Link>
      </section>
    </div>
  )
}

export default ProjectDetailPage
