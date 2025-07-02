import { useMemo } from "react"
import mySkills from "../assets/mySkills.json"
import {
  Code2,
  Database,
  Server,
  Globe,
  Settings,
  Layers,
} from "lucide-react"

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

interface ProcessedSkill {
  name: string
  level: number
  experience: string
  experienceYears: number
  icon: string
  trend: "up" | "stable" | "down"
  description: string
  mastery: string
}

interface SkillCategory {
  title: string
  subtitle: string
  icon: any
  gradient: string
  description: string
  skills: ProcessedSkill[]
}

const useSkillsData = () => {
  const formatExperience = (years: number): string => {
    if (years >= 10) return `${years}+ years of friendship`
    if (years >= 5) return `${years}+ years together`
    if (years >= 1) return `${years}+ year${years > 1 ? "s" : ""} of growth`
    return "Just getting started"
  }

  const getMasteryLevel = (level: number): string => {
    if (level >= 90) return "Mastered"
    if (level >= 80) return "Proficient"
    return "Learning"
  }

  const processedData = useMemo(() => {
    // Filter only visible skills and cast to proper type
    const visibleSkills: Skill[] = (mySkills as any[]).filter(
      (skill: any) => skill.visible
    ) as Skill[]

    // Organize skills into categories
    const skillCategories: Record<string, SkillCategory> = {
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

    // Calculate stats
    const totalSkills = visibleSkills.length
    const masteredSkills = visibleSkills.filter((skill) => skill.level >= 90).length
    const proficientSkills = visibleSkills.filter(
      (skill) => skill.level >= 80 && skill.level < 90
    ).length

    return {
      skillCategories,
      stats: {
        totalSkills,
        masteredSkills,
        proficientSkills,
      },
    }
  }, [])

  return processedData
}

export default useSkillsData
