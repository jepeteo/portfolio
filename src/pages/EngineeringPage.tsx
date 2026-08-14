import React from "react"
import V2PageHero from "../components/ui/V2PageHero"
import EngineeringCatalog from "../components/sections/EngineeringCatalog"
import { useRoutePageMeta } from "../hooks/useRoutePageMeta"

const EngineeringPage: React.FC = () => {
  useRoutePageMeta("/engineering")

  return (
    <div>
      <V2PageHero
        id="engineering-hero"
        eyebrow="Engineering"
        title="Applications, tools, and technical experiments."
        subtitle="A smaller collection of verified technical work: internal applications, React and TypeScript tools, and public experiments."
      />
      <EngineeringCatalog />
    </div>
  )
}

export default EngineeringPage
