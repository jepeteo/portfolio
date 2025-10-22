import React from "react"
import { motion } from "framer-motion"
import { ExternalLink, Globe, Code, Star, Github, Calendar } from "lucide-react"
import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import clientProjectsData from "../assets/clientProjects.json"
import personalProjectsData from "../assets/personalProjects.json"

// Define project type
interface Project {
  id: string
  title: string
  url: string
  githubUrl?: string
  description: string
  tech: string[]
  category: string
  type: "client" | "personal"
  featured: boolean
  status: "Live" | "In Development"
  year: string
}

// Combine all projects with proper typing
const allProjects: Project[] = [
  ...clientProjectsData,
  ...personalProjectsData,
] as Project[]

// Schema.org structured data for projects
const generateProjectsSchema = (projects: Project[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://theodorosmentis.com/#web-projects",
    name: "Web Projects & Live Websites",
    description:
      "Professional client work and personal development projects by Theodoros Mentis",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type":
          project.type === "client" ? "WebApplication" : "SoftwareApplication",
        "@id": `https://theodorosmentis.com/#project-${project.id}`,
        name: project.title,
        description: project.description,
        url: project.url,
        ...(project.githubUrl && { codeRepository: project.githubUrl }),
        applicationCategory: mapCategoryToSchemaCategory(project.category),
        programmingLanguage: project.tech,
        dateCreated: `${project.year}-01-01`,
        dateModified: `${project.year}-12-31`,
        operatingSystem: "Web Browser",
        applicationSubCategory:
          project.type === "client"
            ? "Professional Website"
            : "Personal Project",
        keywords: [...project.tech, project.category, project.type].join(", "),
        creator: {
          "@type": "Person",
          "@id": "https://theodorosmentis.com/#person",
          name: "Theodoros Mentis",
          jobTitle: "Senior Full Stack Developer",
        },
        provider:
          project.type === "client"
            ? {
                "@type": "Organization",
                name: "Theodoros Mentis - Freelance Web Development",
              }
            : undefined,
        isPartOf: {
          "@type": "CreativeWork",
          "@id": "https://theodorosmentis.com/#portfolio",
          name: "Theodoros Mentis Portfolio",
        },
        offers:
          project.type === "client"
            ? {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
                businessFunction: "https://schema.org/Sell",
              }
            : undefined,
      },
    })),
  }
}

// Map project categories to schema.org categories
const mapCategoryToSchemaCategory = (category: string): string => {
  const mapping: Record<string, string> = {
    Business: "BusinessApplication",
    Gaming: "GameApplication",
    Portfolio: "WebApplication",
    "Web App": "WebApplication",
    Tool: "UtilitiesApplication",
    Productivity: "LifestyleApplication",
  }
  return mapping[category] || "WebApplication"
}

// Individual project schema component
const ProjectSchema: React.FC<{ project: Project }> = ({ project }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type":
      project.type === "client" ? "WebApplication" : "SoftwareApplication",
    "@id": `https://theodorosmentis.com/#project-${project.id}`,
    name: project.title,
    description: project.description,
    url: project.url,
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    applicationCategory: mapCategoryToSchemaCategory(project.category),
    programmingLanguage: project.tech,
    dateCreated: `${project.year}-01-01`,
    dateModified: `${project.year}-12-31`,
    operatingSystem: "Web Browser",
    applicationSubCategory:
      project.type === "client" ? "Professional Website" : "Personal Project",
    keywords: [...project.tech, project.category, project.type].join(", "),
    creator: {
      "@type": "Person",
      "@id": "https://theodorosmentis.com/#person",
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
    },
    provider:
      project.type === "client"
        ? {
            "@type": "Organization",
            name: "Theodoros Mentis - Freelance Web Development",
          }
        : undefined,
    isPartOf: {
      "@type": "CreativeWork",
      "@id": "https://theodorosmentis.com/#portfolio",
      name: "Theodoros Mentis Portfolio",
    },
    offers:
      project.type === "client"
        ? {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            businessFunction: "https://schema.org/Sell",
          }
        : undefined,
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

const filterOptions = [
  { key: "all", label: "All Projects" },
  { key: "client", label: "Client Work" },
  { key: "personal", label: "Personal Projects" },
]

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

export default function UnifiedProjects() {
  const { isDark } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredProjects = allProjects.filter(
    (project: Project) =>
      activeFilter === "all" || project.type === activeFilter
  )

  return (
    <>
      {/* SEO Schema for Web Projects */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProjectsSchema(allProjects), null, 2),
        }}
      />

      <section
        id="web-projects"
        className={`py-24 transition-colors duration-300 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 mb-6">
              <Globe className="w-5 h-5 text-cyan-500" />
              <span className="text-cyan-500 font-semibold">
                Live Websites & Applications
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-slate-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-600">
                Web Projects
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-slate-700 dark:text-slate-300 mb-8">
              A showcase of professional client work and personal development
              projects, demonstrating expertise across different technologies
              and domains
            </p>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setActiveFilter(option.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeFilter === option.key
                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative ${
                  project.featured
                    ? "ring-2 ring-blue-500/20 dark:ring-blue-400/20"
                    : ""
                } ${typeColors[project.type as keyof typeof typeColors]}`}
              >
                {/* Individual Project Schema */}
                <ProjectSchema project={project} />
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <Star className="w-4 h-4" fill="currentColor" />
                  </div>
                )}

                {/* Project Type Indicator */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      project.type === "client"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
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
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.year}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
                          statusColors[
                            project.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium text-sm transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    {project.status === "Live" && (
                      <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">Online</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Work Together?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Whether you need a professional website, custom application, or
                want to collaborate on an open-source project, I'm always
                excited to take on new challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <span>Start a Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/jepeteo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:border-blue-600 dark:hover:border-blue-400"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
