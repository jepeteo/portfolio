import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Clock,
  Wrench,
  Zap,
  Globe,
  type LucideIcon,
} from "lucide-react"
import type { ServiceItem } from "../../content/services"
import { mapServiceIdToRequestType } from "../../content/services"
import SurfaceCard from "../ui/SurfaceCard"
import IconWell from "../ui/IconWell"
import { useMotionConfig } from "../../hooks/useMotionConfig"

type ServiceCardProps = {
  service: ServiceItem
  compact?: boolean
  index?: number
}

const getServiceIcon = (service: ServiceItem): LucideIcon => {
  if (service.emergency) return AlertCircle
  if (service.featured) return Zap
  if (service.id.includes("wordpress") || service.id.includes("woo")) return Wrench
  return Globe
}

const getServiceGradient = (service: ServiceItem): string => {
  if (service.emergency) return "from-amber-500 to-orange-500"
  if (service.featured) return "from-blue-500 to-purple-500"
  return "from-cyan-500 to-blue-500"
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  compact = false,
  index = 0,
}) => {
  const requestType = mapServiceIdToRequestType(service.id)
  const contactHref = `/?type=${requestType}#contact`
  const { stagger } = useMotionConfig()
  const Icon = getServiceIcon(service)
  const gradient = getServiceGradient(service)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: stagger(index) }}
      viewport={{ once: true, margin: "-40px" }}
      className="h-full"
    >
      <SurfaceCard
        as="article"
        interactive
        className={`group flex h-full flex-col p-6 ${
          service.featured && !compact
            ? "ring-1 ring-blue-500/20 dark:ring-blue-400/20"
            : ""
        }`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <IconWell icon={Icon} gradient={gradient} size="sm" />
          <div className="flex flex-wrap gap-2">
            {service.emergency && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                Urgent
              </span>
            )}
            {service.featured && !compact && (
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                Featured
              </span>
            )}
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {service.title}
        </h3>

        <p className="mb-4 flex-grow text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {service.shortDescription}
        </p>

        <div className="mt-auto space-y-3">
          {service.priceLabel && (
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">
              {service.priceLabel}
            </p>
          )}

          {service.deliveryLabel && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {service.deliveryLabel}
            </p>
          )}

          <Link
            to={contactHref}
            className="inline-flex text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400"
          >
            Ask about this →
          </Link>
        </div>
      </SurfaceCard>
    </motion.div>
  )
}

export default ServiceCard
