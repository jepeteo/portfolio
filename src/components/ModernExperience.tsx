import React, { useState, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import jobExperienceData from "../assets/jobExperience.json"
import {
  Terminal,
  Code,
  Database,
  Server,
  Globe,
  Users,
  Calendar,
  MapPin,
  Award,
  Zap,
  Building,
  Cpu,
  Monitor,
  ChevronRight,
  ExternalLink,
  Download,
  Mail,
  ArrowUpRight,
  Layers,
  GitBranch,
  Activity,
  Briefcase,
} from "lucide-react"

interface Experience {
  title: string
  company: string
  location: string
  from: string
  to: string
  description: string
  keyResponsibilities?: string[]
  achievements?: string[]
  technologies?: string[]
}

interface TechExperience extends Experience {
  id: string
  status: "current" | "completed"
  duration: {
    years: number
    months: number
    display: string
  }
  metrics: {
    projects?: number
    clients?: number
    uptime?: string
    impact?: string
  }
  techStack: string[]
  highlights: string[]
}

// Transform experience data with tech focus
const transformToTechExperience = (): TechExperience[] => {
  return jobExperienceData.map((job, index) => {
    const isCurrent = job.to === "Present"
    const [fromMonth, fromYear] = job.from.split("-").map((n) => parseInt(n))
    const [toMonth, toYear] = isCurrent
      ? [new Date().getMonth() + 1, new Date().getFullYear()]
      : job.to.split("-").map((n) => parseInt(n))

    const totalMonths = (toYear - fromYear) * 12 + (toMonth - fromMonth)
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12

    // Helper function to format month and year
    const formatMonthYear = (month: number, year: number) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      return `${monthNames[month - 1]} ${year}`
    }

    const extractMetrics = (job: Experience, years: number) => {
      const metrics: any = {}
      job.achievements?.forEach((achievement) => {
        if (achievement.includes("100+")) metrics.projects = 100
        if (achievement.includes("50+")) metrics.clients = 50
        if (achievement.includes("99%")) metrics.uptime = "99.9%"
        if (achievement.includes("65%")) metrics.impact = "+65% performance"
      })

      // Set defaults based on type
      if (!metrics.projects) {
        metrics.projects =
          job.company === "Freelancer" ? 100 : Math.max(years * 12, 15)
      }

      return metrics
    }

    return {
      id: `tech-${index}`,
      title: job.title,
      company: job.company,
      location: job.location,
      from: job.from,
      to: job.to,
      description: job.description,
      keyResponsibilities: job.keyResponsibilities || [],
      achievements: job.achievements || [],
      technologies: job.technologies || [],
      status: isCurrent ? "current" : "completed",
      duration: {
        years,
        months,
        display: `${formatMonthYear(fromMonth, fromYear)} - ${
          isCurrent ? "Present" : formatMonthYear(toMonth, toYear)
        }`,
      },
      metrics: extractMetrics(job, years),
      techStack: job.technologies || [],
      highlights: job.achievements?.slice(0, 3) || [],
    }
  })
}

