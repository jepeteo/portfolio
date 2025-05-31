import React, { useState, useMemo, useCallback, memo } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import myProjects from "../assets/myProjects.json"
import { Project } from "../types"
import { isValidProject } from "../utils/validation"
import {
  ExternalLink,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Code,
  Globe,
  Layers,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react"

const ModernProjects = memo(() => {
  const { isDark } = useTheme()
  const [projectType, setProjectType] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const { targetRef: ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const projectsPerPage = 6

  // Validate and filter projects
  const validatedProjects = useMemo(() => {
    return myProjects.filter((project: any): project is Project =>
      isValidProject(project)
    )
  }, [])

  // Get unique project types for filter
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

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const displayProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage
    return filteredProjects.slice(startIndex, startIndex + projectsPerPage)
  }, [filteredProjects, currentPage, projectsPerPage])

  const handleProjectTypeChange = useCallback((type: string | null) => {
    setProjectType(type)
    setCurrentPage(1)
  }, [])

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    },
    [totalPages]
  )

  // Handle image errors
  const handleImageError = useCallback((projectName: string) => {
    setImageErrors((prev) => new Set(prev).add(projectName))
  }, [])

  // Get image path for project - Fixed to handle missing prImageSlug
  const getImagePath = (project: Project) => {
    // Type assertion to access prImageSlug if it exists
    const projectWithImage = project as Project & { prImageSlug?: string }
    const imageSlug =
      projectWithImage.prImageSlug ||
      project.prName.toLowerCase().replace(/\s+/g, "-")

    return `./images/projects/${imageSlug}.webp`
  }

  // Project type icons
  const getProjectIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      WordPress: Layers,
      "E-commerce": Globe,
      Portfolio: Star,
      Business: Code,
    }
    return icons[type] || Code
  }

  // Project card component
  const ProjectCard = memo(
    ({ project, index }: { project: Project; index: number }) => {
      const IconComponent = getProjectIcon(project.prType)
      const imagePath = getImagePath(project)
      const hasImageError = imageErrors.has(project.prName)

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
              {!hasImageError ? (
                <>
                  <img
                    src={imagePath}
                    alt={`${project.prName} project preview`}
                    className="w-full h-full object-cover object-top transition-all duration-[3000ms] ease-in-out group-hover:object-bottom"
                    onError={() => handleImageError(project.prName)}
                    loading="lazy"
                  />
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
    }
  )

  // Set display name for ProjectCard
  ProjectCard.displayName = "ProjectCard"

  // Smart pagination component
  const SmartPagination = memo(() => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages: (number | string)[] = []
      const maxVisiblePages = 5

      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)

        if (currentPage <= 3) {
          // Near the beginning
          pages.push(2, 3, 4, "...", totalPages)
        } else if (currentPage >= totalPages - 2) {
          // Near the end
          pages.push(
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          )
        } else {
          // In the middle
          pages.push(
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
          )
        }
      }

      return pages
    }

    return (
      <nav
        className="flex justify-center mt-12"
        aria-label="Projects pagination"
      >
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 1
                ? isDark
                  ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span
                  className={`px-3 py-2 text-sm ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <button
                  onClick={() => goToPage(page as number)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages
                ? isDark
                  ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
            aria-label="Go to next page"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>
    )
  })

  // Set display name for SmartPagination
  SmartPagination.displayName = "SmartPagination"

  if (validatedProjects.length === 0) {
    return (
      <section className="container py-20" id="projects">
        <div className="text-center">
          <h2
            className={`text-4xl md:text-6xl font-display font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Projects
          </h2>
          <p
            className={`text-xl ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            No projects available at the moment.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      id="projects"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            Portfolio Showcase
          </div>

          <h2
            className={`text-4xl md:text-6xl font-display font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
              WordPress Projects
            </span>
          </h2>

          <p
            className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Below are some selected projects I have worked on over the years.
            The majority of these projects were developed using WordPress, and
            are projects made from scratch. I was responsible for the design,
            coding, and the functionality of the websites.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12">
          <div
            className={`flex items-center gap-2 mb-6 justify-center ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by Type:</span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {/* All Projects Button */}
            <button
              onClick={() => handleProjectTypeChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                projectType === null
                  ? isDark
                    ? "bg-blue-500/30 text-blue-300 border-2 border-blue-500"
                    : "bg-blue-100 text-blue-700 border-2 border-blue-500"
                  : isDark
                  ? "bg-slate-800/50 text-slate-300 border border-slate-600 hover:border-blue-400"
                  : "bg-white/50 text-slate-700 border border-slate-300 hover:border-blue-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                All ({validatedProjects.length})
              </span>
            </button>

            {/* Type Filter Buttons */}
            {projectTypes.map((type) => {
              const count = validatedProjects.filter(
                (p) => p.prType === type
              ).length
              const IconComponent = getProjectIcon(type)

              return (
                <button
                  key={type}
                  onClick={() => handleProjectTypeChange(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    projectType === type
                      ? isDark
                        ? "bg-blue-500/30 text-blue-300 border-2 border-blue-500"
                        : "bg-blue-100 text-blue-700 border-2 border-blue-500"
                      : isDark
                      ? "bg-slate-800/50 text-slate-300 border border-slate-600 hover:border-blue-400"
                      : "bg-white/50 text-slate-700 border border-slate-300 hover:border-blue-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {type} ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mb-12">
          {displayProjects.map((project: Project, index: number) => (
            <ProjectCard key={project.prName} project={project} index={index} />
          ))}
        </div>

        <SmartPagination />

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
})

ModernProjects.displayName = "ModernProjects"
export default ModernProjects
