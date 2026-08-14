import React from "react"
import { Link } from "react-router-dom"
import { ExternalLink, Github } from "lucide-react"
import { TiltCard } from "../../motion"
import type { CaseStudy } from "../../../content/caseStudies"
import CaseStudyMedia from "./CaseStudyMedia"

type CaseStudyCardProps = {
  study: CaseStudy
  index: number
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study, index }) => {
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
            {study.confidential
              ? "internal://confidential"
              : (study.url ?? `case-study://${study.id}`)}
          </span>
        </div>

        <CaseStudyMedia study={study} eager={index === 0} />

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--v2-line)] bg-[var(--v2-panel-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--v2-acid)]">
              {study.label}
            </span>
            {study.confidential ? (
              <span className="rounded-full border border-[var(--v2-line)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--v2-muted)]">
                Confidential
              </span>
            ) : null}
          </div>

          <h3 className="text-xl font-bold tracking-tight text-[var(--v2-text)]">
            <Link
              to={`/projects/${study.id}`}
              className="hover:text-[var(--v2-acid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
            >
              {study.title}
            </Link>
          </h3>

          {study.projectType ? (
            <p className="mt-2 font-mono text-[11px] text-[var(--v2-soft)]">
              {study.projectType}
            </p>
          ) : null}

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
            {study.url && !study.confidential ? (
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
            {study.githubUrl && !study.confidential ? (
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