const ModernExperience: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const experiences = transformToTechExperience()
  const [selectedExp, setSelectedExp] = useState<string>(
    experiences[0]?.id || ""
  )
  const [hoveredExp, setHoveredExp] = useState<string | null>(null)

  const activeExperience =
    experiences.find((exp) => exp.id === selectedExp) || experiences[0]
  const totalYears = experiences.reduce(
    (sum, exp) => sum + exp.duration.years,
    0
  )
  const totalProjects = experiences.reduce(
    (sum, exp) => sum + (exp.metrics.projects || 0),
    0
  )

  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [])

  const downloadResume = useCallback(() => {
    const link = document.createElement("a")
    link.href = "./cv/Theodoros-Mentis-CV.pdf"
    link.download = "Theodoros_Mentis_CV.pdf"
    link.click()
  }, [])

  const getCompanyIcon = (company: string) => {
    if (company === "Freelancer") return Terminal
    if (company.toLowerCase().includes("global")) return Globe
    if (company.toLowerCase().includes("café")) return Monitor
    return Building
  }

  return (
    <section
      ref={targetRef}
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      id="experience"
    >
      <div className="container">
        {/* Header - consistent with other sections */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Briefcase className="w-4 h-4" />
            Professional Journey
          </div>
          <h2
            className={`text-6xl md:text-8xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Experience I've Gained
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {totalYears}+ years of experience building web solutions, from
            system administration to full-stack development and consulting.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experience List - More Compact */}
          <div className="lg:col-span-1 space-y-3">
            {experiences.map((exp, index) => {
              const isSelected = selectedExp === exp.id
              const isHovered = hoveredExp === exp.id
              const IconComponent = getCompanyIcon(exp.company)

              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExp(exp.id)}
                  onMouseEnter={() => setHoveredExp(exp.id)}
                  onMouseLeave={() => setHoveredExp(null)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                    isSelected
                      ? isDark
                        ? "bg-blue-500/10 border-blue-500/30 shadow-lg"
                        : "bg-blue-50 border-blue-200/50 shadow-lg"
                      : isDark
                      ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600"
                      : "bg-white/50 border-slate-200/50 hover:bg-white/80 hover:border-slate-300"
                  } ${isHovered && !isSelected ? "scale-[1.01]" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Company Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : isDark
                          ? "bg-slate-700 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Company & Status */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-semibold text-sm truncate ${
                            isSelected
                              ? "text-blue-600 dark:text-blue-400"
                              : isDark
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {exp.company}
                        </h3>
                        {exp.status === "current" && (
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {exp.duration.display}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-all ${
                            isSelected
                              ? "text-blue-500 rotate-90"
                              : isDark
                              ? "text-slate-600"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Experience Details */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl overflow-hidden border ${
                isDark
                  ? "bg-slate-800/30 border-slate-700/50"
                  : "bg-white/80 border-slate-200/50"
              } backdrop-blur-sm`}
            >
              {/* Header - Subtle gradient */}
              <div
                className={`p-6 ${
                  isDark
                    ? "bg-gradient-to-r from-slate-800/50 to-slate-700/50"
                    : "bg-gradient-to-r from-slate-50 to-slate-100/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {activeExperience.title}
                      </h3>
                      {activeExperience.status === "current" && (
                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            isDark
                              ? "bg-green-400/20 text-green-400"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          <Activity className="w-3 h-3 animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-lg font-semibold mb-2 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {activeExperience.company}
                    </div>
                    <div
                      className={`flex items-center gap-4 text-sm ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {activeExperience.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {activeExperience.from} - {activeExperience.to}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-bold font-mono ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {activeExperience.duration.display}
                    </div>
                    <div
                      className={`text-xs font-mono ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Period
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <p
                    className={`text-base leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {activeExperience.description}
                  </p>
                </div>

                {/* Metrics Grid */}
                {Object.keys(activeExperience.metrics).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {activeExperience.metrics.projects && (
                      <div
                        className={`p-3 rounded-lg ${
                          isDark ? "bg-slate-700/30" : "bg-slate-100/50"
                        }`}
                      >
                        <Globe className="w-5 h-5 mb-1 text-blue-500" />
                        <div
                          className={`text-lg font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {activeExperience.metrics.projects}+
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Projects
                        </div>
                      </div>
                    )}

                    {activeExperience.metrics.clients && (
                      <div
                        className={`p-3 rounded-lg ${
                          isDark ? "bg-slate-700/30" : "bg-slate-100/50"
                        }`}
                      >
                        <Users className="w-5 h-5 mb-1 text-green-500" />
                        <div
                          className={`text-lg font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {activeExperience.metrics.clients}+
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Clients
                        </div>
                      </div>
                    )}

                    {activeExperience.metrics.uptime && (
                      <div
                        className={`p-3 rounded-lg ${
                          isDark ? "bg-slate-700/30" : "bg-slate-100/50"
                        }`}
                      >
                        <Server className="w-5 h-5 mb-1 text-purple-500" />
                        <div
                          className={`text-lg font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {activeExperience.metrics.uptime}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Uptime
                        </div>
                      </div>
                    )}

                    {activeExperience.metrics.impact && (
                      <div
                        className={`p-3 rounded-lg ${
                          isDark ? "bg-slate-700/30" : "bg-slate-100/50"
                        }`}
                      >
                        <Zap className="w-5 h-5 mb-1 text-amber-500" />
                        <div
                          className={`text-sm font-bold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {activeExperience.metrics.impact}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          Impact
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Key Highlights */}
                {activeExperience.highlights.length > 0 && (
                  <div className="mb-6">
                    <h4
                      className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      <Award className="w-5 h-5 text-amber-500" />
                      Key Achievements
                    </h4>
                    <div className="space-y-2">
                      {activeExperience.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                          <p
                            className={`text-sm leading-relaxed ${
                              isDark ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                {activeExperience.techStack.length > 0 && (
                  <div>
                    <h4
                      className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      <Code className="w-5 h-5 text-blue-500" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeExperience.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-md text-sm transition-all hover:scale-105 ${
                            isDark
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - consistent with other sections */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Ready to Work Together?
            </h3>
            <p className="text-lg mb-6 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              With {totalYears}+ years of experience, I'm ready to help bring
              your ideas to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Get in Touch
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={downloadResume}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

ModernExperience.displayName = "ModernExperience"
export default ModernExperience
