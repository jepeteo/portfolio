import React from "react"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"

type ArchiveSectionPageProps = {
  path: string
  heading: string
  children: React.ReactNode
}

const ArchiveSectionPage: React.FC<ArchiveSectionPageProps> = ({
  path,
  heading,
  children,
}) => {
  useRoutePageMeta(path)

  return (
    <div>
      <h1 className="sr-only">{heading}</h1>
      {children}
    </div>
  )
}

export default ArchiveSectionPage
