import React from "react"
import { motion } from "framer-motion"
import {
  ExternalLink,
  Globe,
  Code,
  Star,
  Github,
  Calendar,
} from "lucide-react"
import { useTheme } from "../../../context/ThemeContext"
import { getWebProjectsForTab, type WebProject } from "../../../content/projects"
import { generateWebProjectSchema } from "../../../content/schemas/projectsSchema"
import type { ProjectTab } from "../../../config/navigation"
import ProjectServiceTags from "../../services/ProjectServiceTags"

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

const typeColors = {
  client: "border-l-4 border-green-500",
  personal: "border-l-4 border-blue-500",
}

type WebProjectGridProps = {
  type: Exclude<ProjectTab, "wordpress">
}

const WebProjectGrid: React.FC<WebProjectGridProps> = ({ type }) => {
  const { isDark } = useTheme()
  const projects = getWebProjectsForTab(type)

  if (projects.length === 0) {
    return (
      <p
        className={`text-center py-12 ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        No projects in this category yet.
      </p>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project: WebProject, index: number) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`rounded-2xl p-6 border shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group relative ${
            isDark
              ? "bg-slate-800/50 border-slate-700 hover:border-primary/40"
              : "bg-white border-slate-200 hover:border-primary/40"
          } ${
            project.featured
              ? isDark
                ? "ring-2 ring-blue-400/20"
                : "ring-2 ring-blue-500/20"
              : ""
          } ${typeColors[project.type as keyof typeof typeColors]}`}
        >
          <ProjectSchema project={project} />

          {project.featured && (
            <div className="absolute -top-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg">
              <Star className="w-4 h-4" fill="currentColor" />
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                project.type === "client"
                  ? isDark
                    ? "bg-green-900/30 text-green-300"
                    : "bg-green-100 text-green-800"
                  : isDark
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {project.type === "client" ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Client Work
                </>
              ) : (
                <>
                  <Code className="w-3 h-3 mr-1" />
                  Personal
                </>
              )}
            </span>
          </div>

          <div className="mt-8 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
                    categoryColors[
                      project.category as keyof typeof categoryColors
                    ]
                  }`}
                >
                  {project.category}
                </span>
                <span
                  className={`text-xs flex items-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {project.year}
                </span>
              </div>

              <span
                className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
                  statusColors[project.status as keyof typeof statusColors]
                }`}
              >
                {project.status}
              </span>
            </div>

            <h3
              className={`text-xl font-semibold mb-3 transition-colors ${
                isDark
                  ? "text-white group-hover:text-blue-400"
                  : "text-gray-900 group-hover:text-blue-600"
              }`}
            >
              {project.title}
            </h3>

            <p
              className={`mb-4 text-sm leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.slice(0, 3).map((tech: string) => (
                <span
                  key={tech}
                  className={`px-2 py-1 text-xs rounded-full ${
                    isDark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tech}
                </span>
              ))}
              {project.tech.length > 3 && (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  +{project.tech.length - 3}
                </span>
              )}
            </div>

            {project.servicesDemonstrated && (
              <ProjectServiceTags tags={project.servicesDemonstrated} />
            )}

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-2 font-medium text-sm transition-colors ${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 font-medium text-sm transition-colors ${
                      isDark
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Github className="w-3 h-3" />
                    <span>Code</span>
                  </a>
                )}
              </div>

              {project.status === "Live" && (
                <div
                  className={`flex items-center space-x-1 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Online</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default WebProjectGrid
