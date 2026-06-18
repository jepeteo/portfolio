import React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"

type EmergencyHelpCTAProps = {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

const EmergencyHelpCTA: React.FC<EmergencyHelpCTAProps> = ({
  title = "Need urgent website help?",
  description = "Send your website URL and a short description of the issue. I will review the scope and reply with a clear quote.",
  primaryLabel = "Request emergency help",
  primaryHref = "/?type=wordpress-emergency#contact",
  secondaryLabel,
  secondaryHref,
}) => {
  const { isDark } = useTheme()

  return (
    <section
      className={`rounded-2xl border p-8 md:p-10 text-center ${
        isDark
          ? "bg-slate-800/50 border-slate-700"
          : "bg-slate-50 border-slate-200"
      }`}
      aria-labelledby="emergency-cta-heading"
    >
      <h2
        id="emergency-cta-heading"
        className={`text-2xl md:text-3xl font-bold mb-4 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <p
        className={`max-w-2xl mx-auto mb-8 text-lg ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={primaryHref}
          className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all ${
            isDark
              ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          }`}
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link
            to={secondaryHref}
            className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border transition-colors ${
              isDark
                ? "border-slate-600 text-slate-200 hover:border-blue-500"
                : "border-slate-300 text-slate-700 hover:border-blue-500"
            }`}
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  )
}

export default EmergencyHelpCTA
