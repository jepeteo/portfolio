import React, { useState, useMemo, memo, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import myProjects from "../assets/myProjects.json"
import { Project } from "../types"
import { isValidProject } from "../utils/validation"
import {
  ExternalLink,
  Star,
  Code,
  Globe,
  Layers,
  Image as ImageIcon,
} from "lucide-react"

const ModernProjects = memo(() => {
  // Removed expensive render tracking for performance

  const { isDark } = useTheme()
  const [projectType, setProjectType] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const { targetRef: ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const projectsPerPage = 6

  // Validate and filter projects - optimized for performance
  const validatedProjects = useMemo(() => {
    return myProjects
      .filter((project: any): project is any => isValidProject(project))
      .map((project, index) => ({
        ...project,
        id: `project-${index}-${project.prName
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        prTags: Array.isArray(project.prTags)
          ? project.prTags
          : typeof project.prTags === "string"
          ? [project.prTags]
          : [],
      })) as Project[]
  }, [])

  // Get unique project types for filter - optimized
  const projectTypes = useMemo(() => {
    return Array.from(
      new Set(validatedProjects.map((project) => project.prType))
    ).sort()
  }, [validatedProjects])

  const filteredProjects = useMemo(() => {
    const filtered =
      projectType === null
        ? validatedProjects
        : validatedProjects.filter((project) => project.prType === projectType)

    // Sort: featured first, then alphabetically
    const featured = filtered.filter((project) => project.prFeatured)
    const nonFeatured = filtered
      .filter((project) => !project.prFeatured)
      .sort((a, b) => a.prName.localeCompare(b.prName))

    return [...featured, ...nonFeatured]
  }, [projectType, validatedProjects])

  // Pagination logic - optimized
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const displayProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage
    return filteredProjects.slice(startIndex, startIndex + projectsPerPage)
  }, [filteredProjects, currentPage, projectsPerPage])

  const handleProjectTypeChange = useCallback((type: string | null) => {
    setProjectType(type)
    setCurrentPage(1)
  }, [])

  // Handle image errors - optimized
  const handleImageError = useCallback((projectName: string) => {
    setImageErrors((prev) => new Set(prev).add(projectName))
  }, [])

  // Project type icons - simplified for better performance
  const getProjectIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      WordPress: Layers,
      "E-commerce": Globe,
      Portfolio: Star,
      Business: Code,
    }
    return icons[type] || Code
  }

  // Project card component - heavily optimized for performance
  const ProjectCard = memo(
    ({
      project,
      index,
      isDark,
    }: {
      project: Project
      index: number
      isDark: boolean
    }) => {
      // Removed expensive render tracking for production performance

      // Simplified icon selection without useMemo
      const IconComponent = getProjectIcon(project.prType)

      // Simple image path construction
      const imageSlug =
        (project as any).prImageSlug ||
        project.prName.toLowerCase().replace(/\s+/g, "-")
      const imageSrc = `./images/projects/${imageSlug}.webp`

      const hasImageError = imageErrors.has(project.prName)

      // Simplified image loading state - optimized
      const [imageError, setImageError] = React.useState(false)
      const [imageLoading, setImageLoading] = React.useState(true)

      // Reset image loading state when project changes - optimized
      React.useEffect(() => {
        setImageError(false)
        setImageLoading(true)
      }, [project.prName])

      const handleImageLoad = React.useCallback(() => {
        setImageError(false)
        setImageLoading(false)
      }, [])

      const handleImageErrorLocal = React.useCallback(() => {
        setImageError(true)
        setImageLoading(false)
        handleImageError(project.prName)
      }, [handleImageError, project.prName])

      return (
        <div
          className={`relative group transition-all duration-500 transform hover:scale-[1.02] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {project.prFeatured && (
            <div
              className={`absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
                isDark
                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                  : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
              }`}
            >
              <Star className="w-4 h-4" />
              Featured
            </div>
          )}

          <div
            className={`h-full overflow-hidden rounded-2xl transition-all duration-500 border ${
              isDark
                ? "bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50"
                : "bg-white/50 backdrop-blur-sm border-slate-200 hover:border-blue-500/50"
            }`}
          >
            {/* Project Image */}
            <div className="relative w-full h-64 overflow-hidden">
              {!hasImageError && !imageError ? (
                <>
                  <img
                    src={imageSrc}
                    alt={`${project.prName} project preview`}
                    className={`w-full h-full object-cover object-top transition-all duration-[3000ms] ease-in-out group-hover:object-bottom ${
                      imageLoading ? "opacity-50" : "opacity-100"
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageErrorLocal}
                    loading="lazy"
                  />
                  {/* Loading indicator */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {/* Image Overlay */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isDark
                        ? "bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"
                        : "bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"
                    }`}
                  />
                  {/* View Project button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <a
                      href={project.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-slate-900 rounded-xl font-medium text-sm transition-all hover:scale-105 shadow-lg"
                      aria-label={`View ${project.prName} project`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  </div>
                </>
              ) : (
                // Fallback when image fails to load
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-slate-700 to-slate-800"
                      : "bg-gradient-to-br from-slate-100 to-slate-200"
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? "bg-slate-600/50 text-slate-400"
                        : "bg-slate-300/50 text-slate-500"
                    }`}
                  >
                    <ImageIcon className="w-10 h-10" />
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300"
                      : "bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDark
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {project.prType}
                </span>
              </div>

              {/* Project Title */}
              <h3
                className={`text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {project.prName}
              </h3>

              {/* Description */}
              <p
                className={`text-sm mb-3 leading-relaxed line-clamp-2 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {project.prDescription}
              </p>

              {/* Footer - Only show if image failed to load */}
              {hasImageError && (
                <div className="flex items-center justify-center mt-4">
                  <a
                    href={project.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                      isDark
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                    }`}
                    aria-label={`View ${project.prName} project`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    // Simplified comparison function for better performance
    (prevProps, nextProps) => {
      return (
        prevProps.project.prName === nextProps.project.prName &&
        prevProps.isDark === nextProps.isDark
      )
    }
  )

  // Set display name for ProjectCard
  ProjectCard.displayName = "ProjectCard"

  // Main return statement for ModernProjects
  return (
    <section
      ref={ref}
      id="projects"
      className={`relative min-h-screen py-24 transition-all duration-1000 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="text-blue-500 font-semibold">
              Portfolio & Projects
            </span>
          </div>

          <h2
            className={`text-5xl md:text-7xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              My Work
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Explore my portfolio of web development projects, from WordPress
            sites to modern React applications. Each project represents a unique
            challenge and creative solution.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => handleProjectTypeChange(null)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 ${
              projectType === null
                ? isDark
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                : isDark
                ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                : "bg-white/50 text-slate-600 hover:bg-white border border-slate-200"
            }`}
          >
            All Projects ({validatedProjects.length})
          </button>
          {projectTypes.map((type: string) => {
            const count = validatedProjects.filter(
              (project) => project.prType === type
            ).length
            return (
              <button
                key={type}
                onClick={() => handleProjectTypeChange(type)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                  projectType === type
                    ? isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                    : isDark
                    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    : "bg-white/50 text-slate-600 hover:bg-white border border-slate-200"
                }`}
              >
                {React.createElement(getProjectIcon(type), {
                  className: "w-4 h-4",
                })}
                {type} ({count})
              </button>
            )
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mb-12">
          {displayProjects.map((project: Project, index: number) => (
            <ProjectCard
              key={project.prName}
              project={project}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Results Info */}
        <div className="text-center mt-8">
          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Showing {displayProjects.length} of {filteredProjects.length}{" "}
            projects
            {projectType && ` (filtered by ${projectType})`} • Page{" "}
            {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    </section>
  )

  // Smart pagination component
})

ModernProjects.displayName = "ModernProjects"
export default ModernProjects
