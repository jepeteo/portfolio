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
  isFreelance: boolean
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
  freelanceYears: number
  employmentYears: number
  totalProjects: number
  totalClients: number
  currentRoles: number
  topTechnologies: string[]
}

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
      const metrics: Record<string, string | number> = {}
      job.achievements?.forEach((achievement) => {
        if (achievement.includes("100+")) metrics.projects = 100
        if (achievement.includes("50+")) metrics.clients = 50
        if (achievement.includes("99%")) metrics.uptime = "99.9%"
        if (achievement.includes("65%")) metrics.impact = "+65% performance"
      })

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
      isFreelance: job.company === "Freelancer",
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

const calculateExperienceStats = (
  experiences: TechExperience[]
): ExperienceStats => {

  const freelanceExperiences = experiences.filter((exp) => exp.isFreelance)
  const employmentExperiences = experiences.filter((exp) => !exp.isFreelance)


  const calculateEmploymentYears = () => {

    let earliestEmploymentStart: Date | null = null
    let latestEmploymentEnd: Date | null = null

    employmentExperiences.forEach((exp) => {
      const [fromMonth, fromYear] = exp.from.split("-").map((n) => parseInt(n))
      const startDate = new Date(fromYear, fromMonth - 1)

      let endDate: Date
      if (exp.to === "Present") {
        endDate = new Date()
      } else {
        const [toMonth, toYear] = exp.to.split("-").map((n) => parseInt(n))
        endDate = new Date(toYear, toMonth - 1)
      }

      if (!earliestEmploymentStart || startDate < earliestEmploymentStart) {
        earliestEmploymentStart = startDate
      }
      if (!latestEmploymentEnd || endDate > latestEmploymentEnd) {
        latestEmploymentEnd = endDate
      }
    })

    let employmentYears = 0
    if (earliestEmploymentStart && latestEmploymentEnd) {
      const diffTime = Math.abs(
        (latestEmploymentEnd as Date).getTime() -
          (earliestEmploymentStart as Date).getTime()
      )
      employmentYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
    }

    return Math.ceil(employmentYears) // Round up to nearest whole year
  }

  const calculateFreelanceYears = () => {
    if (freelanceExperiences.length === 0) return 0

    const [fromMonth, fromYear] = freelanceExperiences[0].from
      .split("-")
      .map((n) => parseInt(n))
    const startDate = new Date(fromYear, fromMonth - 1)

    const lastExp = freelanceExperiences[0] // We only have one freelance experience in this case
    let endDate: Date
    if (lastExp.to === "Present") {
      endDate = new Date()
    } else {
      const [toMonth, toYear] = lastExp.to.split("-").map((n) => parseInt(n))
      endDate = new Date(toYear, toMonth - 1)
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const freelanceYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)

    return Math.ceil(freelanceYears) // Round up to nearest whole year
  }

  const employmentYears = calculateEmploymentYears()
  const freelanceYears = calculateFreelanceYears()


  const totalYears = Math.max(employmentYears, freelanceYears)

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
    totalYears: Math.ceil(totalYears), // Rounded up to nearest year
    freelanceYears,
    employmentYears,
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

  const freelanceExperiences = useMemo(
    () => experiences.filter((exp) => exp.isFreelance),
    [experiences]
  )

  const employmentExperiences = useMemo(
    () => experiences.filter((exp) => !exp.isFreelance),
    [experiences]
  )

  return {
    experiences,
    stats,
    currentExperiences,
    pastExperiences,
    freelanceExperiences,
    employmentExperiences,
  }
}
