import React from "react"
import V2PageHero from "../components/ui/V2PageHero"
import CertificationsArchive from "../components/sections/certificates/CertificationsArchive"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"
import { certificateStats } from "../content/certificateModel"

const CertificationsPage: React.FC = () => {
  useRoutePageMeta("/certifications")
  const total = certificateStats().total

  return (
    <div>
      <V2PageHero
        id="certifications-hero"
        eyebrow="Certifications"
        title="Verified learning, kept in one growing archive."
        subtitle={`Explore ${total} credentials across engineering, delivery, AI, security and emerging financial technology.`}
      />
      <CertificationsArchive />
    </div>
  )
}

export default CertificationsPage
