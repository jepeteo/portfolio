import React from "react"
import {
  Calendar,
  ExternalLink,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { ModernCertificate } from "../../hooks/useCertificatesData"

interface CertificateCardProps {
  certificate: ModernCertificate
  isDark: boolean
  isExpanded: boolean
  onToggleExpanded: () => void
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  isDark,
  isExpanded,
  onToggleExpanded,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200"
      case "Intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Advanced":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Expert":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isDark
          ? "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50"
          : "bg-white/70 border border-slate-200/50 hover:border-slate-300/50"
      } backdrop-blur-sm hover:shadow-xl`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className={`text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {certificate.title}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <Award
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {certificate.issuer}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-3">
              <Calendar
                className={`w-4 h-4 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              />
              <span
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {formatDate(certificate.date)}
              </span>
            </div>
          </div>

          {/* Level Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(
              certificate.level || "Intermediate"
            )}`}
          >
            {certificate.level || "Intermediate"}
          </div>
        </div>

        {/* Verified Badge */}
        {certificate.verified && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Verified
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {certificate.description && (
          <p
            className={`mb-4 leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {certificate.description}
          </p>
        )}

        {/* Skills - Always visible (truncated if not expanded) */}
        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mb-4">
            <h4
              className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <Users className="w-4 h-4" />
              Skills Covered
            </h4>
            <div className="flex flex-wrap gap-2">
              {certificate.skills
                .slice(0, isExpanded ? undefined : 6)
                .map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      isDark
                        ? "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              {!isExpanded && certificate.skills.length > 6 && (
                <span
                  className={`px-3 py-1 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  +{certificate.skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Credential ID */}
            {certificate.credentialId && (
              <div>
                <h4
                  className={`text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Credential ID
                </h4>
                <p
                  className={`text-sm font-mono ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {certificate.credentialId}
                </p>
              </div>
            )}

            {/* Duration */}
            {certificate.duration && (
              <div>
                <h4
                  className={`text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Duration
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {certificate.duration}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          {/* Expand/Collapse button */}
          <button
            onClick={onToggleExpanded}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
              isDark
                ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show More
              </>
            )}
          </button>

          {/* View Certificate button */}
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                isDark
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              View Certificate
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
