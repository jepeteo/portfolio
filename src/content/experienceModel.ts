import jobExperienceData from "../assets/jobExperience.json"
import type {
  ConfidentialityLevel,
  EmploymentType,
  Job,
  WorkMode,
} from "../types"

export type NormalizedJob = Job & {
  id: string
  employmentType: EmploymentType
  workMode: WorkMode
  confidentiality: ConfidentialityLevel
  current: boolean
  overlapsFreelance: boolean
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const parseMonthYear = (value: string) => {
  const [month, year] = value.split("-").map((part) => Number(part))
  return { month, year, date: new Date(year, month - 1) }
}

const inferWorkMode = (location: string | undefined): WorkMode => {
  const text = location?.toLowerCase() ?? ""
  if (text.includes("remote")) return "remote"
  if (text.includes("hybrid")) return "hybrid"
  return "on-site"
}

const inferEmploymentType = (job: Job): EmploymentType =>
  job.employmentType ??
  (job.company === "Freelancer" ? "freelance" : "full-time")

/**
 * Defensible enrichments only, derived from existing job text, not invented roles.
 * Future bank/fintech jobs can set these fields directly on the JSON object.
 */
const jobEnrichments: Record<
  string,
  Partial<NormalizedJob>
> = {
  "freelancer-01-2011": {
    featured: true,
    industry: "Web development",
    sector: "Professional services",
  },
  "global-touch-08-2023": {
    featured: true,
    industry: "Digital agency",
    sector: "E-commerce",
    financialDomains: ["payments"],
  },
  "greekonline-10-2015": {
    featured: true,
    industry: "Web hosting and development",
    sector: "Professional services",
  },
  "redtech-03-2019": {
    industry: "E-commerce",
    sector: "B2B retail",
  },
}

export const jobIdFor = (job: Pick<Job, "id" | "company" | "from">) =>
  job.id || `${slugify(job.company)}-${job.from}`

export const periodsOverlap = (
  a: Pick<Job, "from" | "to">,
  b: Pick<Job, "from" | "to">
) => {
  const aStart = parseMonthYear(a.from).date
  const aEnd =
    !a.to || a.to === "Present" ? new Date() : parseMonthYear(a.to).date
  const bStart = parseMonthYear(b.from).date
  const bEnd =
    !b.to || b.to === "Present" ? new Date() : parseMonthYear(b.to).date

  return aStart <= bEnd && bStart <= aEnd
}

export const freelanceOverlapNote =
  "Freelance practice has run alongside employment since 2011."

export const normalizeJob = (job: Job): NormalizedJob => {
  const id = jobIdFor(job)
  const enrichment = jobEnrichments[id] ?? {}
  const current = job.to === "Present" || job.to === null

  return {
    ...job,
    ...enrichment,
    id,
    current,
    employmentType: inferEmploymentType({ ...job, ...enrichment }),
    workMode: job.workMode ?? enrichment.workMode ?? inferWorkMode(job.location),
    confidentiality: job.confidentiality ?? enrichment.confidentiality ?? "public",
    financialDomains: job.financialDomains ?? enrichment.financialDomains ?? [],
    complianceDomains: job.complianceDomains ?? enrichment.complianceDomains ?? [],
    relatedProjectIds: job.relatedProjectIds ?? enrichment.relatedProjectIds ?? [],
    relatedCertificateIds:
      job.relatedCertificateIds ?? enrichment.relatedCertificateIds ?? [],
    featured: job.featured ?? enrichment.featured ?? false,
    overlapsFreelance: false,
  }
}

export const normalizeJobs = (jobs: Job[] = jobExperienceData as Job[]) => {
  const normalized = jobs.map(normalizeJob)
  const freelance = normalized.find((job) => job.employmentType === "freelance")

  return normalized.map((job) => ({
    ...job,
    overlapsFreelance: Boolean(
      freelance &&
        job.id !== freelance.id &&
        periodsOverlap(job, freelance)
    ),
  }))
}

export const normalizedJobs = normalizeJobs()
