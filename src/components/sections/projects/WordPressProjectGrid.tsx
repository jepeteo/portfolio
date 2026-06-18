import React, { useState, useMemo, memo, useCallback, useEffect } from "react"
import { useTheme } from "../../../context/ThemeContext"
import useIntersectionObserver from "../../../hooks/useIntersectionObserver"
import { useProjectImage } from "../../../hooks/useProjectImage"
import { wordpressProjects } from "../../../content/projects"
import { generateWordPressProjectSchema } from "../../../content/schemas/projectsSchema"
import { Project } from "../../../types"
import { BlurImage } from "../../system/loading/LoadingStates"
import ProjectCardOverlay from "./ProjectCardOverlay"
import {
  ExternalLink,
  Star,
  Code,
  Globe,
  Layers,
  Image as ImageIcon,
  Search,
  X,
  Filter,
} from "lucide-react"

const ProjectSchema: React.FC<{ project: Project }> = ({ project }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(generateWordPressProjectSchema(project), null, 2),
    }}
  />
)

const WordPressProjectGrid = memo(() => {
  const { isDark } = useTheme()
  const [projectType, setProjectType] = useState<string | null>(null)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [shouldLoadImages, setShouldLoadImages] = useState<Set<string>>(
    new Set()
  )
  const [initialImageCount, setInitialImageCount] = useState(4)

  const projectsPerPage = 6

  useEffect(() => {
    const updateInitialImageCount = () => {
      setInitialImageCount(window.innerWidth < 768 ? 2 : 4)
    }

    updateInitialImageCount()
    window.addEventListener("resize", updateInitialImageCount)
    return () => window.removeEventListener("resize", updateInitialImageCount)
  }, [])

  const validatedProjects = wordpressProjects

  const projectTypes = useMemo(() => {
    return Array.from(
      new Set(validatedProjects.map((project) => project.prType))
    ).sort()
  }, [validatedProjects])

  // Extract all unique technologies/tags
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>()
    validatedProjects.forEach((project) => {
      // Use tech field if available, fallback to prTags for backward compatibility
      const techArray = Array.isArray(project.tech)
        ? project.tech
        : Array.isArray(project.prTags)
        ? project.prTags
        : []
      techArray.forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [validatedProjects])

  const filteredProjects = useMemo(() => {
    let filtered = validatedProjects

    // Filter by project type
    if (projectType !== null) {
      filtered = filtered.filter((project) => project.prType === projectType)
    }

    // Filter by technology/tag
    if (selectedTech !== null) {
      filtered = filtered.filter((project) => {
        // Check tech field first, fallback to prTags
        const techArray = Array.isArray(project.tech)
          ? project.tech
          : Array.isArray(project.prTags)
          ? project.prTags
          : []
        return techArray.includes(selectedTech)
      })
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((project) => {
        const techArray = Array.isArray(project.tech)
          ? project.tech
          : Array.isArray(project.prTags)
          ? project.prTags
          : []
        return (
          project.prName.toLowerCase().includes(query) ||
          project.prDescription.toLowerCase().includes(query) ||
          techArray.some((tech: string) =>
            tech.toLowerCase().includes(query)
          ) ||
          project.prType.toLowerCase().includes(query)
        )
      })
    }

    const featured = filtered.filter((project) => project.prFeatured)
    const nonFeatured = filtered
      .filter((project) => !project.prFeatured)
      .sort((a, b) => a.prName.localeCompare(b.prName))

    return [...featured, ...nonFeatured]
  }, [projectType, selectedTech, searchQuery, validatedProjects])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTech, searchQuery])

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const displayProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage
    return filteredProjects.slice(startIndex, startIndex + projectsPerPage)
  }, [filteredProjects, currentPage, projectsPerPage])

  const shouldLoadImageImmediately = useCallback(
    (project: Project, index: number) => {
      return (
        project.prFeatured ||
        index < initialImageCount ||
        shouldLoadImages.has(project.prName)
      )
    },
    [initialImageCount, shouldLoadImages]
  )

  const triggerImageLoad = useCallback((projectName: string) => {
    setShouldLoadImages((prev) => new Set(prev).add(projectName))
  }, [])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage)

      const startIndex = (newPage - 1) * projectsPerPage
      const endIndex = startIndex + projectsPerPage
      const pageProjects = filteredProjects.slice(startIndex, endIndex)

      setShouldLoadImages((prev) => {
        const newSet = new Set(prev)
        pageProjects.forEach((project) => newSet.add(project.prName))
        return newSet
      })
    },
    [filteredProjects, projectsPerPage]
  )

  const generatePaginationNumbers = useCallback(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        if (totalPages > 4) {
          pages.push("...")
          pages.push(totalPages)
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          if (i > 1) pages.push(i)
        }
      } else {
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  React.useEffect(() => {
    const firstProjects = filteredProjects.slice(0, initialImageCount)
    setShouldLoadImages((prev) => {
      const newSet = new Set(prev)
      firstProjects.forEach((project) => newSet.add(project.prName))
      return newSet
    })
  }, [filteredProjects, initialImageCount])

  const handleProjectTypeChange = useCallback(
    (type: string | null) => {
      setProjectType(type)
      setCurrentPage(1)
      const filtered =
        type === null
          ? validatedProjects
          : validatedProjects.filter((project) => project.prType === type)

      const featured = filtered.filter((project) => project.prFeatured)
      const nonFeatured = filtered
        .filter((project) => !project.prFeatured)
        .sort((a, b) => a.prName.localeCompare(b.prName))

      const sortedFiltered = [...featured, ...nonFeatured]
      const firstProjects = sortedFiltered.slice(0, initialImageCount)

      setShouldLoadImages((prev) => {
        const newSet = new Set(prev)
        firstProjects.forEach((project) => newSet.add(project.prName))
        return newSet
      })
    },
    [initialImageCount, validatedProjects]
  )

  const handleImageError = useCallback((projectName: string) => {
    setImageErrors((prev) => new Set(prev).add(projectName))
  }, [])

  const getProjectIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      WordPress: Layers,
      "E-commerce": Globe,
      Portfolio: Star,
      Business: Code,
    }
    return icons[type] || Code
  }

  const ProjectCard = memo(
    ({
      project,
      index,
      isDark,
      globalIndex,
    }: {
      project: Project
      index: number
      isDark: boolean
      globalIndex: number
    }) => {
      const { targetRef: cardRef, isVisible: isCardVisible } =
        useIntersectionObserver<HTMLDivElement>({
          threshold: 0.1,
          rootMargin: "100px",
        })

      const shouldLoadImage =
        shouldLoadImageImmediately(project, globalIndex) || isCardVisible

      React.useEffect(() => {
        if (isCardVisible && !shouldLoadImages.has(project.prName)) {
          triggerImageLoad(project.prName)
        }
      }, [isCardVisible, project.prName])

      const IconComponent = getProjectIcon(project.prType)

      const imageSlug =
        project.prImageSlug || project.prName.toLowerCase().replace(/\s+/g, "-")
      const imageSrc = `./images/projects/${imageSlug}.webp`

      const hasGlobalImageError = imageErrors.has(project.prName)

      const { hasError } = useProjectImage({
        src: imageSrc,
        shouldLoad: shouldLoadImage && !hasGlobalImageError,
        onError: handleImageError,
        projectName: project.prName,
      })

      return (
        <div
          ref={cardRef}
          className={`relative group transition-all duration-500 transform hover:-translate-y-0.5 hover:scale-[1.01] ${
            isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {project.prFeatured && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-[var(--v2-acid)] px-3 py-2 text-sm font-bold text-[var(--v2-acid-ink)] shadow-lg">
              <Star className="w-4 h-4" />
              Featured
            </div>
          )}

          <div className="h-full overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] transition-all duration-500 hover:border-[var(--v2-acid)]/40">
            <div className="relative w-full h-64 overflow-hidden">
              {shouldLoadImage && !hasGlobalImageError && !hasError ? (
                <>
                  <BlurImage
                    src={imageSrc}
                    alt={`${project.prName} project preview`}
                    containerClassName="w-full h-full"
                    className="transition-all duration-[3000ms] ease-in-out group-hover:object-bottom"
                    objectPosition="top"
                    aspectRatio="auto"
                    placeholderColor={
                      isDark ? "rgb(71 85 105)" : "rgb(203 213 225)"
                    }
                  />
                  {project.prUrl && (
                    <ProjectCardOverlay
                      href={project.prUrl}
                      ariaLabel={`View ${project.prName} project`}
                    />
                  )}
                </>
              ) : !shouldLoadImage ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--v2-panel-2)]">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-soft)]">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-[var(--v2-soft)]">
                    Image loads on scroll
                  </p>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--v2-panel-2)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-soft)]">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]">
                  <IconComponent className="w-5 h-5" />
                </div>

                <span className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/70 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--v2-muted)]">
                  {project.prType}
                </span>
              </div>

              <h3 className="mb-2 line-clamp-2 text-lg font-bold tracking-tight text-[var(--v2-text)] transition-colors group-hover:text-[var(--v2-acid)]">
                {project.prName}
              </h3>

              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--v2-muted)]">
                {project.prDescription}
              </p>

              {/* Tech Stack Badges */}
              {Array.isArray(project.tech) && project.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tech.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-2 py-1 text-xs font-medium text-[var(--v2-muted)]"
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
              )}

              {(hasGlobalImageError || hasError) && (
                <div className="flex items-center justify-center mt-4">
                  <a
                    href={project.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--v2-acid)] px-4 py-2 text-sm font-bold text-[var(--v2-acid-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-acid)] motion-reduce:hover:translate-y-0"
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
    (prevProps, nextProps) => {
      return (
        prevProps.project.prName === nextProps.project.prName &&
        prevProps.isDark === nextProps.isDark
      )
    }
  )

  ProjectCard.displayName = "ProjectCard"

  return (
    <div>
          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--v2-soft)]" />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel-2)] py-4 pl-12 pr-12 text-base text-[var(--v2-text)] transition-all placeholder:text-[var(--v2-soft)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--v2-brand)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--v2-soft)] transition-colors hover:bg-[var(--v2-panel)]"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Technology Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--v2-soft)]" />
                <span className="text-sm font-medium text-[var(--v2-muted)]">
                  Filter by tech:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.slice(0, 12).map((tech) => (
                  <button
                    key={tech}
                    onClick={() =>
                      setSelectedTech(selectedTech === tech ? null : tech)
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] ${
                      selectedTech === tech
                        ? "bg-[var(--v2-acid)] text-[var(--v2-acid-ink)]"
                        : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                    }`}
                    aria-pressed={selectedTech === tech}
                  >
                    {tech}
                  </button>
                ))}
                {allTechnologies.length > 12 && (
                  <span className="px-3 py-1.5 text-xs text-[var(--v2-soft)]">
                    +{allTechnologies.length - 12} more
                  </span>
                )}
              </div>
              {(selectedTech || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTech(null)
                    setSearchQuery("")
                  }}
                  className="ml-auto rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel)] px-4 py-1.5 text-xs font-medium text-[var(--v2-muted)] transition-colors hover:border-[var(--v2-acid)]/40"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Project Type Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => handleProjectTypeChange(null)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] ${
                projectType === null
                  ? "bg-[var(--v2-acid)] text-[var(--v2-acid-ink)]"
                  : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
              }`}
              aria-pressed={projectType === null}
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
                  className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] ${
                    projectType === type
                      ? "bg-[var(--v2-acid)] text-[var(--v2-acid-ink)]"
                      : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                  }`}
                  aria-pressed={projectType === type}
                >
                  {React.createElement(getProjectIcon(type), {
                    className: "w-4 h-4",
                  })}
                  {type} ({count})
                </button>
              )
            })}
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mb-12">
            {displayProjects.map((project: Project, index: number) => {
              const globalIndex = filteredProjects.findIndex(
                (p) => p.prName === project.prName
              )
              return (
                <React.Fragment key={project.prName}>
                  <ProjectSchema project={project} />
                  <ProjectCard
                    project={project}
                    index={index}
                    isDark={isDark}
                    globalIndex={globalIndex}
                  />
                </React.Fragment>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-[var(--v2-muted)]">
              Showing {displayProjects.length} of {filteredProjects.length}{" "}
              projects
              {(projectType || selectedTech || searchQuery) && (
                <span>
                  {" • Filtered by: "}
                  {[
                    projectType && `Type: ${projectType}`,
                    selectedTech && `Tech: ${selectedTech}`,
                    searchQuery && `Search: "${searchQuery}"`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "cursor-not-allowed border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-soft)] opacity-50"
                    : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                }`}
              >
                Previous
              </button>

              {generatePaginationNumbers().map((pageItem, index) => {
                if (pageItem === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-10 w-10 items-center justify-center text-sm text-[var(--v2-soft)]"
                    >
                      ...
                    </span>
                  )
                }

                const pageNum = pageItem as number
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] ${
                      currentPage === pageNum
                        ? "bg-[var(--v2-acid)] text-[var(--v2-acid-ink)]"
                        : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                    }`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? "cursor-not-allowed border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-soft)] opacity-50"
                    : "border border-[var(--v2-line)] bg-[var(--v2-panel)] text-[var(--v2-muted)] hover:border-[var(--v2-acid)]/40"
                }`}
              >
                Next
              </button>
            </div>
          )}
    </div>
  )
})

WordPressProjectGrid.displayName = "WordPressProjectGrid"
export default WordPressProjectGrid
