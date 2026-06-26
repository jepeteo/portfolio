import React from "react"
import { usePortfolioSchema } from "../../hooks/usePortfolioSchema"
import { seoManager } from "../../utils/enhancedSEO"
import { SchemaValidator } from "../../utils/schemaValidator"

/** Runtime portfolio JSON-LD — CreativeWork + ItemList only; global entities live in siteGraph. */
export const PortfolioSchema: React.FC = () => {
  const { portfolioProjects, reactProjects } = usePortfolioSchema()

  const portfolioSchema = seoManager.generatePortfolioSchema(portfolioProjects)
  const reactProjectsSchema =
    seoManager.generateReactProjectSchema(reactProjects)

  const stripContext = (node: Record<string, unknown>) => {
    const { ["@context"]: _ctx, ...rest } = node
    return rest
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      stripContext(portfolioSchema),
      stripContext(reactProjectsSchema),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          SchemaValidator.optimizeSchema(combinedSchema),
          null,
          2
        ),
      }}
    />
  )
}

export default PortfolioSchema
