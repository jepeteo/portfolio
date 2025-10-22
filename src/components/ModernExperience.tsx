import React, { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import usePerformanceMonitor from "../hooks/usePerformanceMonitor"
import { useExperienceData } from "../hooks/useExperienceData"
import type { TechExperience } from "../hooks/useExperienceData"
import { ExperienceStatsComponent } from "./experience/ExperienceStats"
import { ExperienceCallToAction } from "./experience/ExperienceCallToAction"
import { ExperienceSidebar } from "./experience/ExperienceSidebar"
import { ExperienceDetails } from "./experience/ExperienceDetails"
import {
  Briefcase,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Schema.org structured data for experience
const generateExperienceSchema = (experiences: TechExperience[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://theodorosmentis.com/#experience",
    name: "Professional Work Experience",
    description:
      "Career history and professional experience of Theodoros Mentis",
    numberOfItems: experiences.length,
    itemListElement: experiences.map((experience, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Role",
        "@id": `https://theodorosmentis.com/#experience-${experience.id}`,
        roleName: experience.title,
        startDate: formatDateForSchema(experience.periodInfo.from),
        endDate: experience.periodInfo.isCurrent
          ? undefined
          : formatDateForSchema(experience.periodInfo.to),
        description: experience.description,
        skills: experience.techStack,
        creator: {
          "@type": "Person",
          "@id": "https://theodorosmentis.com/#person",
          name: "Theodoros Mentis",
        },
        worksFor: {
          "@type": "Organization",
          name: experience.company,
          ...(experience.location && { address: experience.location }),
        },
        responsibilities: experience.keyResponsibilities || [],
        achievements: experience.achievements || [],
        ...(experience.metrics.projects && {
          about: {
            "@type": "QuantitativeValue",
            name: "Projects Completed",
            value: experience.metrics.projects,
          },
        }),
      },
    })),
  }
}

