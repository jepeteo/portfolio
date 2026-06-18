import React from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Clock } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import type { ServiceItem } from "../../content/services"
import { mapServiceIdToRequestType } from "../../content/services"

type ServiceCardProps = {
  service: ServiceItem
  compact?: boolean
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, compact = false }) => {
  const { isDark } = useTheme()
  const requestType = mapServiceIdToRequestType(service.id)
  const contactHref = `/?type=${requestType}#contact`

  return (
    <article
      className={`flex flex-col rounded-2xl border p-6 transition-colors h-full ${
        isDark
          ? "bg-slate-800/50 border-slate-700 hover:border-blue-500/50"
          : "bg-white border-slate-200 hover:border-blue-500/50"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {service.emergency && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isDark
                ? "bg-amber-500/20 text-amber-300"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            Urgent
          </span>
        )}
        {service.featured && !compact && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isDark
                ? "bg-blue-500/20 text-blue-300"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Featured
          </span>
        )}
      </div>

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

      <div className="mt-auto space-y-3">
        {service.priceLabel && (
          <p
            className={`text-sm font-semibold ${
              isDark ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {service.priceLabel}
          </p>
        )}

        {service.deliveryLabel && (
          <p
            className={`flex items-center gap-1.5 text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {service.deliveryLabel}
          </p>
        )}

        <Link
          to={contactHref}
          className={`inline-flex text-sm font-semibold transition-colors ${
            isDark
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          Ask about this →
        </Link>
      </div>
    </article>
  )
}

export default ServiceCard
