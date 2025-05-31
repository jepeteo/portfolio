import React, { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import jobExperienceData from "../assets/jobExperience.json"
import {
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  Award,
  TrendingUp,
  Users,
  Code,
  Globe,
  Zap,
  Heart,
  Star,
  Building,
  Server,
  Shield,
  Database,
  Laptop,
  CheckCircle,
  Target,
} from "lucide-react"

// Enhanced experience interface that matches your JSON structure
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

// Enhanced experience data with computed metadata
interface EnhancedExperience extends Experience {
  id: string
  type: "full-time" | "freelance" | "contract" | "part-time"
  current: boolean
  duration: string
  yearsDuration: number
  highlights: {
    projects?: number
    clients?: number
    years?: number
    uptime?: string
    performance?: string
  }
  displayTechnologies: string[]
  displayAchievements: string[]
  displayResponsibilities: string[]
}

// Transform the JSON data with all available information
const transformExperienceData = (): EnhancedExperience[] => {
  return jobExperienceData.map((job, index) => {
    const isCurrent = job.to === "Present"
    const isFreelance = job.company === "Freelancer"

    // Parse dates more accurately
    const [fromMonth, fromYear] = job.from
      .split("-")
      .map((num) => parseInt(num))
    const [toMonth, toYear] = isCurrent
      ? [new Date().getMonth() + 1, new Date().getFullYear()]
      : job.to.split("-").map((num) => parseInt(num))

    // Calculate exact duration in years
    const yearsDuration = toYear - fromYear + (toMonth - fromMonth) / 12
    const roundedYears = Math.round(yearsDuration * 10) / 10

    // Format duration string
    const formatDuration = (from: string, to: string) => {
      const months = [
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
      const [fMonth, fYear] = from.split("-").map((num) => parseInt(num))
      const [tMonth, tYear] =
        to === "Present"
          ? [new Date().getMonth() + 1, new Date().getFullYear()]
          : to.split("-").map((num) => parseInt(num))

      return `${months[fMonth - 1]} ${fYear} - ${
        to === "Present" ? "Present" : `${months[tMonth - 1]} ${tYear}`
      }`
    }

    // Use provided technologies or fallback to detection
    const displayTechnologies = job.technologies || []

    // Use provided achievements or fallback to extraction
    const displayAchievements = job.achievements || []

    // Use provided responsibilities or fallback to extraction
    const displayResponsibilities = job.keyResponsibilities || []

    // Enhanced highlights based on actual data
    const getHighlights = (job: Experience, years: number) => {
      const highlights: any = { years: roundedYears }

      // Extract specific metrics from achievements
      job.achievements?.forEach((achievement) => {
        if (achievement.includes("100+") && achievement.includes("projects")) {
          highlights.projects = 100
        } else if (
          achievement.includes("50+") &&
          achievement.includes("clients")
        ) {
          highlights.clients = 50
        } else if (
          achievement.includes("99%") &&
          achievement.includes("uptime")
        ) {
          highlights.uptime = "99%"
        } else if (
          achievement.includes("65%") &&
          achievement.includes("loading")
        ) {
          highlights.performance = "65%"
        } else if (
          achievement.includes("15+") &&
          achievement.includes("platforms")
        ) {
          highlights.projects = 15
        } else if (
          achievement.includes("25+") &&
          achievement.includes("migrations")
        ) {
          highlights.projects = 25
        }
      })

      // Fallback estimates based on company and role
      if (!highlights.projects) {
        if (job.company === "Freelancer") {
          highlights.projects = 100
          highlights.clients = 50
        } else if (job.company === "Global Touch") {
          highlights.projects = 25
        } else if (job.company === "Greekonline") {
          highlights.projects = 30
        } else {
          highlights.projects = Math.round(years * 8)
        }
      }

      return highlights
    }

    // Determine job type
    const getJobType = (
      company: string,
      title: string
    ): EnhancedExperience["type"] => {
      if (company === "Freelancer") return "freelance"
      // if (
      //   title.toLowerCase().includes("manager") &&
      //   company.toLowerCase().includes("café")
      // )
      // return "part-time"
      return "full-time"
    }

    return {
      id: (index + 1).toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      from: job.from,
      to: job.to,
      description: job.description,
      keyResponsibilities: job.keyResponsibilities,
      achievements: job.achievements,
      technologies: job.technologies,
      type: getJobType(job.company, job.title),
      current: isCurrent,
      duration: formatDuration(job.from, job.to),
      yearsDuration: roundedYears,
      highlights: getHighlights(job, roundedYears),
      displayTechnologies,
      displayAchievements,
      displayResponsibilities,
    }
  })
}

const ModernExperience: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const experienceData = transformExperienceData()
  const [selectedExperience, setSelectedExperience] = useState<string>(
    experienceData[0].id
  )
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const selectedExp =
    experienceData.find((exp) => exp.id === selectedExperience) ||
    experienceData[0]

  // Calculate total experience current year - 15
  const totalExperience = new Date().getFullYear() - 2000

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "freelance":
        return <Zap className="w-4 h-4" />
      case "full-time":
        return <Building className="w-4 h-4" />
      case "contract":
        return <Code className="w-4 h-4" />
      case "part-time":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Briefcase className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "freelance":
        return "from-green-500 to-emerald-500"
      case "full-time":
        return "from-blue-500 to-indigo-500"
      case "contract":
        return "from-purple-500 to-violet-500"
      case "part-time":
        return "from-orange-500 to-red-500"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getCompanyIcon = (company: string) => {
    if (company === "Freelancer") return <Zap className="w-4 h-4" />
    if (company.toLowerCase().includes("café"))
      return <Laptop className="w-4 h-4" />
    if (company.toLowerCase().includes("tech"))
      return <Code className="w-4 h-4" />
    if (
      company.toLowerCase().includes("global") ||
      company.toLowerCase().includes("experience")
    )
      return <Globe className="w-4 h-4" />
    return <Building className="w-4 h-4" />
  }

  const TimelineCard = ({
    exp,
    index,
  }: {
    exp: EnhancedExperience
    index: number
  }) => {
    const isSelected = selectedExperience === exp.id
    const isHovered = hoveredCard === exp.id

    return (
      <div
        className={`relative transition-all duration-500 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
        style={{ animationDelay: `${index * 150}ms` }}
        onMouseEnter={() => setHoveredCard(exp.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Timeline line connector */}
        {index < experienceData.length - 1 && (
          <div
            className={`absolute left-6 top-16 w-0.5 h-20 transition-colors duration-300 ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            } ${isSelected ? "bg-blue-500" : ""}`}
          />
        )}

        <button
          onClick={() => setSelectedExperience(exp.id)}
          className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${
            isSelected
              ? isDark
                ? "bg-slate-800 border-blue-500/50 shadow-lg shadow-blue-500/20"
                : "bg-white border-blue-500/50 shadow-lg shadow-blue-500/10"
              : isDark
              ? "bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50"
              : "bg-white/30 border-slate-200/50 hover:border-slate-300/50 hover:bg-white/50"
          } ${isHovered ? "scale-[1.02]" : ""}`}
        >
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${getTypeColor(
                  exp.type
                )} ${isSelected ? "ring-4 ring-blue-500/30" : ""}`}
              >
                {getCompanyIcon(exp.company)}
              </div>
              {exp.current && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3
                    className={`font-bold text-lg transition-colors line-clamp-2 ${
                      isSelected
                        ? "text-blue-500"
                        : isDark
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {exp.title}
                  </h3>
                  <p
                    className={`font-medium ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {exp.company}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-all flex-shrink-0 ${
                    isSelected
                      ? "text-blue-500 rotate-90"
                      : isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                <div
                  className={`flex items-center gap-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {exp.yearsDuration} years
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {exp.location.split(" (")[0]}
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTypeColor(
                  exp.type
                )}`}
              >
                {getTypeIcon(exp.type)}
                {exp.type.charAt(0).toUpperCase() +
                  exp.type.slice(1).replace("-", " ")}
              </span>
            </div>
          </div>
        </button>
      </div>
    )
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-purple-100 text-purple-700 border border-purple-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Professional Journey
          </div>

          <h2
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              My Experience
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Over {totalExperience} years of professional experience in web
            development, from system administration to full-stack development
            and freelance consulting.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Timeline Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <h3
              className={`text-lg font-semibold mb-6 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Career Timeline
            </h3>

            {experienceData.map((exp, index) => (
              <TimelineCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-3">
            <div
              className={`sticky top-8 p-8 rounded-2xl border backdrop-blur-sm ${
                isDark
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white/50 border-slate-200/50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {selectedExp.title}
                  </h3>
                  <div className="flex items-center gap-4 flex-wrap mb-2">
                    <p
                      className={`text-lg font-medium ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {selectedExp.company}
                    </p>
                    <span
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {selectedExp.location}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {selectedExp.duration}
                  </p>
                </div>
                {selectedExp.current && (
                  <span
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                      isDark
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Current Role
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <p
                  className={`text-base leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {selectedExp.description}
                </p>
              </div>

              {/* Highlights */}
              {Object.keys(selectedExp.highlights).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {selectedExp.highlights.years && (
                    <div
                      className={`text-center p-4 rounded-xl ${
                        isDark ? "bg-slate-700/50" : "bg-slate-100/50"
                      }`}
                    >
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedExp.highlights.years}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Years
                      </div>
                    </div>
                  )}
                  {selectedExp.highlights.projects && (
                    <div
                      className={`text-center p-4 rounded-xl ${
                        isDark ? "bg-slate-700/50" : "bg-slate-100/50"
                      }`}
                    >
                      <Globe className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <div
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedExp.highlights.projects}+
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Projects
                      </div>
                    </div>
                  )}
                  {selectedExp.highlights.clients && (
                    <div
                      className={`text-center p-4 rounded-xl ${
                        isDark ? "bg-slate-700/50" : "bg-slate-100/50"
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedExp.highlights.clients}+
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Clients
                      </div>
                    </div>
                  )}
                  {selectedExp.highlights.uptime && (
                    <div
                      className={`text-center p-4 rounded-xl ${
                        isDark ? "bg-slate-700/50" : "bg-slate-100/50"
                      }`}
                    >
                      <Server className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                      <div
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedExp.highlights.uptime}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Uptime
                      </div>
                    </div>
                  )}
                  {selectedExp.highlights.performance && (
                    <div
                      className={`text-center p-4 rounded-xl ${
                        isDark ? "bg-slate-700/50" : "bg-slate-100/50"
                      }`}
                    >
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                      <div
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedExp.highlights.performance}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Faster
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Key Responsibilities */}
              {selectedExp.displayResponsibilities.length > 0 && (
                <div className="mb-6">
                  <h4
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <Target className="w-5 h-5 text-blue-500" />
                    Key Responsibilities
                  </h4>
                  <div className="space-y-2">
                    {selectedExp.displayResponsibilities.map(
                      (responsibility, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            isDark ? "bg-slate-700/30" : "bg-slate-100/30"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p
                            className={`text-sm leading-relaxed ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {responsibility}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Key Achievements */}
              {selectedExp.displayAchievements.length > 0 && (
                <div className="mb-6">
                  <h4
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <Award className="w-5 h-5 text-yellow-500" />
                    Key Achievements
                  </h4>
                  <div className="space-y-3">
                    {selectedExp.displayAchievements.map(
                      (achievement, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            isDark
                              ? "bg-yellow-500/10 border border-yellow-500/20"
                              : "bg-yellow-50 border border-yellow-200"
                          }`}
                        >
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p
                            className={`text-sm leading-relaxed ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {achievement}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {selectedExp.displayTechnologies.length > 0 && (
                <div>
                  <h4
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <Code className="w-5 h-5 text-blue-500" />
                    Technologies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExp.displayTechnologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:scale-105 ${
                          isDark
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                            : "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200"
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

        {/* Call to Action */}
        <div className="mt-16">
          <div
            className={`p-8 rounded-2xl text-center border backdrop-blur-sm ${
              isDark
                ? "bg-gradient-to-r from-slate-800/40 to-slate-700/40 border-slate-600/50"
                : "bg-gradient-to-r from-slate-50/40 to-white/40 border-slate-200/50"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Let's Work Together
            </h3>
            <p
              className={`text-lg mb-6 max-w-2xl mx-auto ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              With over {totalExperience} years of experience in web development
              and server administration, I'm ready to help bring your next
              project to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Get In Touch
              </button>
              <button
                className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
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
