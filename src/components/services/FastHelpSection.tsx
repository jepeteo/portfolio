import React from "react"
import { Link } from "react-router-dom"
import SectionShell from "../ui/SectionShell"
import { getFastHelpServices } from "../../content/services"
import ServiceCard from "./ServiceCard"

const FastHelpSection: React.FC = () => {
  const services = getFastHelpServices()

  return (
    <SectionShell
      id="fast-help"
      eyebrow="Practical Support"
      title="Fast Website Help"
      subtitle="Practical support for broken websites, WordPress issues, WooCommerce problems, DNS/email setup, speed, and technical SEO."
      variant="muted"
      decoration="grid"
    >
      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          to="/?type=wordpress-emergency#contact"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-500 dark:hover:to-blue-400"
        >
          Request help
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-white"
        >
          View services
        </Link>
      </div>
    </SectionShell>
  )
}

export default FastHelpSection