// Individual experience schema component
const ExperienceSchema: React.FC<{ experience: TechExperience }> = ({
  experience,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WorkHistory",
    "@id": `https://theodorosmentis.com/#work-${experience.id}`,
    position: experience.title,
    startDate: formatDateForSchema(experience.periodInfo.from),
    endDate: experience.periodInfo.isCurrent
      ? undefined
      : formatDateForSchema(experience.periodInfo.to),
    description: experience.description,
    skills: experience.techStack,
    workLocation: experience.location,
    employee: {
      "@type": "Person",
      "@id": "https://theodorosmentis.com/#person",
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
    },
    employer: {
      "@type": "Organization",
      name: experience.company,
      ...(experience.location && { address: experience.location }),
    },
    responsibilities: experience.keyResponsibilities || [],
    ...(experience.achievements &&
      experience.achievements.length > 0 && {
        award: experience.achievements.map((achievement, index) => ({
          "@type": "Achievement",
          "@id": `https://theodorosmentis.com/#achievement-${experience.id}-${index}`,
          name: achievement,
          achiever: {
            "@type": "Person",
            "@id": "https://theodorosmentis.com/#person",
            name: "Theodoros Mentis",
          },
        })),
      }),
    ...(experience.metrics.projects && {
      result: {
        "@type": "QuantitativeValue",
        name: "Projects Completed",
        value: experience.metrics.projects,
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

// Helper function to format dates for schema
const formatDateForSchema = (dateString: string): string => {
  // Convert "MM-YYYY" format to "YYYY-MM-DD"
  const [month, year] = dateString.split("-")
  return `${year}-${month.padStart(2, "0")}-01`
}

const ModernExperience: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  // Monitor component performance
  usePerformanceMonitor("ModernExperience")

  const {
    experiences,
    stats,
    currentExperiences,
    pastExperiences,
    freelanceExperiences,
    employmentExperiences,
  } = useExperienceData()

  const [filter, setFilter] = useState<
    "all" | "current" | "past" | "freelance" | "employment"
  >("all")
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null) // Start with null - nothing expanded by default

  const filteredExperiences =
    filter === "current"
      ? currentExperiences
      : filter === "past"
      ? pastExperiences
      : filter === "freelance"
      ? freelanceExperiences
      : filter === "employment"
      ? employmentExperiences
      : experiences

  useEffect(() => {
    if (
      filteredExperiences.length > 0 &&
      (!selectedExperienceId ||
        !filteredExperiences.some((exp) => exp.id === selectedExperienceId))
    ) {
      const isMobile = window.innerWidth < 768
      if (!isMobile) {
        setSelectedExperienceId(filteredExperiences[0].id)
      } else {
        setSelectedExperienceId(null)
      }
    }
  }, [filteredExperiences, selectedExperienceId])

  const selectedExperience =
    filteredExperiences.find((exp) => exp.id === selectedExperienceId) || null

  const renderCount = React.useRef(0)
  useEffect(() => {
    renderCount.current += 1
    // Render counting removed - performance monitoring handled by usePerformanceMonitor
  })

  return (
    <>
      {/* SEO Schema for Experience */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateExperienceSchema(experiences),
            null,
            2
          ),
        }}
      />

      <section
        ref={targetRef}
        id="experience"
        className={`py-20 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6">
              <Briefcase className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">
                Professional Experience
              </span>
            </div>

            <h2
              className={`text-5xl md:text-7xl font-bold mb-8 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Career Journey
              </span>
            </h2>

            <p
              className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              A comprehensive overview of my {stats.totalYears} years in web
              development ({stats.employmentYears} years employment and{" "}
              {stats.freelanceYears} years freelance), spanning{" "}
              {stats.totalProjects}+ projects and {stats.totalClients}+
              satisfied clients.
            </p>
          </div>

          <ExperienceStatsComponent stats={stats} isDark={isDark} />

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Filter
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span
                className={`font-medium text-sm ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Filter by:
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                {
                  key: "all",
                  label: "All Experience",
                  count: experiences.length,
                },
                {
                  key: "current",
                  label: "Current Roles",
                  count: currentExperiences.length,
                },
                {
                  key: "past",
                  label: "Past Roles",
                  count: pastExperiences.length,
                },
                {
                  key: "freelance",
                  label: "Freelancing",
                  count: freelanceExperiences.length,
                },
                {
                  key: "employment",
                  label: "Employment",
                  count: employmentExperiences.length,
                },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    filter === key
                      ? isDark
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white"
                      : isDark
                      ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      : "bg-white/70 text-slate-700 hover:bg-white border border-slate-200"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden mb-16">
            <div className="text-center mb-6">
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                My Experience Timeline
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Tap any position to explore details
              </p>
            </div>

            <div className="space-y-4">
              {filteredExperiences.map((experience) => (
                <div
                  key={experience.id}
                  className={`experience-card rounded-xl border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-800/30 border-slate-700/50"
                      : "bg-white/30 border-slate-200/50"
                  } backdrop-blur-sm`}
                >
                  {/* Individual Experience Schema */}
                  <ExperienceSchema experience={experience} />

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3
                            className={`font-bold text-base leading-tight ${
                              isDark ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {experience.company}
                          </h3>

                          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                            {experience.isFreelance && (
                              <div
                                className="h-2 w-2 rounded-full bg-purple-500"
                                title="Freelance"
                              />
                            )}
                            {experience.status === "current" && (
                              <div
                                className="h-2 w-2 rounded-full bg-green-500 animate-pulse"
                                title="Current"
                              />
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {experience.title}
                        </p>
                        <div
                          className={`text-xs mt-1 flex items-center ${
                            isDark ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {experience.periodInfo.from} -{" "}
                          {experience.periodInfo.to}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedExperienceId(
                          selectedExperienceId === experience.id
                            ? null
                            : experience.id
                        )
                      }
                      className={`experience-toggle-btn mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group relative overflow-hidden ${
                        selectedExperienceId === experience.id
                          ? isDark
                            ? "bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 border border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10"
                            : "bg-gradient-to-r from-emerald-500/15 to-green-500/15 hover:from-emerald-500/25 hover:to-green-500/25 border border-emerald-500/30 text-emerald-700 shadow-lg shadow-emerald-500/10"
                          : isDark
                          ? "bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-slate-600/80 hover:to-slate-700/80 border border-slate-600/40 text-slate-300 hover:text-white shadow-md hover:shadow-lg"
                          : "bg-gradient-to-r from-white/90 to-slate-50/90 hover:from-white hover:to-slate-100 border border-slate-200/60 text-slate-700 hover:text-slate-900 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <span className="relative z-10">
                        {selectedExperienceId === experience.id
                          ? "Hide Details"
                          : "View Details"}
                      </span>
                      {selectedExperienceId === experience.id ? (
                        <ChevronUp className="w-4 h-4 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:scale-110 relative z-10" />
                      ) : (
                        <ChevronDown className="w-4 h-4 transition-all duration-300 group-hover:translate-y-[2px] group-hover:scale-110 relative z-10" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                    </button>
                  </div>

                  <div
                    className={`experience-details-container overflow-hidden transition-all duration-500 ease-in-out ${
                      selectedExperienceId === experience.id
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      className={`px-4 pb-4 pt-3 border-t transition-all duration-300 ${
                        isDark ? "border-slate-700/50" : "border-slate-200/50"
                      } ${
                        selectedExperienceId === experience.id
                          ? "translate-y-0"
                          : "translate-y-[-10px]"
                      }`}
                    >
                      <div className="experience-details-mobile">
                        <ExperienceDetails
                          experience={experience}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-16">
            <div className="md:col-span-1 md:border-r md:pr-4">
              <ExperienceSidebar
                experiences={filteredExperiences}
                selectedExperienceId={selectedExperienceId}
                onSelectExperience={setSelectedExperienceId}
                isDark={isDark}
              />
            </div>

            <div className="md:col-span-2">
              <ExperienceDetails
                experience={selectedExperience}
                isDark={isDark}
              />
            </div>
          </div>

          <ExperienceCallToAction isDark={isDark} />
        </div>
      </section>
    </>
  )
}

export default ModernExperience
