import React, { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import type { ServiceCategory } from "../../content/services"
import ServiceCard from "./ServiceCard"

type ServiceCategorySectionProps = {
  category: ServiceCategory
  defaultOpen?: boolean
}

const ServiceCategorySection: React.FC<ServiceCategorySectionProps> = ({
  category,
  defaultOpen = false,
}) => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? "border-slate-700" : "border-slate-200"
      }`}
    >
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors ${
            isDark
              ? "bg-slate-800 hover:bg-slate-800/80 text-white"
              : "bg-slate-50 hover:bg-slate-100 text-slate-900"
          }`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>
            <span className="block text-lg font-semibold">{category.title}</span>
            <span
              className={`block mt-1 text-sm font-normal ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {category.services.length} services
            </span>
          </span>
          <ChevronDown
            className={`w-5 h-5 flex-shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`px-6 pb-6 pt-2 ${
            isDark ? "bg-slate-900" : "bg-white"
          }`}
        >
          <p
            className={`mb-6 text-sm leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {category.intro}
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {category.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceCategorySection
