import React from "react"
import type { CaseStudy } from "../../../content/caseStudies"
import {
  projectImageSizes,
  projectImageSrc,
  projectImageSrcSet,
} from "../../../content/caseStudies"

type CaseStudyMediaProps = {
  study: CaseStudy
  eager?: boolean
  variant?: "embedded" | "standalone"
}

const CaseStudyMedia: React.FC<CaseStudyMediaProps> = ({
  study,
  eager = false,
  variant = "embedded",
}) => {
  const src = projectImageSrc(study.imageSlug)
  const srcSet = projectImageSrcSet(study.imageSlug)
  const [failed, setFailed] = React.useState(false)
  const frameClass =
    variant === "standalone"
      ? "rounded-3xl border border-[var(--v2-line)]"
      : "border-b border-[var(--v2-line)]"

  if (src && !failed) {
    return (
      <div
        className={`relative aspect-video overflow-hidden bg-[var(--v2-panel-2)] ${frameClass}`}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={projectImageSizes}
          alt={`${study.title} website screenshot`}
          width={1280}
          height={720}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          fetchPriority={eager ? "high" : "auto"}
          className="h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  if (study.confidential) {
    return (
      <p
        className={`m-0 bg-[var(--v2-panel-2)] px-4 py-3 font-mono text-[11px] leading-relaxed text-[var(--v2-soft)] ${frameClass}`}
      >
        {study.status ??
          "Internal application. Screens and live URL are not public."}
      </p>
    )
  }

  return null
}

export default CaseStudyMedia
