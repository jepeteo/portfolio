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
        title="Public credentials, kept in full."
        subtitle={`${total} certificates across the stored categories. Search, filter, and paginate the archive — nothing is dropped to make the homepage shorter.`}
      />
      <CertificationsArchive />
    </div>
  )
}

export default CertificationsPage
