import React, { useMemo, useState, memo, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import { ModernCertificate } from "../types"
import { validateCertificate } from "../utils/validation"
import Loading from "./Loading"
import myCertificates from "../assets/myCertificates.json"
import {
  Award,
  Calendar,
  ExternalLink,
  Filter,
  GraduationCap,
  Users,
  Code,
  Shield,
  Zap,
  Database,
  Globe,
  Server,
  Smartphone,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
} from "lucide-react"

// Category icons mapping
const categoryIcons: Record<string, React.ComponentType<any>> = {
  "AI & Machine Learning": Zap,
  "Frontend Development": Code,
  "Backend Development": Server,
  "Programming Fundamentals": GraduationCap,
  "Digital Marketing": TrendingUp,
  "Security & Compliance": Shield,
  "CMS Development": Globe,
  "DevOps & Infrastructure": Settings,
  "Database Management": Database,
  "Performance & Optimization": Zap,
  "E-commerce": Smartphone,
  "Productivity Tools": Settings,
}

// Add interface for expanded skills
interface ExpandedSkills {
  [certificateId: string]: boolean
}

const ModernCertificates: React.FC = memo(() => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [isLoading, setIsLoading] = useState(false)
  // Add state for expanded categories in summary section
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)
  // Add state for expanded skills per certificate
  const [expandedSkills, setExpandedSkills] = useState<ExpandedSkills>({})

  const { categories, certsByCategory, validCertificates } = useMemo(() => {
    const validCerts = myCertificates
      .filter((cert: any) => validateCertificate(cert))
      .map((cert: ModernCertificate) => cert)

    const grouped = validCerts.reduce(
      (
        acc: { [key: string]: ModernCertificate[] },
        cert: ModernCertificate
      ) => {
        const category = cert.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(cert)
        return acc
      },
      {}
    )

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort()

    return {
      categories: sortedCategories,
      certsByCategory: grouped,
      validCertificates: validCerts,
    }
  }, [])

  // Set the first alphabetical category as default (instead of "All")
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return categories.length > 0 ? categories[0] : "All"
  })

  // Update selectedCategory when categories change
  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  const handleCategoryChange = useCallback((category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 150)
  }, [])

  // Toggle function for summary expansion
  const toggleSummaryExpansion = useCallback(() => {
    setIsSummaryExpanded((prev) => !prev)
  }, [])

  // Toggle function for skills expansion per certificate
  const toggleSkillsExpansion = useCallback((certificateId: string) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [certificateId]: !prev[certificateId],
    }))
  }, [])

  const displayedCertificates = useMemo(() => {
    if (selectedCategory === "All") {
      return validCertificates
    }
    return certsByCategory[selectedCategory] || []
  }, [selectedCategory, validCertificates, certsByCategory])

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || Award
    return IconComponent
  }

  // Constants for summary display
  const INITIAL_CATEGORIES_DISPLAY = 5
  const hasMoreCategories = categories.length > INITIAL_CATEGORIES_DISPLAY
  const visibleCategories = isSummaryExpanded
    ? categories
    : categories.slice(0, INITIAL_CATEGORIES_DISPLAY)
  const hiddenCategoriesCount = categories.length - INITIAL_CATEGORIES_DISPLAY

  // Constants for skills display
  const INITIAL_SKILLS_DISPLAY = 3

  if (validCertificates.length === 0) {
    return (
      <section className="container py-20" id="certificates">
        <div className="text-center">
          <h2
            className={`text-4xl md:text-6xl font-display font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Certifications
          </h2>
          <p
            className={`text-xl ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            No certificates data available
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={targetRef}
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      id="certificates"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-purple-100 text-purple-700 border border-purple-200"
            }`}
          >
            <Award className="w-4 h-4" />
            Professional Development
          </div>

          <h2
            className={`text-6xl md:text-8xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Skills I've Unlocked
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Professional certifications showcasing expertise across various
            technologies and methodologies
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div
            className={`flex items-center gap-2 mb-6 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by Category:</span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {/* All Categories Button */}
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                selectedCategory === "All"
                  ? isDark
                    ? "bg-purple-500/30 text-purple-300 border-2 border-purple-500"
                    : "bg-purple-100 text-purple-700 border-2 border-purple-500"
                  : isDark
                  ? "bg-slate-800/50 text-slate-300 border border-slate-600 hover:border-purple-400"
                  : "bg-white/50 text-slate-700 border border-slate-300 hover:border-purple-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                All ({validCertificates.length})
              </span>
            </button>

            {/* Individual Category Buttons */}
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category)
              const count = certsByCategory[category]?.length || 0

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? isDark
                        ? "bg-purple-500/30 text-purple-300 border-2 border-purple-500"
                        : "bg-purple-100 text-purple-700 border-2 border-purple-500"
                      : isDark
                      ? "bg-slate-800/50 text-slate-300 border border-slate-600 hover:border-purple-400"
                      : "bg-white/50 text-slate-700 border border-slate-300 hover:border-purple-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {category} ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        ) : (
          <>
            {/* Current Category Info */}
            <div
              className={`text-center mb-8 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <p>
                Showing{" "}
                <span className="font-bold text-purple-500">
                  {displayedCertificates.length}
                </span>{" "}
                certificate{displayedCertificates.length !== 1 ? "s" : ""}{" "}
                {selectedCategory !== "All" && (
                  <>
                    in{" "}
                    <span className="font-medium text-purple-500">
                      {selectedCategory}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCertificates.map((certificate, index) => {
                const IconComponent = getCategoryIcon(
                  certificate.category || "Uncategorized"
                )

                // Skills expansion logic
                const isSkillsExpanded = expandedSkills[certificate.id] || false
                const hasMoreSkills =
                  certificate.skills &&
                  certificate.skills.length > INITIAL_SKILLS_DISPLAY
                const visibleSkills = isSkillsExpanded
                  ? certificate.skills
                  : certificate.skills?.slice(0, INITIAL_SKILLS_DISPLAY)
                const hiddenSkillsCount = certificate.skills
                  ? certificate.skills.length - INITIAL_SKILLS_DISPLAY
                  : 0

                return (
                  <div
                    key={certificate.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:rotate-1 ${
                      isDark
                        ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50"
                        : "bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-purple-500/50"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Certificate Content */}
                    <div className="relative p-6">
                      {/* Header with Icon and Category */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isDark
                              ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300"
                              : "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600"
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        {certificate.category && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isDark
                                ? "bg-slate-700/60 text-slate-300"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {certificate.category}
                          </span>
                        )}
                      </div>

                      {/* Certificate Name */}
                      <h3
                        className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {certificate.name}
                      </h3>

                      {/* Issuer */}
                      <p
                        className={`text-sm font-medium mb-3 ${
                          isDark ? "text-purple-300" : "text-purple-600"
                        }`}
                      >
                        {certificate.issuer}
                      </p>

                      {/* Description */}
                      {certificate.description && (
                        <p
                          className={`text-sm mb-4 line-clamp-3 ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {certificate.description}
                        </p>
                      )}

                      {/* Skills with Expandable Functionality */}
                      {certificate.skills && certificate.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {visibleSkills?.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                                  isDark
                                    ? "bg-slate-700/60 text-slate-300"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Expandable Skills Button */}
                          {hasMoreSkills && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleSkillsExpansion(certificate.id)
                              }}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                isDark
                                  ? "bg-slate-700/40 text-slate-400 hover:bg-slate-700/60"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {isSkillsExpanded ? (
                                <>
                                  <Minus className="w-3 h-3" />
                                  Show Less
                                  <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <div className="w-8 flex items-center justify-center gap-1">
                                  <Plus className="w-3 h-3" />
                                  {hiddenSkillsCount}
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        {/* Issue Date */}
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(certificate.issueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {/* Credential Link */}
                        {certificate.credentialUrl && (
                          <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                              isDark
                                ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Category Summary with Expandable Categories */}
            <div className="mt-16">
              <div
                className={`p-8 rounded-2xl text-center ${
                  isDark
                    ? "bg-slate-800/30 backdrop-blur-sm border border-slate-700"
                    : "bg-white/30 backdrop-blur-sm border border-slate-200"
                }`}
              >
                <GraduationCap
                  className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? "text-purple-400" : "text-purple-500"
                  }`}
                />
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Continuous Learning Journey
                </h3>
                <p
                  className={`text-lg mb-6 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {validCertificates.length} certifications across{" "}
                  {categories.length} technology domains, representing ongoing
                  commitment to professional excellence
                </p>

                {/* Expandable Categories List */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {visibleCategories.map((category) => {
                    const IconComponent = getCategoryIcon(category)
                    return (
                      <div
                        key={category}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          isDark
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {category}
                      </div>
                    )
                  })}
                </div>

                {/* Expandable Button */}
                {hasMoreCategories && (
                  <button
                    onClick={toggleSummaryExpansion}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium ${
                      isDark
                        ? "bg-purple-500/20 text-slate-300"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {isSummaryExpanded ? (
                      <>
                        <Minus className="w-4 h-4" />
                        Show Less Categories
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        {hiddenCategoriesCount} more categories
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
})

ModernCertificates.displayName = "ModernCertificates"
export default ModernCertificates
