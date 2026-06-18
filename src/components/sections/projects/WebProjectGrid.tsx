import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ExternalLink,
  Globe,
  Code,
  Star,
  Github,
  Calendar,
} from "lucide-react"
import {
  getWebProjectsForTab,
  getWebProjectGradient,
  getWebProjectInitials,
  type WebProject,
} from "../../../content/projects"
import { generateWebProjectSchema } from "../../../content/schemas/projectsSchema"
import type { ProjectTab } from "../../../config/navigation"
import ProjectServiceTags from "../../services/ProjectServiceTags"
import SurfaceCard from "../../ui/SurfaceCard"
import ProjectCardOverlay from "./ProjectCardOverlay"
import { BlurImage } from "../../system/loading/LoadingStates"
import { useMotionConfig } from "../../../hooks/useMotionConfig"
import { cn } from "../../../utils/styles"

const ProjectSchema: React.FC<{ project: WebProject }> = ({ project }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(generateWebProjectSchema(project), null, 2),
    }}
  />
)

const v2Chip =
  "border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 text-[var(--v2-muted)]"

const categoryColors = {
  Business: v2Chip,
  Gaming: v2Chip,
  Portfolio: v2Chip,
  "Web App": v2Chip,
  Tool: v2Chip,
  Productivity: v2Chip,
}

const statusColors = {
  Live: "border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/15 text-[var(--v2-ok)]",
  "In Development": v2Chip,
}

type WebProjectGridProps = {
  type: Exclude<ProjectTab, "wordpress">
}

const WebProjectThumbnail: React.FC<{ project: WebProject }> = ({ project }) => {
  const [imageError, setImageError] = useState(false)
  const gradient = getWebProjectGradient(project.category)
  const initials = getWebProjectInitials(project.title)

  if (project.imageUrl && !imageError) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <BlurImage
          src={project.imageUrl}
          alt={`${project.title} preview`}
          containerClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          aspectRatio="auto"
          onError={() => setImageError(true)}
        />
        <ProjectCardOverlay
          href={project.url}
          ariaLabel={`View ${project.title} project`}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient
      )}
    >
      <span className="text-4xl font-bold text-white/90">{initials}</span>
      <ProjectCardOverlay
        href={project.url}
        ariaLabel={`View ${project.title} project`}
      />
    </div>
  )
}

const WebProjectGrid: React.FC<WebProjectGridProps> = ({ type }) => {
  const projects = getWebProjectsForTab(type)
  const { stagger, pulseClass } = useMotionConfig()

  if (projects.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--v2-muted)]">
        No projects in this category yet.
      </p>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: WebProject, index: number) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stagger(index) }}
          viewport={{ once: true, margin: "-40px" }}
          className="group relative"
        >
          <ProjectSchema project={project} />

          {project.featured && (
            <div className="absolute -right-3 -top-3 z-20 flex items-center gap-1 rounded-full bg-[var(--v2-acid)] px-3 py-1.5 text-xs font-bold text-[var(--v2-acid-ink)] shadow-lg">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Featured
            </div>
          )}

          <SurfaceCard
            interactive
            className="h-full overflow-hidden p-0"
          >
            <WebProjectThumbnail project={project} />

            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    v2Chip
                  )}
                >
                  {project.type === "client" ? (
                    <>
                      <Globe className="mr-1 h-3 w-3" aria-hidden="true" />
                      Client Work
                    </>
                  ) : (
                    <>
                      <Code className="mr-1 h-3 w-3" aria-hidden="true" />
                      Personal
                    </>
                  )}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium uppercase tracking-wider",
                    statusColors[project.status as keyof typeof statusColors]
                  )}
                >
                  {project.status}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium uppercase tracking-wider",
                    categoryColors[
                      project.category as keyof typeof categoryColors
                    ]
                  )}
                >
                  {project.category}
                </span>
                <span className="flex items-center text-xs text-[var(--v2-soft)]">
                  <Calendar className="mr-1 h-3 w-3" aria-hidden="true" />
                  {project.year}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold tracking-tight text-[var(--v2-text)] transition-colors group-hover:text-[var(--v2-acid)]">
                {project.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-[var(--v2-muted)]">
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 3).map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-2 py-1 text-xs text-[var(--v2-muted)]"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-1 text-xs text-[var(--v2-soft)]">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>

              {project.servicesDemonstrated && (
                <ProjectServiceTags tags={project.servicesDemonstrated} />
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm font-medium text-[var(--v2-brand)] transition-colors hover:text-[var(--v2-acid)]"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm font-medium text-[var(--v2-muted)] transition-colors hover:text-[var(--v2-text)]"
                    >
                      <Github className="h-3 w-3" aria-hidden="true" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                {project.status === "Live" && (
                  <div className="flex items-center space-x-1 text-[var(--v2-ok)]">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full bg-[var(--v2-ok)]",
                        pulseClass
                      )}
                    />
                    <span className="text-xs font-medium">Online</span>
                  </div>
                )}
              </div>
            </div>
          </SurfaceCard>
        </motion.div>
      ))}
    </div>
  )
}

export default WebProjectGrid
