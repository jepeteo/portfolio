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

const categoryColors = {
  Business:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Gaming:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Portfolio: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Web App": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  Tool: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Productivity:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
}

const statusColors = {
  Live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "In Development":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
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
      <p className="py-12 text-center text-slate-600 dark:text-slate-400">
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
            <div className="absolute -right-3 -top-3 z-20 flex items-center gap-1 rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-700 shadow-lg dark:text-yellow-300">
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
                    project.type === "client"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
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
                <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="mr-1 h-3 w-3" aria-hidden="true" />
                  {project.year}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {project.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 3).map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-1 text-xs text-slate-400">
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
                    className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <Github className="h-3 w-3" aria-hidden="true" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                {project.status === "Live" && (
                  <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full bg-emerald-500",
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
