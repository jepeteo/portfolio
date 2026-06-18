import React from "react"
import { Calendar, ChevronRight } from "lucide-react"
import { TechExperience } from "../../../hooks/useExperienceData"
import { cn } from "../../../utils/styles"

interface ExperienceSidebarProps {
  experiences: TechExperience[]
  selectedExperienceId: string | null
  onSelectExperience: (id: string) => void
  isDark: boolean
}

export const ExperienceSidebar: React.FC<ExperienceSidebarProps> = ({
  experiences,
  selectedExperienceId,
  onSelectExperience,
}) => {
  return (
    <div className="space-y-1.5">
      {experiences.map((experience) => {
        const isSelected = selectedExperienceId === experience.id
        return (
          <button
            key={experience.id}
            onClick={() => onSelectExperience(experience.id)}
            className={cn(
              "w-full rounded-lg px-3 py-2.5 text-left transition-all duration-300",
              isSelected
                ? "border-l-4 border-[var(--v2-acid)] bg-[var(--v2-acid)]/10"
                : "border-l-4 border-transparent bg-[var(--v2-panel)] hover:border-[var(--v2-line-strong)]"
            )}
            aria-pressed={isSelected}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={cn(
                    "mb-0.5 text-sm font-semibold",
                    isSelected
                      ? "text-[var(--v2-acid)]"
                      : "text-[var(--v2-text)]"
                  )}
                >
                  {experience.company}
                </h3>
                <div className="text-xs font-medium leading-tight text-[var(--v2-muted)]">
                  {experience.title}
                </div>
                <div className="mt-1 flex items-center text-xs text-[var(--v2-soft)]">
                  <Calendar className="mr-1 h-2.5 w-2.5" aria-hidden="true" />
                  {experience.periodInfo.from} - {experience.periodInfo.to}
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-1.5 flex flex-row items-center space-x-1.5">
                  {experience.isFreelance && (
                    <div
                      className="h-1.5 w-1.5 rounded-full bg-[var(--v2-brand-2)]"
                      title="Freelance"
                    />
                  )}
                  {experience.status === "current" && (
                    <div
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--v2-ok)]"
                      title="Current"
                    />
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5",
                    isSelected
                      ? "text-[var(--v2-acid)]"
                      : "text-[var(--v2-soft)]"
                  )}
                  aria-hidden="true"
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
