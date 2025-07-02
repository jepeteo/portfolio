import React, { useState, useCallback, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import usePerformanceMonitor from "../hooks/usePerformanceMonitor"
import { useExperienceData } from "../hooks/useExperienceData"
import { ExperienceStatsComponent } from "./experience/ExperienceStats"
import { ExperienceCard } from "./experience/ExperienceCard"
import { TopTechnologies } from "./experience/TopTechnologies"
import { ExperienceCallToAction } from "./experience/ExperienceCallToAction"
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
  const { experiences, stats, currentExperiences, pastExperiences } =
    useExperienceData()

  // State for UI controls
  const [filter, setFilter] = useState<"all" | "current" | "past">("all")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Filter experiences based on current filter
  const filteredExperiences =
    filter === "current"
      ? currentExperiences
      : filter === "past"
      ? pastExperiences
      : experiences

  const handleToggleExpanded = useCallback((experienceId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(experienceId)) {
        newSet.delete(experienceId)
      } else {
        newSet.add(experienceId)
      }
      return newSet
    })
  }, [])

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
            development, spanning {stats.totalProjects}+ projects and{" "}
            {stats.totalClients}+ satisfied clients.
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

          <div className="flex gap-2">
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

        {/* Experience Cards */}
        <div className="grid gap-8 mb-16">
          {filteredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              isDark={isDark}
              isExpanded={expandedCards.has(experience.id)}
              onToggleExpanded={() => handleToggleExpanded(experience.id)}
            />
          ))}
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
