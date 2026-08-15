import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import V2SectionHead from "../ui/V2SectionHead"
import { MotionSection } from "../motion"
import { v2SecondaryButton } from "../ui/v2Styles"

const paths = [
  {
    id: "rescue",
    href: "/services#rescue",
    title: "Rescue",
    copy: "WordPress emergencies, WooCommerce checkout, broken forms, plugin conflicts, DNS, SSL and email.",
  },
  {
    id: "improve",
    href: "/services#improve",
    title: "Improve",
    copy: "Performance, technical SEO, accessibility, security, conversion, and infrastructure cleanup.",
  },
  {
    id: "build",
    href: "/services#build",
    title: "Build and maintain",
    copy: "Landing pages, business sites, e-commerce, integrations, maintenance plans, and agency support.",
  },
]

const ServicePaths: React.FC = () => (
  <MotionSection
    id="service-paths"
    aria-labelledby="service-paths-heading"
    className="v2-grid-bg relative py-16 md:py-20"
  >
    <div className="container relative z-10 mx-auto max-w-6xl px-6">
      <V2SectionHead
        titleId="service-paths-heading"
        label="Services"
        title="Three ways in."
        copy="Pick the closest path. The full catalogue and emergency route stay on the services page."
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {paths.map((path) => (
          <li key={path.id}>
            <Link
              to={path.href}
              className="flex h-full flex-col rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-6 transition-colors hover:border-[var(--v2-acid)]/40"
            >
              <h3 className="m-0 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
                {path.title}
              </h3>
              <p className="mt-3 flex-1 text-[var(--v2-muted)]">{path.copy}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-[var(--v2-acid)]">
                View {path.title.toLowerCase()}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link to="/services/emergency-website-help" className={v2SecondaryButton}>
          Emergency website help
        </Link>
      </div>
    </div>
  </MotionSection>
)

export default ServicePaths
