import React from "react"
import { Calendar, MapPin, Building, Award, ChevronRight } from "lucide-react"
import { TechExperience } from "../../../hooks/useExperienceData"
import SurfaceCard from "../../ui/SurfaceCard"
import { useMotionConfig } from "../../../hooks/useMotionConfig"
import { cn } from "../../../utils/styles"

interface ExperienceCardProps {
  experience: TechExperience
  isDark: boolean
  isExpanded: boolean
  onToggleExpanded: () => void
}

const metaIcon = "h-4 w-4 text-[var(--v2-soft)]"

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  isExpanded,
  onToggleExpanded,
}) => {
  const { pulseClass } = useMotionConfig()

  return (
    <SurfaceCard
      interactive
      className={cn(
        "group relative overflow-hidden",
        experience.isFreelance ? "ring-1 ring-[var(--v2-brand-2)]/30" : ""
      )}
    >
      <div className="absolute right-4 top-4 flex items-center gap-2">
        {experience.isFreelance && (
          <div className="flex items-center gap-2 rounded-full border border-[var(--v2-brand-2)]/30 bg-[var(--v2-brand-2)]/15 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[var(--v2-brand-2)]" />
            <span className="text-xs font-semibold text-[var(--v2-brand-2)]">
              Freelance
            </span>
          </div>
        )}
        {experience.status === "current" && (
          <div className="flex items-center gap-2 rounded-full border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/15 px-3 py-1">
            <span className={cn("h-2 w-2 rounded-full bg-[var(--v2-ok)]", pulseClass)} />
            <span className="text-xs font-semibold text-[var(--v2-ok)]">
              Current
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-bold tracking-tight text-[var(--v2-text)] transition-colors group-hover:text-[var(--v2-acid)]">
              {experience.title}
            </h3>

            <div className="flex items-center gap-2">
              <Building className={metaIcon} />
              <span className="font-semibold text-[var(--v2-muted)]">
                {experience.company}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className={metaIcon} />
              <span className="text-[var(--v2-muted)]">
                {experience.periodInfo.from} - {experience.periodInfo.to}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className={metaIcon} />
              <span className="text-[var(--v2-muted)]">
                {experience.location}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className={metaIcon} />
              <span className="font-medium text-[var(--v2-muted)]">
                {experience.duration.display}
              </span>
            </div>

            <button
              onClick={onToggleExpanded}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-4 py-2 text-sm font-medium text-[var(--v2-text)] transition-colors hover:border-[var(--v2-acid)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
              aria-expanded={isExpanded}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-90" : ""
                )}
              />
              {isExpanded ? "Show less" : "Show more"}
            </button>
          </div>

          <div className="space-y-6 md:col-span-2">
            <p className="leading-relaxed text-[var(--v2-muted)]">
              {experience.description}
            </p>

            {Object.keys(experience.metrics).length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(experience.metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 p-3 text-center"
                  >
                    <div className="text-lg font-bold text-[var(--v2-text)]">
                      {value}
                    </div>
                    <div className="text-xs font-medium text-[var(--v2-soft)]">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {experience.techStack.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-[var(--v2-muted)]">
                  Technologies used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {experience.techStack
                    .slice(0, isExpanded ? undefined : 6)
                    .map((tech, index) => (
                      <span
                        key={index}
                        className="rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel-2)]/60 px-3 py-1 text-sm font-medium text-[var(--v2-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  {!isExpanded && experience.techStack.length > 6 && (
                    <span className="px-3 py-1 text-sm text-[var(--v2-soft)]">
                      +{experience.techStack.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {isExpanded && (
              <div className="space-y-6">
                {experience.keyResponsibilities &&
                  experience.keyResponsibilities.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-[var(--v2-muted)]">
                        Key responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {experience.keyResponsibilities.map(
                          (responsibility, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-sm text-[var(--v2-muted)]"
                            >
                              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--v2-acid)]" />
                              <span>{responsibility}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {experience.highlights.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-[var(--v2-muted)]">
                      Key achievements
                    </h4>
                    <ul className="space-y-2">
                      {experience.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm text-[var(--v2-muted)]"
                        >
                          <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--v2-acid)]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SurfaceCard>
  )
}
