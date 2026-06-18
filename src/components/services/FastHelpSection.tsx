import React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import SectionShell from "../ui/SectionShell"
import { getFastHelpServices } from "../../content/services"
import { mapServiceIdToRequestType } from "../../content/services"

const FastHelpSection: React.FC = () => {
  const { isDark } = useTheme()
  const services = getFastHelpServices()

  return (
    <SectionShell
      id="fast-help"
      eyebrow="Practical Support"
      title="Fast Website Help"
      subtitle="Practical support for broken websites, WordPress issues, WooCommerce problems, DNS/email setup, speed, and technical SEO."
      variant="muted"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-10">
        {services.map((service) => {
          const requestType = mapServiceIdToRequestType(service.id)
          return (
            <article
              key={service.id}
              className={`flex flex-col rounded-2xl border p-6 transition-colors ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-blue-500/50"
                  : "bg-white border-slate-200 hover:border-blue-500/50"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`mb-4 flex-grow text-sm leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {service.shortDescription}
              </p>
              {service.priceLabel && (
                <p
                  className={`text-sm font-semibold mb-3 ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {service.priceLabel}
                </p>
              )}
              <Link
                to={`/?type=${requestType}#contact`}
                className={`text-sm font-semibold ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Request help →
              </Link>
            </article>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/?type=wordpress-emergency#contact"
          className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all ${
            isDark
              ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          }`}
        >
          Request help
        </Link>
        <Link
          to="/services"
          className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border transition-colors ${
            isDark
              ? "border-slate-600 text-slate-200 hover:border-blue-500 hover:text-white"
              : "border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-700"
          }`}
        >
          View services
        </Link>
      </div>
    </SectionShell>
  )
}

export default FastHelpSection
