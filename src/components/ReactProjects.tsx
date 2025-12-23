import React, { memo, useMemo, useState } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import { validateReactProject } from "../utils/validation"
import { ModernReactProject } from "../types"
import reactProjectsData from "../assets/myReactProjects.json"
import { Code2, ExternalLink, Github, Zap, Star, Calendar } from "lucide-react"
import { NoDataAvailable } from "./ui/EmptyState"

const ReactProjects: React.FC = memo(() => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const validReactProjects = useMemo(() => {
    return reactProjectsData.filter(
      (project: ModernReactProject): project is ModernReactProject =>
        validateReactProject(project)
    )
  }, [])

  if (validReactProjects.length === 0) {
    return (
      <section className="container py-20" id="react-projects">
        <div className="text-center mb-8">
          <h2
            className={`text-4xl md:text-6xl font-display font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            React Projects
          </h2>
        </div>
        <NoDataAvailable dataType="React projects" />
      </section>
    )
  }

  return (
    <section
      ref={targetRef}
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      id="react-projects"
    >
      <div className="container">
        
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-cyan-100 text-cyan-700 border border-cyan-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            React Development
          </div>

          <h2
            className={`text-6xl md:text-8xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Innovations I've Shipped
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Modern React applications built with cutting-edge technologies and
            best practices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {validReactProjects.map((project, index) => (
            <div
              key={project.id || `react-project-${index}`}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-[1.02] ${
                hoveredProject === project.id ? "z-10" : ""
              } ${
                isDark
                  ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50"
                  : "bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-cyan-500/50"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() =>
                setHoveredProject(project.id || `react-project-${index}`)
              }
              onMouseLeave={() => setHoveredProject(null)}
            >
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300"
                        : "bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600"
                    }`}
                  >
                    <Code2 className="w-8 h-8" />
                  </div>

                  <div className="flex flex-col gap-2">
                    
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "completed"
                          ? isDark
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-green-100 text-green-700 border border-green-200"
                          : isDark
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {project.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </div>

                    {project.featured && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          isDark
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-purple-100 text-purple-700 border border-purple-200"
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>

                <h3
                  className={`text-2xl font-bold mb-3 group-hover:text-cyan-500 transition-colors ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {project.title}
                </h3>

                <p
                  className={`text-base mb-4 leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {project.description}
                </p>

                {project.date && (
                  <div
                    className={`flex items-center gap-2 mb-6 text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{project.date}</span>
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-6">
                    <h4
                      className={`text-sm font-medium mb-3 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies
                        .slice(0, 6)
                        .map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 ${
                              isDark
                                ? "bg-slate-700/80 text-slate-300 border border-slate-600"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      {project.technologies.length > 6 && (
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isDark
                              ? "bg-slate-700/60 text-slate-400 border border-slate-600"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          +{project.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {project.performance && (
                  <div className="mb-6 flex items-center gap-2">
                    <Zap
                      className={`w-4 h-4 ${
                        isDark ? "text-yellow-400" : "text-yellow-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {project.performance} Performance Score
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                        isDark
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105 ${
                        isDark
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div
            className={`p-8 rounded-2xl ${
              isDark
                ? "bg-slate-800/30 backdrop-blur-sm border border-slate-700"
                : "bg-white/30 backdrop-blur-sm border border-slate-200"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-6 text-center ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Technologies Overview
            </h3>

            <div className="flex flex-wrap justify-center gap-3">
              {Array.from(
                new Set(
                  validReactProjects.flatMap(
                    (project) => project.technologies || []
                  )
                )
              ).map((tech, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 cursor-default ${
                    isDark
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-cyan-100 text-cyan-700 border border-cyan-200"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <p
              className={`text-center mt-6 text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {validReactProjects.length} projects built with{" "}
              {
                Array.from(
                  new Set(
                    validReactProjects.flatMap(
                      (project) => project.technologies || []
                    )
                  )
                ).length
              }{" "}
              different technologies
            </p>
          </div>
        </div>
      </div>
    </section>
  )
})

ReactProjects.displayName = "ReactProjects"
export default ReactProjects
