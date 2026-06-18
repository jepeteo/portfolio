import React from "react"
import {
  Calendar,
  MapPin,
  Building,
  Award,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { TechExperience } from "../../../hooks/useExperienceData"
import { cn } from "../../../utils/styles"

interface ExperienceDetailsProps {
  experience: TechExperience | null
  isDark: boolean
}

const metaIcon = "h-4 w-4 text-[var(--v2-soft)]"

export const ExperienceDetails: React.FC<ExperienceDetailsProps> = ({
  experience,
}) => {
  if (!experience) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-8">
        <div className="text-center">
          <Briefcase
            className="mx-auto mb-4 h-12 w-12 text-[var(--v2-soft)]"
            aria-hidden="true"
          />
          <p className="text-[var(--v2-muted)]">
            Select a position from the sidebar to view details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] transition-all duration-300",
        experience.isFreelance ? "ring-1 ring-[var(--v2-brand-2)]/30" : ""
      )}
    >
      <div className="flex items-center justify-center gap-2 p-2 md:absolute md:right-4 md:top-4 md:p-0">
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
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--v2-ok)]" />
            <span className="text-xs font-semibold text-[var(--v2-ok)]">
              Current
            </span>
          </div>
        )}
      </div>

      <div className="md:p-6">
        <div className="md:mb-6">
          <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
            {experience.title}
          </h3>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
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
          </div>

          <p className="mb-6 leading-relaxed text-[var(--v2-muted)]">
            {experience.description}
          </p>

          {experience.keyResponsibilities &&
            experience.keyResponsibilities.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 text-base font-semibold text-[var(--v2-text)]">
                  Key responsibilities
                </h4>
                <ul className="space-y-2">
                  {experience.keyResponsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex gap-2">
                      <CheckCircle
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--v2-acid)]"
                        aria-hidden="true"
                      />
                      <span className="text-[var(--v2-muted)]">
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
