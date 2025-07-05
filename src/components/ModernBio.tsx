import React, { memo, useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import {
  User,
  MapPin,
  Calendar,
  Code2,
  Heart,
  Download,
  Mail,
  ExternalLink,
  Target,
  Zap,
  Users,
  Monitor,
  Server,
  Database,
  Globe,
  CheckCircle,
  ArrowRight,
  Github,
} from "lucide-react"

// Import the image (this should work if the image is in src/assets)
import profileImage from "../assets/images/gteo.webp"

// For files in public folder, use a string path instead of import
const resumePDF = "./cv/Theodoros-Mentis-CV.pdf"

const StatsCard = memo(
  ({
    stat,
    index,
    isDark,
    getColorClasses,
  }: {
    stat: any
    index: number
    isDark: boolean
    getColorClasses: (color: string) => any
  }) => {
    const [displayValue, setDisplayValue] = useState("0")
    const [hasAnimated, setHasAnimated] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    // Use Intersection Observer for this specific card
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true)

            // Start animation after delay
            const timeout = setTimeout(() => {
              const numericValue = parseInt(stat.value.replace(/\D/g, ""))
              const suffix = stat.value.replace(/\d/g, "")

              let currentValue = 0
              const increment = numericValue / 30

              const interval = setInterval(() => {
                currentValue += increment
                if (currentValue >= numericValue) {
                  setDisplayValue(stat.value)
                  setHasAnimated(true)
                  clearInterval(interval)
                } else {
                  setDisplayValue(Math.floor(currentValue) + suffix)
                }
              }, 50)

              return () => clearInterval(interval)
            }, index * 200)

            return () => clearTimeout(timeout)
          }
        },
        { threshold: 0.5, rootMargin: "50px" }
      )

      if (cardRef.current) {
        observer.observe(cardRef.current)
      }

      return () => observer.disconnect()
    }, [stat.value, index, hasAnimated])

    const IconComponent = stat.icon
    const colors = getColorClasses(stat.color)

    return (
      <div
        ref={cardRef}
        className={`p-6 rounded-2xl text-center transition-all duration-500 hover:scale-105 border ${
          isDark
            ? "bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600"
            : "bg-white/50 backdrop-blur-sm border-slate-200 hover:border-slate-300"
        }`}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          transition: `all 0.6s ease ${index * 200}ms`,
        }}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.text} border ${colors.border}`}
        >
          <IconComponent className="w-8 h-8" />
        </div>
        <div className={`mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <span className="font-bold text-2xl md:text-3xl">{displayValue}</span>
        </div>
        <div
          className={`text-sm font-medium ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {stat.label}
        </div>
      </div>
    )
  }
)

StatsCard.displayName = "StatsCard"

const ModernBio: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [activeSection, setActiveSection] = useState<
    "about" | "expertise" | "approach"
  >("about")

  const bioContent = {
    intro: `I am a Senior Full Stack Developer with over 18 years of experience in creating 
    scalable web solutions and managing complex server environments. My expertise spans from 
    front-end development with modern frameworks to back-end architecture and database optimization.`,

    passion: `What drives me is the challenge of solving complex problems and turning ideas into 
    reality through clean, efficient code. I specialize in WordPress development, React applications, 
    and full-stack solutions that deliver exceptional user experiences.`,

    current: `Currently, I focus on building modern web applications using cutting-edge technologies 
    while maintaining a strong foundation in proven solutions. I'm passionate about performance 
    optimization, security best practices, and creating maintainable codebases.`,
  }

  const stats = [
    { label: "Years Experience", value: "18+", icon: Calendar, color: "blue" },
    { label: "Projects Delivered", value: "390+", icon: Code2, color: "green" },
    { label: "Happy Clients", value: "172+", icon: Users, color: "purple" },
    { label: "Technologies", value: "20+", icon: Monitor, color: "orange" },
  ]

  const expertise = [
    {
      category: "Frontend Development",
      icon: Monitor,
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "Vue.js",
        "Tailwind CSS",
        "Modern CSS",
      ],
      color: "blue",
    },
    {
      category: "Backend Development",
      icon: Server,
      skills: [
        "Node.js",
        "PHP",
        "Python",
        "RESTful APIs",
        "GraphQL",
        "Microservices",
      ],
      color: "green",
    },
    {
      category: "Database & DevOps",
      icon: Database,
      skills: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Docker",
        "AWS",
        "Linux Administration",
      ],
      color: "purple",
    },
    {
      category: "CMS & E-commerce",
      icon: Globe,
      skills: [
        "WordPress",
        "WooCommerce",
        "Custom Themes",
        "Plugin Development",
        "Shopify",
      ],
      color: "orange",
    },
  ]

  const approach = [
    {
      icon: Target,
      title: "User-Centered Design",
      description:
        "Every solution starts with understanding the user's needs and creating intuitive experiences.",
    },
    {
      icon: Zap,
      title: "Performance First",
      description:
        "I prioritize speed, efficiency, and scalability in every line of code I write.",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description:
        "Rigorous testing and code review processes ensure reliable, maintainable solutions.",
    },
    {
      icon: Heart,
      title: "Continuous Learning",
      description:
        "Staying current with emerging technologies and industry best practices.",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: isDark ? "bg-blue-500/20" : "bg-blue-100",
        text: isDark ? "text-blue-300" : "text-blue-700",
        border: isDark ? "border-blue-500/30" : "border-blue-200",
      },
      green: {
        bg: isDark ? "bg-green-500/20" : "bg-green-100",
        text: isDark ? "text-green-300" : "text-green-700",
        border: isDark ? "border-green-500/30" : "border-green-200",
      },
      purple: {
        bg: isDark ? "bg-purple-500/20" : "bg-purple-100",
        text: isDark ? "text-purple-300" : "text-purple-700",
        border: isDark ? "border-purple-500/30" : "border-purple-200",
      },
      orange: {
        bg: isDark ? "bg-orange-500/20" : "bg-orange-100",
        text: isDark ? "text-orange-300" : "text-orange-700",
        border: isDark ? "border-orange-500/30" : "border-orange-200",
      },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: "about" | "expertise" | "approach"
    label: string
    icon: any
  }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
        activeSection === id
          ? isDark
            ? "bg-blue-500/20 text-blue-300 border-2 border-blue-500/30"
            : "bg-blue-100 text-blue-700 border-2 border-blue-200"
          : isDark
          ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border-2 border-transparent"
          : "text-slate-600 hover:text-slate-700 hover:bg-slate-100/50 border-2 border-transparent"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )

  // Add navigation functions
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const downloadResume = () => {
    const link = document.createElement("a")
    link.href = resumePDF
    link.download = "Theodoros_Mentis_CV.pdf"
    link.target = "_blank" // Fallback

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openGitHub = () => {
    window.open("https://github.com/jepeteo", "_blank")
  }

  return (
    <section
      ref={targetRef}
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      id="about"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}
          >
            <User className="w-4 h-4" />
            About Me
          </div>

          <h2
            className={`text-6xl md:text-8xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
              Stories I Tell
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Crafting exceptional digital experiences with 18+ years of expertise
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatsCard
              key={`stats-${stat.label}`}
              stat={stat}
              index={index}
              isDark={isDark}
              getColorClasses={getColorClasses}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2 space-y-8">
            <div
              className={`p-8 rounded-2xl border ${
                isDark
                  ? "bg-slate-800/50 backdrop-blur-sm border-slate-700"
                  : "bg-white/50 backdrop-blur-sm border-slate-200"
              }`}
            >
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-32 h-32 mx-auto mb-4 rounded-3xl flex items-center justify-center relative overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                      : "bg-gradient-to-br from-blue-100 to-purple-100"
                  }`}
                >
                  {/* Profile Image */}
                  <img
                    src={profileImage}
                    alt="Theodoros Mentis"
                    className="w-full h-full object-cover rounded-3xl"
                    loading="lazy"
                  />

                  {/* Fallback icon (hidden by default) */}
                  <div
                    className={`fallback-icon absolute inset-0 flex items-center justify-center ${
                      isDark ? "text-blue-300" : "text-blue-600"
                    }`}
                    style={{ display: "none" }}
                  >
                    <User className="w-16 h-16" />
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`relative px-2 py-1 w-32 m-auto mb-2 rounded-full text-xs font-medium 
                    ${
                      isDark
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-1 justify-around">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available
                  </div>
                </div>

                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Theodoros Mentis
                </h3>
                <p
                  className={`text-lg mb-4 ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  Senior Full Stack Developer
                </p>

                <div
                  className={`flex items-center justify-center gap-2 text-sm mb-6 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Piraeus, Attica, Greece
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    18+
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Years Exp.
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    390+
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Projects
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={scrollToContact}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                    isDark
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Get In Touch
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadResume}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 border ${
                      isDark
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </button>

                  <button
                    onClick={openGitHub}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 border ${
                      isDark
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabbed Content (unchanged) */}
          <div className="lg:col-span-3">
            <div
              className={`p-8 rounded-2xl border ${
                isDark
                  ? "bg-slate-800/50 backdrop-blur-sm border-slate-700"
                  : "bg-white/50 backdrop-blur-sm border-slate-200"
              }`}
            >
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-3 mb-8">
                <TabButton id="about" label="About" icon={User} />
                <TabButton id="expertise" label="Expertise" icon={Code2} />
                <TabButton id="approach" label="Approach" icon={Target} />
              </div>

              {/* Tab Content */}
              <div className="min-h-[500px]">
                {/* About Tab */}
                {activeSection === "about" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-6">
                      <div>
                        <h4
                          className={`text-xl font-semibold mb-4 ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          Introduction
                        </h4>
                        <p
                          className={`leading-relaxed text-lg ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {bioContent.intro}
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`text-xl font-semibold mb-4 ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          What Drives Me
                        </h4>
                        <p
                          className={`leading-relaxed text-lg ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {bioContent.passion}
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`text-xl font-semibold mb-4 ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          Current Focus
                        </h4>
                        <p
                          className={`leading-relaxed text-lg ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {bioContent.current}
                        </p>
                      </div>
                    </div>

                    {/* Updated action buttons */}
                    <div className="flex flex-wrap gap-4 pt-6">
                      <button
                        onClick={() => {
                          const projectsSection =
                            document.getElementById("projects")
                          if (projectsSection) {
                            projectsSection.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            })
                          }
                        }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                          isDark
                            ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        View My Work
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Expertise Tab */}
                {activeSection === "expertise" && (
                  <div className="space-y-6 animate-fadeIn">
                    {expertise.map((area, index) => {
                      const IconComponent = area.icon
                      const colors = getColorClasses(area.color)

                      return (
                        <div
                          key={index}
                          className={`p-6 rounded-xl border transition-all hover:scale-[1.02] ${
                            isDark
                              ? "bg-slate-700/30 border-slate-600"
                              : "bg-slate-50/50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.text} border ${colors.border}`}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`text-lg font-semibold mb-3 ${
                                  isDark ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {area.category}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {area.skills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                                      isDark
                                        ? "bg-slate-600/50 text-slate-300"
                                        : "bg-white text-slate-700 border border-slate-200"
                                    }`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Approach Tab */}
                {activeSection === "approach" && (
                  <div className="space-y-6 animate-fadeIn">
                    {approach.map((principle, index) => {
                      const IconComponent = principle.icon

                      return (
                        <div key={index} className="flex gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isDark
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h4
                              className={`text-lg font-semibold mb-2 ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {principle.title}
                            </h4>
                            <p
                              className={`leading-relaxed ${
                                isDark ? "text-slate-300" : "text-slate-700"
                              }`}
                            >
                              {principle.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - Updated buttons */}
        <div className="text-center mt-16">
          <div
            className={`p-8 rounded-2xl border relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
                : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
            }`}
          >
            {/* Background Pattern - unchanged */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full translate-x-16 translate-y-16"></div>
            </div>

            <div className="relative">
              <h3
                className={`text-3xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Ready to Build Something Amazing?
              </h3>
              <p
                className={`text-lg mb-8 max-w-2xl mx-auto ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Let's collaborate on your next project. I'm always excited to
                work with creative minds and bring innovative ideas to life.
              </p>

              {/* Updated CTA buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={scrollToContact}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 ${
                    isDark
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  Start a Conversation
                </button>

                <button
                  onClick={() => {
                    const projectsSection = document.getElementById("projects")
                    if (projectsSection) {
                      projectsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  }}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 border ${
                    isDark
                      ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <ExternalLink className="w-5 h-5" />
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

ModernBio.displayName = "ModernBio"
export default memo(ModernBio)
