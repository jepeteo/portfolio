import React from "react"
import { Calendar, ChevronRight } from "lucide-react"
import { TechExperience } from "../../hooks/useExperienceData"

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
  isDark,
}) => {
  return (
    <div className="space-y-1.5">
      {experiences.map((experience) => (
        <button
          key={experience.id}
          onClick={() => onSelectExperience(experience.id)}
          className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${
            selectedExperienceId === experience.id
              ? isDark
                ? "bg-green-900/20 border-l-4 border-green-500"
                : "bg-green-50 border-l-4 border-green-500"
              : isDark
              ? "bg-slate-800/50 hover:bg-slate-700/50"
              : "bg-white/70 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3
                className={`font-medium text-sm mb-0.5 ${
                  isDark ? "text-white" : "text-slate-900"
                } ${
                  selectedExperienceId === experience.id ? "text-green-500" : ""
                }`}
              >
                {experience.company}
              </h3>
              <div
                className={`text-xs font-medium leading-tight ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {experience.title}
              </div>
              <div
                className={`text-xs mt-1 flex items-center ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <Calendar className="w-2.5 h-2.5 mr-1" />
                {experience.periodInfo.from} - {experience.periodInfo.to}
              </div>
            </div>

            <div className="flex items-center">
              {/* Status indicators */}
              <div className="flex flex-row items-center space-x-1.5 mr-1.5">
                {experience.isFreelance && (
                  <div
                    className="h-1.5 w-1.5 rounded-full bg-purple-500"
                    title="Freelance"
                  />
                )}
                {experience.status === "current" && (
                  <div
                    className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"
                    title="Current"
                  />
                )}
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                } ${
                  selectedExperienceId === experience.id ? "text-green-500" : ""
                }`}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
