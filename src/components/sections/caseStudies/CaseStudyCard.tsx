import React, { useState } from "react"
import { ExternalLink, Github } from "lucide-react"
import { TiltCard } from "../../motion"
import usePointerFine from "../../../hooks/usePointerFine"
import useReducedMotion from "../../../hooks/useReducedMotion"
import { BlurImage } from "../../system/loading/LoadingStates"
import type { CaseStudy } from "../../../content/caseStudies"
import { cn } from "../../../utils/styles"

type CaseStudyCardProps = {
  study: CaseStudy
  index: number
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study, index }) => {
  const hasFinePointer = usePointerFine()
  const prefersReducedMotion = useReducedMotion()
  const [imageError, setImageError] = useState(false)
  const imageSrc = study.imageSlug
    ? `./images/projects/${study.imageSlug}.webp`
    : undefined
  const enableImagePan = hasFinePointer && !prefersReducedMotion && !!imageSrc

  return (
    <TiltCard className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] shadow-[var(--v2-shadow)]">
        <div className="flex items-center gap-2 border-b border-[var(--v2-line)] bg-[var(--v2-panel-2)] px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--v2-soft)]/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--v2-soft)]/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--v2-soft)]/60" />
          </span>
          <span className="ml-2 truncate font-mono text-[10px] text-[var(--v2-soft)]">
            {study.url ?? `case-study://${study.id}`}
          </span>
        </div>

        {imageSrc && !imageError ? (
          <div className="relative aspect-video overflow-hidden border-b border-[var(--v2-line)] bg-[var(--v2-panel-2)]">
            <BlurImage
              src={imageSrc}
              alt={`${study.title} screenshot`}
              containerClassName="h-full w-full"
              className={cn(
                "h-full w-full object-cover object-top transition-[object-position] duration-[4s] ease-linear",
                enableImagePan && "group-hover:object-bottom"
              )}
              aspectRatio="auto"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center border-b border-[var(--v2-line)] bg-[var(--v2-panel-2)] font-mono text-sm text-[var(--v2-soft)]">
            Report #{String(index + 1).padStart(2, "0")}
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--v2-acid)]">
              {study.label}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-[var(--v2-text)]">
            {study.title}
          </h3>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--v2-soft)]">
                Problem
              </dt>
              <dd className="mt-1 text-[var(--v2-muted)]">{study.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--v2-soft)]">
                What I did
              </dt>
              <dd className="mt-1 text-[var(--v2-muted)]">{study.approach}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--v2-soft)]">
                Outcome
              </dt>
              <dd className="mt-1 text-[var(--v2-muted)]">{study.outcome}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {study.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-2.5 py-1 text-xs text-[var(--v2-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {study.url ? (
              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--v2-brand)] hover:text-[var(--v2-acid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
              >
                View live site
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {study.githubUrl ? (
              <a
                href={study.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--v2-muted)] hover:text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
              >
                GitHub
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </TiltCard>
  )
}

export default CaseStudyCard
