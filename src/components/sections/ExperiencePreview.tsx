import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import { freelanceOverlapNote, normalizedJobs } from "../../content/experienceModel"
import { v2SecondaryButton } from "../ui/v2Styles"

const ExperiencePreview: React.FC = () => {
  const preview = normalizedJobs
    .filter((job) => job.featured)
    .sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1
      const aYear = Number(a.from.split("-")[1])
      const bYear = Number(b.from.split("-")[1])
      return bYear - aYear
    })
    .slice(0, 2)

  return (
    <MotionSection
      id="experience-preview"
      aria-labelledby="experience-preview-heading"
      className="relative py-16 md:py-20"
    >
      <div className="container relative mx-auto max-w-6xl px-6">
        <V2SectionHead
          titleId="experience-preview-heading"
          label="Experience"
          title="Recent and current work."
          copy={freelanceOverlapNote}
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {preview.map((job) => (
            <li
              key={job.id}
              className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6"
            >
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-soft)]">
                {job.from} to {job.to ?? "Present"}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--v2-text)]">
                {job.title}
              </h3>
              <p className="mt-1 text-[var(--v2-muted)]">{job.company}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/experience" className={v2SecondaryButton}>
            Full timeline
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/about" className={v2SecondaryButton}>
            About
          </Link>
        </div>
      </div>
    </MotionSection>
  )
}

export default ExperiencePreview
