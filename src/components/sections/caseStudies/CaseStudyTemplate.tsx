import React from "react"
import { Link } from "react-router-dom"
import type { CaseStudy } from "../../../content/caseStudies"
import { v2SecondaryButton } from "../../ui/v2Styles"

type CaseStudyTemplateProps = {
  study: CaseStudy
}

const sectionsFor = (study: CaseStudy) => {
  const seen = new Set<string>()
  return [
    { title: "Context", body: study.context },
    { title: "Problem", body: study.problem },
    { title: "Responsibility", body: study.responsibility },
    { title: "Constraints", body: study.constraints },
    { title: "Approach", body: study.approach },
    { title: "Solution", body: study.solution },
    { title: "Technical contribution", body: study.technicalContribution },
    { title: "Outcome", body: study.outcome },
  ].filter((section) => {
    const body = section.body?.trim()
    if (!body || seen.has(body)) return false
    seen.add(body)
    return true
  })
}

const CaseStudyTemplate: React.FC<CaseStudyTemplateProps> = ({ study }) => {
  const sections = sectionsFor(study)

  return (
    <article className="space-y-8">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-acid)]">
            {section.title}
          </h2>
          <p className="mt-2 text-lg text-[var(--v2-muted)]">{section.body}</p>
        </section>
      ))}

      {study.stack.length > 0 ? (
        <section>
          <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-acid)]">
            Stack
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {study.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[var(--v2-line)] px-3 py-1 font-mono text-xs text-[var(--v2-muted)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {study.relatedServiceIds && study.relatedServiceIds.length > 0 ? (
        <section>
          <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--v2-acid)]">
            Related services
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {study.relatedServiceIds.map((id) => (
              <li key={id}>
                <Link
                  to={`/services/${id}`}
                  className="text-sm font-bold text-[var(--v2-brand)] underline-offset-4 hover:underline"
                >
                  {id.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {study.url ? (
        <a
          href={study.url}
          className={v2SecondaryButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit live site
        </a>
      ) : null}
    </article>
  )
}

export default CaseStudyTemplate
