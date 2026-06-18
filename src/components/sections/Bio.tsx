import React, { memo, useState, useEffect, useRef } from "react"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import { BlurImage } from "../system/loading/LoadingStates"
import SectionShell from "../ui/SectionShell"
import { v2PrimaryButton, v2SecondaryButton } from "../ui/v2Styles"
import { cn } from "../../utils/styles"
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

import profileImage from "../../assets/images/gteo.webp"
import type { LucideIcon } from "lucide-react"

const resumePDF = "./cv/Theodoros-Mentis-CV.pdf"

interface StatItem {
  label: string
  value: string
  icon: LucideIcon
  color: string
}

const iconTile =
  "flex items-center justify-center rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]"

const StatsCard = memo(
  ({
    stat,
    index,
  }: {
    stat: StatItem
    index: number
  }) => {
    const [displayValue, setDisplayValue] = useState("0")
    const [hasAnimated, setHasAnimated] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true)

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

    return (
      <div
        ref={cardRef}
        className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 text-center transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--v2-acid)]/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          transition: `all 0.6s ease ${index * 200}ms`,
        }}
      >
        <div className={cn("mx-auto mb-4 h-16 w-16", iconTile)}>
          <IconComponent className="h-8 w-8" />
        </div>
        <div className="mb-2 text-[var(--v2-text)]">
          <span className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {displayValue}
          </span>
        </div>
        <div className="text-sm font-medium text-[var(--v2-muted)]">
          {stat.label}
        </div>
      </div>
    )
  }
)

StatsCard.displayName = "StatsCard"

