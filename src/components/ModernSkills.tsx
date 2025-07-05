import React, { useState, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import useSkillsData from "../hooks/useSkillsData"
import usePerformanceMonitor from "../hooks/usePerformanceMonitor"
// import { useRenderTracker } from "../utils/debugRenderLoop" // Temporarily disabled
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

  // Debug render tracking in development only - TEMPORARILY DISABLED
  // if (process.env.NODE_ENV === "development") {
  //   useRenderTracker("ModernSkills")
  // }

  // Performance monitoring
  const { getPerformanceReport } = usePerformanceMonitor("ModernSkills")

  const [activeCategory, setActiveCategory] = useState<string>("languages")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Use the custom hook for skills data
  const { skillCategories, stats } = useSkillsData()

  // Log performance report in development - only periodically to avoid excessive logging
  const renderCount = React.useRef(0)
  React.useEffect(() => {
    renderCount.current += 1
    if (
      process.env.NODE_ENV === "development" &&
      renderCount.current % 10 === 0 &&
      renderCount.current > 0
    ) {
      const report = getPerformanceReport()
      console.log("📊 ModernSkills Performance:", report)
    }
  })

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

        {/* Mobile-first responsive layout */}
        {/* Compact stats bar for mobile */}
        <div className="lg:hidden mb-8">
          <SkillsStats
            totalSkills={stats.totalSkills}
            masteredSkills={stats.masteredSkills}
            proficientSkills={stats.proficientSkills}
            compact={true}
          />
        </div>

        {/* Horizontal scrollable categories for mobile */}
        <div className="lg:hidden mb-8">
          <div className="text-center mb-6">
            <h3
              className={`text-xl font-bold mb-2 ${
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
              Tap a category to explore skills
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto py-2 px-4 -mx-4 scrollbar-hide">
            {Object.entries(skillCategories).map(([key, category]) => (
              <CategoryCard
                key={key}
                categoryKey={key}
                category={category}
                isActive={activeCategory === key}
                onClick={setActiveCategory}
                mobile={true}
              />
            ))}
          </div>

          {/* Scroll legend */}
          <div className="text-center mt-3">
            <p
              className={`text-xs flex items-center justify-center gap-2 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <span>←</span>
              <span>Slide to see more skill categories</span>
              <span>→</span>
            </p>
          </div>
        </div>

        {/* Mobile skills display */}
        <div className="lg:hidden">
          {/* Compact category header for mobile */}
          <div
            className={`p-4 rounded-xl mb-6 text-white relative overflow-hidden`}
            style={{
              background: `linear-gradient(135deg, ${currentCategory.gradient
                .replace("from-", "")
                .replace(" via-", ", ")
                .replace(" to-", ", ")})`,
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <currentCategory.icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold truncate">
                  {currentCategory.title}
                </h3>
                <p className="text-sm opacity-90 truncate">
                  {currentCategory.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Skills grid for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCategory.skills.map((skill, index) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={index}
                isVisible={isVisible}
                hoveredSkill={hoveredSkill}
                onHover={setHoveredSkill}
                mobile={true}
              />
            ))}
          </div>
        </div>

        {/* Desktop layout (unchanged) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Category navigation - desktop */}
          <div className="lg:col-span-1 space-y-6">
            <div className="text-left mb-8">
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

            {/* Desktop stats */}
            <SkillsStats
              totalSkills={stats.totalSkills}
              masteredSkills={stats.masteredSkills}
              proficientSkills={stats.proficientSkills}
            />
          </div>

          {/* Skills showcase - desktop */}
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
