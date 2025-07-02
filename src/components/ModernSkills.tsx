import React, { useState, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import useSkillsData from "../hooks/useSkillsData"
import usePerformanceMonitor from "../hooks/usePerformanceMonitor"
import CategoryCard from "./skills/CategoryCard"
import CategoryHeader from "./skills/CategoryHeader"
import SkillCard from "./skills/SkillCard"
import SkillsStats from "./skills/SkillsStats"
import SkillsCallToAction from "./skills/SkillsCallToAction"
import { Sparkles } from "lucide-react"

const ModernSkills: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  // Performance monitoring
  const { getPerformanceReport } = usePerformanceMonitor("ModernSkills")

  const [activeCategory, setActiveCategory] = useState<string>("languages")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Use the custom hook for skills data
  const { skillCategories, stats } = useSkillsData()

  // Log performance report in development
  React.useEffect(() => {
    const isDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    if (isDevelopment) {
      const report = getPerformanceReport()
      if (report.totalRenders % 5 === 0 && report.totalRenders > 0) {
        console.log("📊 ModernSkills Performance:", report)
      }
    }
  }, [getPerformanceReport])

  // Add navigation functions
  const scrollToProjects = useCallback(() => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      const headerOffset = 80
      const elementPosition = projectsSection.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }, [])

  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      const headerOffset = 80
      const elementPosition = contactSection.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }, [])

  const currentCategory =
    skillCategories[activeCategory as keyof typeof skillCategories]

  return (
    <section
      ref={targetRef}
      className={`py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      id="skills"
    >
      <div className="container">
        {/* Personal header */}
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${
              isDark
                ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30"
                : "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            My Technical Journey
          </div>

          <h2
            className={`text-5xl md:text-7xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Technologies I Love
            </span>
          </h2>

          <p
            className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Every technology I've learned has shaped how I think and create.
            Here's my personal journey through the tools and languages that have
            become part of my story as a developer.
          </p>
        </div>

        {/* Main content with storytelling approach */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category navigation - more personal */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`text-center lg:text-left mb-8`}>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Explore My Skills
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Click on any category to dive deeper into my experience
              </p>
            </div>

            {Object.entries(skillCategories).map(([key, category]) => (
              <CategoryCard
                key={key}
                categoryKey={key}
                category={category}
                isActive={activeCategory === key}
                onClick={setActiveCategory}
              />
            ))}

            {/* Personal stats */}
            <SkillsStats
              totalSkills={stats.totalSkills}
              masteredSkills={stats.masteredSkills}
              proficientSkills={stats.proficientSkills}
            />
          </div>

          {/* Skills showcase */}
          <div className="lg:col-span-2">
            {/* Category story header */}
            <CategoryHeader category={currentCategory} />

            {/* Skills grid with stories */}
            <div className="grid md:grid-cols-2 gap-6">
              {currentCategory.skills.map((skill, index) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  index={index}
                  isVisible={isVisible}
                  hoveredSkill={hoveredSkill}
                  onHover={setHoveredSkill}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Personal call to action */}
        <SkillsCallToAction
          onScrollToProjects={scrollToProjects}
          onScrollToContact={scrollToContact}
        />
      </div>
    </section>
  )
}

ModernSkills.displayName = "ModernSkills"
export default ModernSkills
