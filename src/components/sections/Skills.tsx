import React, { useState, useCallback } from "react"
import { useTheme } from "../../context/ThemeContext"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import useSkillsData from "../../hooks/useSkillsData"
import usePerformanceMonitor from "../../hooks/usePerformanceMonitor"
import SectionShell from "../ui/SectionShell"
import CategoryCard from "./skills/CategoryCard"
import CategoryHeader from "./skills/CategoryHeader"
import SkillCard from "./skills/SkillCard"
import SkillsStats from "./skills/SkillsStats"
import SkillsCallToAction from "./skills/SkillsCallToAction"

// Local type definitions for schema
type SkillData = {
  name: string
  level: number
  experience: string
  experienceYears: number
  icon: string
  trend: "up" | "stable" | "down"
  description: string
  mastery: string
}

type SkillCategoryData = {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  description: string
  skills: SkillData[]
}

// Schema.org structured data for skills
const generateSkillsSchema = (skillCategories: SkillCategoryData[]) => {
  const allSkills = skillCategories.flatMap((category: SkillCategoryData) =>
    category.skills.map((skill: SkillData) => ({
      ...skill,
      category: category.title,
    }))
  )

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://theodorosmentis.com/#skills",
    name: "Technical Skills & Expertise",
    description:
      "Professional technical skills and technologies mastered by Theodoros Mentis",
    numberOfItems: allSkills.length,
    itemListElement: allSkills.map(
      (skill: SkillData & { category: string }, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DefinedTerm",
          "@id": `https://theodorosmentis.com/#skill-${skill.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          name: skill.name,
          description: skill.description,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: skill.category,
            description: `${skill.category} technologies and skills`,
          },
          about: {
            "@type": "Person",
            "@id": "https://theodorosmentis.com/#person",
            name: "Theodoros Mentis",
            knowsAbout: skill.name,
          },
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Proficiency Level",
              value: `${skill.level}%`,
            },
            {
              "@type": "PropertyValue",
              name: "Experience Years",
              value: skill.experienceYears,
            },
            {
              "@type": "PropertyValue",
              name: "Mastery Level",
              value: skill.mastery,
            },
            {
              "@type": "PropertyValue",
              name: "Skill Trend",
              value: skill.trend,
            },
          ],
        },
      })
    ),
  }
}

const Skills: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const { getPerformanceReport } = usePerformanceMonitor("Skills")

  const [activeCategory, setActiveCategory] = useState<string>("languages")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const { skillCategories, stats } = useSkillsData()

  const renderCount = React.useRef(0)
  React.useEffect(() => {
    renderCount.current += 1
    if (
      process.env.NODE_ENV === "development" &&
      renderCount.current % 10 === 0 &&
      renderCount.current > 0
    ) {
      getPerformanceReport()
    }
  })

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
    <>
      {/* SEO Schema for Skills */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateSkillsSchema(Object.values(skillCategories)),
            null,
            2
          ),
        }}
      />

      <SectionShell
        id="skills"
        variant="muted"
        eyebrow="My Technical Journey"
        title="Technologies I Love"
        subtitle="Every technology I've learned has shaped how I think and create. Here's my personal journey through the tools and languages that have become part of my story as a developer."
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div ref={targetRef} className="sr-only" aria-hidden="true" />

          <div className="lg:hidden mb-8">
            <SkillsStats
              totalSkills={stats.totalSkills}
              masteredSkills={stats.masteredSkills}
              proficientSkills={stats.proficientSkills}
              compact={true}
            />
          </div>

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

          <div className="lg:hidden">
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

          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
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

              <SkillsStats
                totalSkills={stats.totalSkills}
                masteredSkills={stats.masteredSkills}
                proficientSkills={stats.proficientSkills}
              />
            </div>

            <div className="lg:col-span-2">
              <CategoryHeader category={currentCategory} />

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

          <SkillsCallToAction
            onScrollToProjects={scrollToProjects}
            onScrollToContact={scrollToContact}
          />
      </SectionShell>
    </>
  )
}

Skills.displayName = "Skills"
export default Skills
