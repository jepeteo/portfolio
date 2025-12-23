
import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card"
import { Button } from "../ui/Button"
import { Icon, icons } from "../icons/ModernIcons"
import {
  StaggerContainer,
  StaggerItem,
  FloatingCard,
} from "../animations/AdvancedAnimations"
import {
  ProjectCardSkeleton,
  LoadingState,
} from "../loading/ModernLoadingStates"
import { NoProjectsFound } from "../ui/EmptyState"
import { cn, typography, spacing, shadows } from "../../utils/styles"
import { useViewTransition } from "../../hooks/useViewTransition"

interface Project {
  id: string
  name: string
  description: string
  imageUrl: string
  projectUrl: string
  githubUrl?: string
  technologies: string[]
  category: string
  featured: boolean
  year: number
}

interface ModernProjectGridProps {
  projects: Project[]
  loading?: boolean
  error?: string
}

const ModernProjectGrid: React.FC<ModernProjectGridProps> = ({
  projects,
  loading = false,
  error,
}) => {
  const { isDark } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { startTransition } = useViewTransition()

  const categories = useMemo(() => {
    const cats = ["all", ...new Set(projects.map((p) => p.category))]
    return cats
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [projects, selectedCategory])

  const { featured, regular } = useMemo(() => {
    const featured = filteredProjects.filter((p) => p.featured)
    const regular = filteredProjects.filter((p) => !p.featured)
    return { featured, regular }
  }, [filteredProjects])

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      setSelectedCategory(category)
    })
  }

  const ProjectCard: React.FC<{ project: Project; featured?: boolean }> = ({
    project,
    featured = false,
  }) => {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
      <FloatingCard
        className={cn(
          "group h-full transition-all duration-300",
          featured && "md:col-span-2 lg:col-span-1"
        )}
      >
        <Card
          variant="elevated"
          size={featured ? "lg" : "md"}
          className={cn(
            "h-full overflow-hidden cursor-pointer",
            shadows.card,
            "hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          )}
          style={{ viewTransitionName: `project-${project.id}` }}
        >
          
          <div
            className={cn(
              "relative overflow-hidden",
              featured ? "h-64" : "h-48"
            )}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <motion.img
              src={project.imageUrl}
              alt={`${project.name} preview`}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                "group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            <motion.div
              className={cn(
                "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100",
                "transition-opacity duration-300 flex items-center justify-center gap-4"
              )}
              initial={false}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(project.projectUrl, "_blank")}
                  leftIcon={<Icon icon={icons.theme.externalLink} size="sm" />}
                >
                  View Live
                </Button>
              </motion.div>

              {project.githubUrl && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(project.githubUrl, "_blank")}
                    leftIcon={<Icon icon={icons.social.github} size="sm" />}
                  >
                    Code
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {featured && (
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                ⭐ Featured
              </motion.div>
            )}
          </div>

          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {project.description}
                </CardDescription>
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full shrink-0 ml-4",
                  isDark
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {project.year}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            
            <div className="flex flex-wrap gap-2">
              {project.technologies
                .slice(0, featured ? 6 : 4)
                .map((tech, index) => (
                  <motion.span
                    key={tech}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md border",
                      isDark
                        ? "bg-gray-800 border-gray-700 text-gray-300"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              {project.technologies.length > (featured ? 6 : 4) && (
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-md",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  +{project.technologies.length - (featured ? 6 : 4)} more
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <span
                className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full",
                  isDark
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                )}
              >
                {project.category}
              </span>

              <motion.div
                className="flex items-center gap-1 text-sm text-muted-foreground"
                whileHover={{ x: 4 }}
              >
                View Project
                <Icon icon={icons.navigation.arrowRight} size="sm" />
              </motion.div>
            </div>
          </CardFooter>
        </Card>
      </FloatingCard>
    )
  }

  return (
    <section className={cn(spacing.section, spacing.container)} id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        
        <div className="text-center space-y-4">
          <motion.h2
            className={cn(typography.heading.h2, "mb-4")}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className={cn(
              typography.body.large,
              "max-w-3xl mx-auto",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A showcase of my latest work, featuring modern web applications
            built with cutting-edge technologies and best practices.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              leftIcon={<Icon icon={icons.layout.grid} size="sm" />}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              leftIcon={<Icon icon={icons.layout.list} size="sm" />}
            >
              List
            </Button>
          </div>
        </motion.div>

        <LoadingState
          loading={loading}
          error={error}
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              
              {featured.length > 0 && (
                <div className="mb-12">
                  <h3
                    className={cn(
                      typography.heading.h3,
                      "mb-6 text-center lg:text-left"
                    )}
                  >
                    Featured Work
                  </h3>
                  <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featured.map((project) => (
                      <StaggerItem key={project.id}>
                        <ProjectCard project={project} featured />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}

              {regular.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <h3
                      className={cn(
                        typography.heading.h3,
                        "mb-6 text-center lg:text-left"
                      )}
                    >
                      More Projects
                    </h3>
                  )}
                  <StaggerContainer
                    className={cn(
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-6"
                    )}
                  >
                    {regular.map((project) => (
                      <StaggerItem key={project.id}>
                        <ProjectCard project={project} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}

              {filteredProjects.length === 0 && !loading && (
                <NoProjectsFound
                  onResetFilter={
                    activeFilter !== "all"
                      ? () => setActiveFilter("all")
                      : undefined
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </LoadingState>
      </motion.div>
    </section>
  )
}

export default ModernProjectGrid
