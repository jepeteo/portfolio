import { featuredCaseStudies } from "./caseStudies"
import {
  allNormalizedProjects,
  engineeringTrackLabels,
  engineeringTrackOrder,
  type EngineeringTrack,
} from "./projectTaxonomy"
import {
  futureCertificateCategories,
  normalizeCertificates,
} from "./certificateModel"

export type EngineeringEntry = {
  id: string
  title: string
  summary: string
  track: EngineeringTrack
  href: string
  stack: string[]
  confidential?: boolean
  githubUrl?: string
  liveUrl?: string
}

const mtxStudy = featuredCaseStudies.find((study) => study.id === "mtx-clinic-app")

const mtxEntry: EngineeringEntry | null = mtxStudy
  ? {
      id: mtxStudy.id,
      title: mtxStudy.title,
      summary: mtxStudy.problem,
      track: "applications",
      href: `/projects/${mtxStudy.id}`,
      stack: mtxStudy.stack,
      confidential: true,
    }
  : null

const projectEntries: EngineeringEntry[] = allNormalizedProjects()
  .filter((project) => project.engineering && project.engineeringTrack)
  .map((project) => ({
    id: project.id,
    title: project.title,
    summary: project.description,
    track: project.engineeringTrack as EngineeringTrack,
    href: `/projects/${project.slug}`,
    stack: project.technologies,
    githubUrl: project.githubUrl,
    liveUrl: project.confidential ? undefined : project.url,
  }))

export const engineeringCatalog: EngineeringEntry[] = [
  ...(mtxEntry ? [mtxEntry] : []),
  ...projectEntries.filter((entry) => entry.id !== mtxEntry?.id),
]

export const engineeringGroups = engineeringTrackOrder
  .map((track) => ({
    track,
    title: engineeringTrackLabels[track],
    items: engineeringCatalog.filter((entry) => entry.track === track),
  }))
  .filter((group) => group.items.length > 0)

const FINTECH_LEARNING_IDS = [
  "learning-csharp",
  "csharp-types-control-flow",
  "ethical-hacking-intro",
  "gdpr-compliance",
  "centos-linux",
  "javascript-ai-react-openai",
  "pm-foundations",
] as const

const certificatesById = new Map(
  normalizeCertificates().map((cert) => [cert.id, cert])
)

export const fintechLearning = FINTECH_LEARNING_IDS.map((id) =>
  certificatesById.get(id)
)
  .filter(
    (cert): cert is NonNullable<typeof cert> =>
      Boolean(cert?.credentialUrl) &&
      !cert.id.startsWith("unity-")
  )
  .slice(0, 8)

export const fintechPath = {
  title: "Fintech path",
  body: "I am applying years of production problem-solving to automation, financial technology and more structured engineering environments. I document the work as that experience grows.",
  roadmapHeading: "Current learning roadmap",
  roadmapBody:
    "Focused learning and practical exploration supporting my move into financial systems and regulated engineering environments.",
  futureCategories: futureCertificateCategories,
}
