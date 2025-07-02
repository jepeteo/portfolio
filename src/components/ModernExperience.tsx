import React, { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import usePerformanceMonitor from "../hooks/usePerformanceMonitor"
import { useExperienceData, TechExperience } from "../hooks/useExperienceData"
import { ExperienceStatsComponent } from "./experience/ExperienceStats"
import { TopTechnologies } from "./experience/TopTechnologies"
import { ExperienceCallToAction } from "./experience/ExperienceCallToAction"
import { ExperienceSidebar } from "./experience/ExperienceSidebar"
import { ExperienceDetails } from "./experience/ExperienceDetails"
import { Briefcase, Filter } from "lucide-react"

const ModernExperience: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor("ModernExperience")

  // Experience data
  const {
    experiences,
    stats,
    currentExperiences,
    pastExperiences,
    freelanceExperiences,
    employmentExperiences,
  } = useExperienceData()

  // State for UI controls
  const [filter, setFilter] = useState<
    "all" | "current" | "past" | "freelance" | "employment"
  >("all")
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null)

  // Filter experiences based on current filter
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

  // Set the selected experience as the first one when filter changes
  useEffect(() => {
    if (
      filteredExperiences.length > 0 &&
      (!selectedExperienceId ||
        !filteredExperiences.some((exp) => exp.id === selectedExperienceId))
    ) {
      setSelectedExperienceId(filteredExperiences[0].id)
    }
  }, [filteredExperiences, selectedExperienceId])

  // Find the selected experience object
  const selectedExperience =
    filteredExperiences.find((exp) => exp.id === selectedExperienceId) || null

  // Performance logging in development
  useEffect(() => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      console.log("ModernExperience Performance:", performanceMetrics)
    }
  }, [performanceMetrics])

  return (
    <section
      ref={targetRef}
      id="experience"
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6">
            <Briefcase className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-semibold">
              Professional Experience
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Career{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              Journey
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            A comprehensive overview of my {stats.totalYears}+ years in web
            development ({stats.employmentYears}+ years employment and{" "}
            {stats.freelanceYears}+ years freelance), spanning{" "}
            {stats.totalProjects}+ projects and {stats.totalClients}+ satisfied
            clients.
          </p>
        </div>

        {/* Experience Statistics */}
        <ExperienceStatsComponent stats={stats} isDark={isDark} />

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Filter
              className={`w-5 h-5 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            />
            <span
              className={`font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Filter by:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
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
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
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

        {/* Experience with Sidebar Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Sidebar */}
          <div className="md:col-span-1 md:border-r md:pr-4">
            <ExperienceSidebar
              experiences={filteredExperiences}
              selectedExperienceId={selectedExperienceId}
              onSelectExperience={setSelectedExperienceId}
              isDark={isDark}
            />
          </div>

          {/* Details Panel */}
          <div className="md:col-span-2">
            <ExperienceDetails
              experience={selectedExperience}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Top Technologies */}
        <div className="mb-16">
          <TopTechnologies stats={stats} isDark={isDark} />
        </div>

        {/* Call to Action */}
        <ExperienceCallToAction isDark={isDark} />
      </div>
    </section>
  )
}

export default ModernExperience
