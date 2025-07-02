import { useMemo } from "react"
import jobExperienceData from "../assets/jobExperience.json"

export interface Experience {
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

export interface TechExperience extends Experience {
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
  periodInfo: {
    from: string
    to: string
    isCurrent: boolean
  }
}

export interface ExperienceStats {
  totalYears: number
  totalProjects: number
  totalClients: number
  currentRoles: number
  topTechnologies: string[]
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

      // Default metrics based on role duration
      if (!metrics.projects) {
        metrics.projects = Math.max(years * 15, 5)
      }
      if (!metrics.clients && years > 1) {
        metrics.clients = Math.max(years * 8, 3)
      }

      return metrics
    }

    const periodInfo = {
      from: formatMonthYear(fromMonth, fromYear),
      to: isCurrent ? "Present" : formatMonthYear(toMonth, toYear),
      isCurrent,
    }

    return {
      ...job,
      id: `exp-${index}`,
      status: isCurrent ? "current" : "completed",
      duration: {
        years,
        months,
        display:
          years > 0
            ? `${years} year${years > 1 ? "s" : ""}${
                months > 0 ? ` ${months} month${months > 1 ? "s" : ""}` : ""
              }`
            : `${months} month${months > 1 ? "s" : ""}`,
      },
      metrics: extractMetrics(job, years),
      techStack: job.technologies || [],
      highlights: job.achievements?.slice(0, 3) || [],
      periodInfo,
    }
  })
}

// Calculate experience statistics
const calculateExperienceStats = (
  experiences: TechExperience[]
): ExperienceStats => {
  const totalYears = experiences.reduce(
    (sum, exp) => sum + exp.duration.years + exp.duration.months / 12,
    0
  )
  const totalProjects = experiences.reduce(
    (sum, exp) => sum + (exp.metrics.projects || 0),
    0
  )
  const totalClients = experiences.reduce(
    (sum, exp) => sum + (exp.metrics.clients || 0),
    0
  )
  const currentRoles = experiences.filter(
    (exp) => exp.status === "current"
  ).length

  // Extract top technologies
  const techCount: Record<string, number> = {}
  experiences.forEach((exp) => {
    exp.techStack.forEach((tech) => {
      techCount[tech] = (techCount[tech] || 0) + 1
    })
  })

  const topTechnologies = Object.entries(techCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tech]) => tech)

  return {
    totalYears: Math.round(totalYears * 10) / 10,
    totalProjects,
    totalClients,
    currentRoles,
    topTechnologies,
  }
}

export const useExperienceData = () => {
  const experiences = useMemo(() => transformToTechExperience(), [])
  const stats = useMemo(
    () => calculateExperienceStats(experiences),
    [experiences]
  )

  const currentExperiences = useMemo(
    () => experiences.filter((exp) => exp.status === "current"),
    [experiences]
  )

  const pastExperiences = useMemo(
    () => experiences.filter((exp) => exp.status === "completed"),
    [experiences]
  )

  return {
    experiences,
    stats,
    currentExperiences,
    pastExperiences,
  }
}
