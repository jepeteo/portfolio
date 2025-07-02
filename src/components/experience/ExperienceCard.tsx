import React from 'react'
import { Calendar, MapPin, Building, Award, ChevronRight } from 'lucide-react'
import { TechExperience } from '../../hooks/useExperienceData'

interface ExperienceCardProps {
  experience: TechExperience
  isDark: boolean
  isExpanded: boolean
  onToggleExpanded: () => void
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  isDark,
  isExpanded,
  onToggleExpanded,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isDark
          ? 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50'
          : 'bg-white/70 border border-slate-200/50 hover:border-slate-300/50'
      } backdrop-blur-sm hover:shadow-xl`}
    >
      {/* Status indicator */}
      {experience.status === 'current' && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              Current
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-2 group-hover:text-green-500 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {experience.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <Building className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {experience.company}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {experience.periodInfo.from} - {experience.periodInfo.to}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {experience.location}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Award className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {experience.duration.display}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {experience.description}
        </p>

        {/* Metrics */}
        {Object.keys(experience.metrics).length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(experience.metrics).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-xl ${
                  isDark ? 'bg-slate-700/50' : 'bg-slate-100/50'
                } text-center`}
              >
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {value}
                </div>
                <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {experience.techStack.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {experience.techStack.slice(0, isExpanded ? undefined : 6).map((tech, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    isDark
                      ? 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {tech}
                </span>
              ))}
              {!isExpanded && experience.techStack.length > 6 && (
                <span className={`px-3 py-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  +{experience.techStack.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Key Responsibilities */}
            {experience.keyResponsibilities && experience.keyResponsibilities.length > 0 && (
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {experience.keyResponsibilities.map((responsibility, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                      <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights/Achievements */}
            {experience.highlights.length > 0 && (
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {experience.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                      <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggleExpanded}
          className={`flex items-center gap-2 mt-6 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
            isDark
              ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ChevronRight 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
          />
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  )
}
