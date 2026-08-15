import React from "react"
import { Link } from "react-router-dom"
import V2PageHero from "../components/ui/V2PageHero"
import { useEnhancedSEO } from "../utils/enhancedSEO"
import { site } from "../config/site"
import { v2PrimaryButton, v2SecondaryButton } from "../components/ui/v2Styles"

const NotFoundPage: React.FC = () => {
  useEnhancedSEO({
    title: `Page not found | ${site.name}`,
    description: "The page you requested is not in this portfolio.",
    canonical: `${site.url}/404`,
    robots: "noindex,follow",
  })

  return (
    <V2PageHero
      id="not-found"
      eyebrow="404"
      title="This page is not here."
      subtitle="The URL may be outdated. Home, services, and contact are still one click away."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/" className={v2PrimaryButton}>
          Home
        </Link>
        <Link to="/services" className={v2SecondaryButton}>
          Services
        </Link>
        <Link to="/contact" className={v2SecondaryButton}>
          Contact
        </Link>
      </div>
    </V2PageHero>
  )
}

export default NotFoundPage
