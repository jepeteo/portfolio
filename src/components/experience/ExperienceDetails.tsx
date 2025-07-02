import React from "react"
import {
  Calendar,
  MapPin,
  Building,
  Award,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { TechExperience } from "../../hooks/useExperienceData"

interface ExperienceDetailsProps {
  experience: TechExperience | null
  isDark: boolean
}

export const ExperienceDetails: React.FC<ExperienceDetailsProps> = ({
  experience,
  isDark,
}) => {
  if (!experience) {
    return (
      <div
        className={`h-full flex items-center justify-center p-8 rounded-2xl ${
          isDark
            ? "bg-slate-800/50 border border-slate-700/50"
            : "bg-white/70 border border-slate-200/50"
        }`}
      >
        <div className="text-center">
          <Briefcase
            className={`w-12 h-12 mx-auto mb-4 ${
              isDark ? "text-slate-600" : "text-slate-400"
            }`}
          />
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Select a position from the sidebar to view details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isDark
          ? "bg-slate-800/50 border border-slate-700/50"
          : "bg-white/70 border border-slate-200/50"
      } backdrop-blur-sm ${
        experience.isFreelance ? "ring-2 ring-purple-500/20" : ""
      }`}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {experience.isFreelance && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Freelance
            </span>
          </div>
        )}
        {experience.status === "current" && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              Current
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          {/* Header */}
          <h3
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {experience.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Building
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {experience.company}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                {experience.periodInfo.from} - {experience.periodInfo.to}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                {experience.location}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Award
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span
                className={`font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {experience.duration.display}
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className={`mb-6 leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {experience.description}
          </p>

          {/* Metrics */}
          {Object.keys(experience.metrics).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(experience.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-xl ${
                    isDark ? "bg-slate-700/50" : "bg-slate-100/50"
                  } text-center`}
                >
                  <div
                    className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {value}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Responsibilities */}
          {experience.keyResponsibilities &&
            experience.keyResponsibilities.length > 0 && (
              <div className="mb-6">
                <h4
                  className={`text-md font-semibold mb-3 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {experience.keyResponsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex gap-2">
                      <CheckCircle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isDark ? "text-green-500" : "text-green-600"
                        }`}
                      />
                      <span
                        className={`${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Achievements */}
          {experience.achievements && experience.achievements.length > 0 && (
            <div className="mb-6">
              <h4
                className={`text-md font-semibold mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Key Achievements
              </h4>
              <ul className="space-y-2">
                {experience.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex gap-2">
                    <CheckCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isDark ? "text-green-500" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {experience.techStack.length > 0 && (
            <div>
              <h4
                className={`text-md font-semibold mb-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      isDark
                        ? "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
