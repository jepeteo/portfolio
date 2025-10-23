import React, { useState, useMemo, memo, useCallback, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import { useProjectImage } from "../hooks/useProjectImage"
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
  Search,
  X,
  Filter,
} from "lucide-react"

// SEO Schema generation for Projects
const generateProjectsSchema = (projects: Project[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Professional Projects Portfolio",
    description:
      "A collection of web development projects including dynamic sites, e-commerce platforms, and custom applications",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        "@id": `#${project.id}`,
        name: project.prName,
        description: project.prDescription,
        url: project.prUrl,
        creator: {
          "@type": "Person",
          name: "Theodoros Mentis",
        },
        about: project.prType,
        keywords: Array.isArray(project.prTags)
          ? project.prTags.join(", ")
          : project.prTags,
        ...(project.prFeatured && {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "featured",
            value: "true",
          },
        }),
      },
    })),
  }
}

// Individual Project Schema Component
const ProjectSchema: React.FC<{ project: Project }> = ({ project }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `#${project.id}`,
    name: project.prName,
    description: project.prDescription,
    url: project.prUrl,
    creator: {
      "@type": "Person",
      name: "Theodoros Mentis",
      jobTitle: "Frontend Developer",
    },
    about: project.prType,
    keywords: Array.isArray(project.prTags)
      ? project.prTags.join(", ")
      : project.prTags,
    workExample: {
      "@type": "WebSite",
      name: project.prName,
      url: project.prUrl,
      category: project.prType,
    },
    ...(project.prFeatured && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "featured",
        value: "true",
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  )
}

const ModernProjects = memo(() => {
  const { isDark } = useTheme()
  const [projectType, setProjectType] = useState<string | null>(null)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [shouldLoadImages, setShouldLoadImages] = useState<Set<string>>(
    new Set()
  )
  const { targetRef: ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const projectsPerPage = 6

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
      const techArray = Array.isArray(project.tech) ? project.tech : 
                       (Array.isArray(project.prTags) ? project.prTags : [])
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
        const techArray = Array.isArray(project.tech) ? project.tech : 
                         (Array.isArray(project.prTags) ? project.prTags : [])
        return techArray.includes(selectedTech)
      })
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (project) => {
          const techArray = Array.isArray(project.tech) ? project.tech : 
                           (Array.isArray(project.prTags) ? project.prTags : [])
          return (
            project.prName.toLowerCase().includes(query) ||
            project.prDescription.toLowerCase().includes(query) ||
            techArray.some((tech: string) => tech.toLowerCase().includes(query)) ||
            project.prType.toLowerCase().includes(query)
          )
        }
      )
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
        project.prFeatured || index < 6 || shouldLoadImages.has(project.prName)
      )
    },
    [shouldLoadImages]
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
    const first6Projects = filteredProjects.slice(0, 6)
    setShouldLoadImages((prev) => {
      const newSet = new Set(prev)
      first6Projects.forEach((project) => newSet.add(project.prName))
      return newSet
    })
  }, [])

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
      const first6Projects = sortedFiltered.slice(0, 6)

      setShouldLoadImages((prev) => {
        const newSet = new Set(prev)
        first6Projects.forEach((project) => newSet.add(project.prName))
        return newSet
      })
    },
    [validatedProjects]
  )

  const handleImageError = useCallback((projectName: string) => {
    setImageErrors((prev) => new Set(prev).add(projectName))
  }, [])

  const getProjectIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
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
        (project as any).prImageSlug ||
        project.prName.toLowerCase().replace(/\s+/g, "-")
      const imageSrc = `./images/projects/${imageSlug}.webp`

      const hasGlobalImageError = imageErrors.has(project.prName)

      const { imageRef, isLoading, hasError } = useProjectImage({
        src: imageSrc,
        shouldLoad: shouldLoadImage && !hasGlobalImageError,
        onError: handleImageError,
        projectName: project.prName,
      })

      return (
        <div
          ref={cardRef}
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
            <div className="relative w-full h-64 overflow-hidden">
              {shouldLoadImage && !hasGlobalImageError && !hasError ? (
                <>
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt={`${project.prName} project preview`}
                    className={`w-full h-full object-cover object-top transition-all duration-[3000ms] ease-in-out group-hover:object-bottom ${
                      isLoading ? "opacity-50" : "opacity-100"
                    }`}
                    loading="lazy"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isDark
                        ? "bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"
                        : "bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"
                    }`}
                  />
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
              ) : !shouldLoadImage ? (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-slate-700 to-slate-800"
                      : "bg-gradient-to-br from-slate-100 to-slate-200"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                      isDark
                        ? "bg-slate-600/50 text-slate-400"
                        : "bg-slate-300/50 text-slate-500"
                    }`}
                  >
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Image loads on scroll
                  </p>
                </div>
              ) : (
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

            <div className="p-5">
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

              <h3
                className={`text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {project.prName}
              </h3>

              <p
                className={`text-sm mb-3 leading-relaxed line-clamp-2 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {project.prDescription}
              </p>

              {/* Tech Stack Badges */}
              {Array.isArray(project.tech) && project.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tech.slice(0, 5).map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        isDark
                          ? "bg-slate-700/50 text-slate-300 border border-slate-600"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 5 && (
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      +{project.tech.length - 5}
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
    (prevProps, nextProps) => {
      return (
        prevProps.project.prName === nextProps.project.prName &&
        prevProps.isDark === nextProps.isDark
      )
    }
  )

  ProjectCard.displayName = "ProjectCard"

  return (
    <>
      {/* SEO Schema for Projects */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateProjectsSchema(validatedProjects),
            null,
            2
          ),
        }}
      />

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
              sites to modern React applications. Each project represents a
              unique challenge and innovative result.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-12 py-4 rounded-2xl text-base transition-all ${
                  isDark
                    ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:bg-slate-800 focus:border-blue-500"
                    : "bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-100 text-slate-500"
                  }`}
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Technology Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter
                  className={`w-4 h-4 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Filter by Tech:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.slice(0, 12).map((tech) => (
                  <button
                    key={tech}
                    onClick={() =>
                      setSelectedTech(selectedTech === tech ? null : tech)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTech === tech
                        ? isDark
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                          : "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : isDark
                        ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
                {allTechnologies.length > 12 && (
                  <span
                    className={`px-3 py-1.5 text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
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
                  className={`ml-auto px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isDark
                      ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Project Type Filter */}
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
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
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
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentPage === 1
                    ? isDark
                      ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                      : "bg-slate-100/50 text-slate-400 cursor-not-allowed"
                    : isDark
                    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    : "bg-white/50 text-slate-600 hover:bg-white border border-slate-200"
                }`}
              >
                Previous
              </button>

              {generatePaginationNumbers().map((pageItem, index) => {
                if (pageItem === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
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
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                      currentPage === pageNum
                        ? isDark
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : isDark
                        ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                        : "bg-white/50 text-slate-600 hover:bg-white border border-slate-200"
                    }`}
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
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentPage === totalPages
                    ? isDark
                      ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                      : "bg-slate-100/50 text-slate-400 cursor-not-allowed"
                    : isDark
                    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    : "bg-white/50 text-slate-600 hover:bg-white border border-slate-200"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
})

ModernProjects.displayName = "ModernProjects"
export default ModernProjects
