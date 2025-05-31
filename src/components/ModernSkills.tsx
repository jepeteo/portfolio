import React, { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import mySkills from "../assets/mySkills.json"
import {
  Code2,
  Database,
  Server,
  Globe,
  Settings,
  Layers,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Coffee,
  Heart,
  Star,
} from "lucide-react"

// Define the skill type based on JSON structure
interface Skill {
  skillName: string
  category: string
  description: string
  level: number
  experienceYears: number
  icon: string
  trend: "up" | "stable" | "down"
  visible: boolean
}

const ModernSkills: React.FC = () => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [activeCategory, setActiveCategory] = useState<string>("languages")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Filter only visible skills and cast to proper type
  const visibleSkills: Skill[] = mySkills.filter(
    (skill) => skill.visible
  ) as Skill[]

  // Helper functions
  const getMasteryLevel = (level: number) => {
    if (level >= 90) return "Mastered"
    if (level >= 80) return "Proficient"
    return "Learning"
  }

  const getMasteryIcon = (level: number) => {
    if (level >= 90) return <Heart className="w-4 h-4 text-red-500" />
    if (level >= 80) return <Star className="w-4 h-4 text-yellow-500" />
    return <Coffee className="w-4 h-4 text-blue-500" />
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-emerald-500" />
      case "down":
        return <TrendingUp className="w-3 h-3 text-orange-500 rotate-180" />
      default:
        return <Target className="w-3 h-3 text-slate-400" />
    }
  }

  const formatExperience = (years: number): string => {
    if (years >= 10) return `${years}+ years of friendship`
    if (years >= 5) return `${years}+ years together`
    if (years >= 1) return `${years}+ year${years > 1 ? "s" : ""} of growth`
    return "Just getting started"
  }

  // Organize skills into categories with personal stories
  const skillCategories = {
    languages: {
      title: "My Programming Languages",
      subtitle: "The languages I speak fluently",
      icon: Code2,
      gradient: "from-violet-500 via-purple-500 to-blue-500",
      description:
        "These are the languages that help me bring ideas to life. Each one has taught me something unique about problem-solving.",
      skills: visibleSkills
        .filter((skill) => skill.category === "Programming Languages")
        .map((skill) => ({
          name: skill.skillName,
          level: skill.level,
          experience: formatExperience(skill.experienceYears),
          experienceYears: skill.experienceYears,
          icon: skill.icon,
          trend: skill.trend,
          description: skill.description,
          mastery: getMasteryLevel(skill.level),
        }))
        .sort((a, b) => b.level - a.level),
    },
    frameworks: {
      title: "Frameworks & Tools",
      subtitle: "My creative toolkit",
      icon: Layers,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      description:
        "These frameworks and libraries have become extensions of my creative process, each one adding new possibilities to what I can build.",
      skills: visibleSkills
        .filter(
          (skill) =>
            skill.category === "Web Frameworks" ||
            skill.category === "Stylesheet Pre-processors & Data Formats"
        )
        .map((skill) => ({
          name: skill.skillName,
          level: skill.level,
          experience: formatExperience(skill.experienceYears),
          experienceYears: skill.experienceYears,
          icon: skill.icon,
          trend: skill.trend,
          description: skill.description,
          mastery: getMasteryLevel(skill.level),
        }))
        .sort((a, b) => b.level - a.level),
    },
    databases: {
      title: "Data & Storage",
      subtitle: "Where information lives",
      icon: Database,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      description:
        "Data tells stories, and these tools help me organize, query, and make sense of those stories in meaningful ways.",
      skills: visibleSkills
        .filter((skill) => skill.category === "Databases")
        .map((skill) => ({
          name: skill.skillName,
          level: skill.level,
          experience: formatExperience(skill.experienceYears),
          experienceYears: skill.experienceYears,
          icon: skill.icon,
          trend: skill.trend,
          description: skill.description,
          mastery: getMasteryLevel(skill.level),
        }))
        .sort((a, b) => b.level - a.level),
    },
    cms: {
      title: "CMS & Platforms",
      subtitle: "Building digital experiences",
      icon: Globe,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      description:
        "These platforms have helped me create countless websites and digital experiences, each one unique and purposeful.",
      skills: visibleSkills
        .filter((skill) => skill.category === "Content Management Systems")
        .map((skill) => ({
          name: skill.skillName,
          level: skill.level,
          experience: formatExperience(skill.experienceYears),
          experienceYears: skill.experienceYears,
          icon: skill.icon,
          trend: skill.trend,
          description: skill.description,
          mastery: getMasteryLevel(skill.level),
        }))
        .sort((a, b) => b.level - a.level),
    },
    devops: {
      title: "DevOps & Infrastructure",
      subtitle: "Behind the scenes magic",
      icon: Server,
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      description:
        "The invisible foundation that keeps everything running smoothly. These tools help me deploy, monitor, and scale applications.",
      skills: visibleSkills
        .filter(
          (skill) =>
            skill.category === "Web Servers & Control Panels" ||
            skill.category === "Containerization & Virtualization" ||
            skill.category === "Server Management" ||
            skill.category === "Operating Systems"
        )
        .map((skill) => ({
          name: skill.skillName,
          level: skill.level,
          experience: formatExperience(skill.experienceYears),
          experienceYears: skill.experienceYears,
          icon: skill.icon,
          trend: skill.trend,
          description: skill.description,
          mastery: getMasteryLevel(skill.level),
        }))
        .sort((a, b) => b.level - a.level),
    },
    tools: {
      title: "Development Environment",
      subtitle: "My daily companions",
      icon: Settings,
      gradient: "from-slate-600 via-slate-500 to-slate-400",
      description:
        "These are the tools I reach for every day. They've become second nature, like extensions of my thoughts into code.",
      skills: visibleSkills
        .filter(
          (skill) =>
            skill.category === "IDEs & Text Editors" ||
            skill.category === "Network Analysis Tools"
        )
        .map((skill) => ({
          name: skill.skillName,
          level: skill.level,
          experience: formatExperience(skill.experienceYears),
          experienceYears: skill.experienceYears,
          icon: skill.icon,
          trend: skill.trend,
          description: skill.description,
          mastery: getMasteryLevel(skill.level),
        }))
        .sort((a, b) => b.level - a.level),
    },
  }

  const CategoryCard = ({
    categoryKey,
    category,
  }: {
    categoryKey: string
    category: any
  }) => {
    const IconComponent = category.icon
    const isActive = activeCategory === categoryKey

    return (
      <button
        onClick={() => setActiveCategory(categoryKey)}
        className={`relative w-full p-6 rounded-2xl text-left transition-all duration-500 hover:scale-[1.02] group overflow-hidden ${
          isActive ? "ring-2 ring-white/20 shadow-2xl" : "hover:shadow-xl"
        }`}
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${category.gradient
                .replace("from-", "")
                .replace(" via-", ", ")
                .replace(" to-", ", ")})`
            : isDark
            ? "rgba(30, 41, 59, 0.5)"
            : "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isActive
                  ? "bg-white/20 backdrop-blur-sm"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-slate-100"
              }`}
            >
              <IconComponent
                className={`w-6 h-6 ${
                  isActive
                    ? "text-white"
                    : isDark
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`font-bold text-lg ${
                  isActive
                    ? "text-white"
                    : isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {category.title}
              </h3>
              <p
                className={`text-sm ${
                  isActive
                    ? "text-white/80"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {category.subtitle}
              </p>
            </div>
          </div>

          <p
            className={`text-sm leading-relaxed ${
              isActive
                ? "text-white/70"
                : isDark
                ? "text-slate-400"
                : "text-slate-600"
            }`}
          >
            {category.skills.length} technologies
          </p>
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>
      </button>
    )
  }

  const SkillCard = ({ skill, index }: { skill: any; index: number }) => {
    const isHovered = hoveredSkill === skill.name

    return (
      <div
        className="group"
        onMouseEnter={() => setHoveredSkill(skill.name)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        <div
          className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer backdrop-blur-sm ${
            isDark
              ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
              : "bg-white/30 border-slate-200/50 hover:bg-white/50 hover:border-slate-300/50 hover:shadow-lg"
          } ${isHovered ? "scale-[1.01] shadow-xl" : ""}`}
          style={{
            animationDelay: `${index * 100}ms`,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header with personal touch */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-3xl block">{skill.icon}</span>
                <div className="absolute -bottom-1 -right-1">
                  {getMasteryIcon(skill.level)}
                </div>
              </div>
              <div>
                <h4
                  className={`font-bold text-xl ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {skill.name}
                </h4>
                {/* <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {skill.experience}
                </p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(skill.trend)}
            </div>
          </div>

          {/* Mastery level with personality */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {skill.mastery}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  skill.level >= 90
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : skill.level >= 80
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {skill.level}%
              </span>
            </div>

            {/* Beautiful progress visualization */}
            <div
              className={`w-full h-3 rounded-full overflow-hidden ${
                isDark ? "bg-slate-700/50" : "bg-slate-200/50"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-1500 ease-out ${
                  skill.level >= 90
                    ? "bg-gradient-to-r from-red-400 via-pink-400 to-red-500"
                    : skill.level >= 80
                    ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500"
                    : "bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500"
                }`}
                style={{
                  width: isVisible ? `${skill.level}%` : "0%",
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>

          {/* Story on hover */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isHovered ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`pt-4 border-t ${
                isDark ? "border-slate-700/50" : "border-slate-200/50"
              }`}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {skill.description}
              </p>
            </div>
          </div>

          {/* Subtle hover hint */}
          <div className="flex justify-between items-center mt-4">
            {/* <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                skill.level >= 90
                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : skill.level >= 80
                  ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              }`}
            >
              {skill.experienceYears} years
            </span> */}
          </div>
        </div>
      </div>
    )
  }

  const currentCategory =
    skillCategories[activeCategory as keyof typeof skillCategories]

  // Calculate stats with personality
  const totalSkills = visibleSkills.length
  const masteredSkills = visibleSkills.filter(
    (skill) => skill.level >= 90
  ).length
  const proficientSkills = visibleSkills.filter(
    (skill) => skill.level >= 80 && skill.level < 90
  ).length

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
              <CategoryCard key={key} categoryKey={key} category={category} />
            ))}

            {/* Personal stats */}
            <div
              className={`p-6 rounded-2xl backdrop-blur-sm border ${
                isDark
                  ? "bg-slate-800/30 border-slate-700/50"
                  : "bg-white/30 border-slate-200/50"
              }`}
            >
              <h4
                className={`font-bold text-lg mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                My Journey So Far
              </h4>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm flex items-center gap-2 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    Technologies learned
                  </span>
                  <span
                    className={`font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {totalSkills}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm flex items-center gap-2 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Mastered with love
                  </span>
                  <span className="font-bold text-red-500">
                    {masteredSkills}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm flex items-center gap-2 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    Proficiently using
                  </span>
                  <span className="font-bold text-yellow-500">
                    {proficientSkills}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills showcase */}
          <div className="lg:col-span-2">
            {/* Category story header */}
            <div
              className={`p-8 rounded-2xl mb-8 text-white relative overflow-hidden`}
              style={{
                background: `linear-gradient(135deg, ${currentCategory.gradient
                  .replace("from-", "")
                  .replace(" via-", ", ")
                  .replace(" to-", ", ")})`,
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <currentCategory.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      {currentCategory.title}
                    </h3>
                    <p className="text-xl opacity-90">
                      {currentCategory.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed opacity-80">
                  {currentCategory.description}
                </p>
              </div>

              {/* Beautiful background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Skills grid with stories */}
            <div className="grid md:grid-cols-2 gap-6">
              {currentCategory.skills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Personal call to action */}
        <div className="mt-16">
          <div
            className={`p-8 rounded-2xl backdrop-blur-sm border text-center relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50"
                : "bg-gradient-to-br from-white/40 to-slate-50/40 border-slate-200/50"
            }`}
          >
            <div className="relative z-10">
              <h3
                className={`text-3xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Let's Create Something Amazing Together
              </h3>
              <p
                className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                These technologies are more than just tools to me—they're the
                way I bring ideas to life. I'd love to use them to help you
                build something incredible.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-violet-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105">
                  <Heart className="w-5 h-5" />
                  View My Projects
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className={`px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  Start a Conversation
                </button>
              </div>
            </div>

            {/* Subtle background elements */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-violet-500" />
              <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

ModernSkills.displayName = "ModernSkills"
export default ModernSkills
