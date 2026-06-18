import React, { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
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
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--v2-line)]">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-center justify-between gap-4 bg-[var(--v2-panel)] px-6 py-5 text-left transition-colors hover:bg-[var(--v2-panel-2)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--v2-brand)]"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>
            <span className="block text-lg font-bold tracking-tight text-[var(--v2-text)]">
              {category.title}
            </span>
            <span className="mt-1 block font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--v2-soft)]">
              {category.services.length} services
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-[var(--v2-muted)] transition-transform ${
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
          className="bg-[var(--v2-panel-2)]/40 px-6 pb-6 pt-4"
        >
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[var(--v2-muted)]">
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