const Bio: React.FC = () => {
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [activeSection, setActiveSection] = useState<
    "about" | "expertise" | "approach"
  >("about")

  const bioContent = {
    intro: `I am a Senior Full-Stack Developer with 18+ years of experience in creating 
    scalable web solutions and managing complex server environments. Originally from Greece, 
    I'm now based in Berlin, Germany, where I continue to craft exceptional digital experiences. 
    My expertise spans from front-end development with modern frameworks to back-end architecture 
    and database optimization.`,

    passion: `What drives me is the opportunity to transform creative visions into digital reality 
    through collaborative development. I specialize in WordPress development, React applications, 
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

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: "about" | "expertise" | "approach"
    label: string
    icon: LucideIcon
  }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={cn(
        "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]",
        activeSection === id
          ? "border-2 border-[var(--v2-acid)] bg-[var(--v2-acid)]/12 text-[var(--v2-acid)]"
          : "border-2 border-transparent text-[var(--v2-muted)] hover:bg-[var(--v2-panel-2)]/60 hover:text-[var(--v2-text)]"
      )}
      aria-pressed={activeSection === id}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const downloadResume = () => {
    const link = document.createElement("a")
    link.href = resumePDF
    link.download = "Theodoros_Mentis_CV.pdf"
    link.target = "_blank"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openGitHub = () => {
    window.open("https://github.com/jepeteo", "_blank")
  }

  const compactSecondary =
    "flex items-center justify-center gap-2 rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-4 py-2 text-sm font-medium text-[var(--v2-text)] transition-colors hover:border-[var(--v2-acid)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"

  return (
    <SectionShell
      ref={targetRef}
      id="about"
      variant="muted"
      eyebrow="About me"
      title="The developer behind the work"
      subtitle="18+ years fixing, improving and building web systems for real businesses."
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={`stats-${stat.label}`} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-8">
            <div className="mb-8 text-center">
              <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]">
                <BlurImage
                  src={profileImage}
                  alt="Theodoros Mentis - Senior Full-Stack Developer based in Berlin, Germany"
                  containerClassName="w-full h-full rounded-3xl"
                  className="rounded-3xl"
                  aspectRatio="square"
                  placeholderColor="rgb(18 24 39)"
                  loading="lazy"
                />

                <div
                  className="fallback-icon absolute inset-0 flex items-center justify-center text-[var(--v2-acid)]"
                  style={{ display: "none" }}
                >
                  <User className="h-16 w-16" />
                </div>
              </div>

              <div className="relative m-auto mb-2 w-32 rounded-full border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/15 px-2 py-1 text-xs font-medium text-[var(--v2-ok)]">
                <div className="flex items-center justify-around gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--v2-ok)]" />
                  Available
                </div>
              </div>

              <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
                Theodoros Mentis
              </h3>
              <p className="mb-4 text-lg text-[var(--v2-brand)]">
                Senior Full-Stack Developer • React | WordPress | Berlin-based
              </p>

              <div className="mb-6 flex items-center justify-center gap-2 text-sm text-[var(--v2-muted)]">
                <MapPin className="h-4 w-4" />
                Berlin, Germany
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
                  18+
                </div>
                <div className="text-sm text-[var(--v2-muted)]">Years Exp.</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
                  390+
                </div>
                <div className="text-sm text-[var(--v2-muted)]">Projects</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => scrollTo("contact")}
                className={cn(v2PrimaryButton, "w-full")}
              >
                <Mail className="h-4 w-4" />
                Get in touch
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={downloadResume} className={compactSecondary}>
                  <Download className="h-4 w-4" />
                  Resume
                </button>

                <button onClick={openGitHub} className={compactSecondary}>
                  <Github className="h-4 w-4" />
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-8">
            <div className="mb-8 flex flex-wrap gap-3">
              <TabButton id="about" label="About" icon={User} />
              <TabButton id="expertise" label="Expertise" icon={Code2} />
              <TabButton id="approach" label="Approach" icon={Target} />
            </div>

            <div className="min-h-[500px]">
              {activeSection === "about" && (
                <div className="animate-fadeIn space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-4 text-xl font-semibold text-[var(--v2-text)]">
                        Introduction
                      </h4>
                      <p className="text-lg leading-relaxed text-[var(--v2-muted)]">
                        {bioContent.intro}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-4 text-xl font-semibold text-[var(--v2-text)]">
                        What drives me
                      </h4>
                      <p className="text-lg leading-relaxed text-[var(--v2-muted)]">
                        {bioContent.passion}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-4 text-xl font-semibold text-[var(--v2-text)]">
                        Current focus
                      </h4>
                      <p className="text-lg leading-relaxed text-[var(--v2-muted)]">
                        {bioContent.current}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-6">
                    <button
                      onClick={() => scrollTo("projects")}
                      className={v2SecondaryButton}
                    >
                      View my work
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "expertise" && (
                <div className="animate-fadeIn space-y-6">
                  {expertise.map((area, index) => {
                    const IconComponent = area.icon

                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/40 p-6 transition-colors hover:border-[var(--v2-acid)]/40"
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("h-12 w-12 flex-shrink-0", iconTile)}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-3 text-lg font-semibold text-[var(--v2-text)]">
                              {area.category}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {area.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel)] px-3 py-1 text-sm font-medium text-[var(--v2-muted)]"
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

              {activeSection === "approach" && (
                <div className="animate-fadeIn space-y-6">
                  {approach.map((principle, index) => {
                    const IconComponent = principle.icon

                    return (
                      <div key={index} className="flex gap-4">
                        <div className={cn("h-12 w-12 flex-shrink-0", iconTile)}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="mb-2 text-lg font-semibold text-[var(--v2-text)]">
                            {principle.title}
                          </h4>
                          <p className="leading-relaxed text-[var(--v2-muted)]">
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

      <div className="mt-16 text-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--v2-line-strong)] bg-[radial-gradient(circle_at_15%_20%,rgb(from_var(--v2-brand)_r_g_b/0.16),transparent_40%),radial-gradient(circle_at_85%_80%,rgb(from_var(--v2-acid)_r_g_b/0.12),transparent_44%),var(--v2-panel)] p-8">
          <div className="relative">
            <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)] md:text-3xl">
              Ready to fix or build something?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--v2-muted)]">
              Tell me what's broken or what you want to build. I'll come back
              with practical next steps and a clear quote.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className={v2PrimaryButton}
              >
                <Mail className="h-5 w-5" />
                Start a conversation
              </button>

              <button
                onClick={() => scrollTo("projects")}
                className={v2SecondaryButton}
              >
                <ExternalLink className="h-5 w-5" />
                View portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

Bio.displayName = "Bio"
export default memo(Bio)
