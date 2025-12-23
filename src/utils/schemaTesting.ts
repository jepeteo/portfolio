import type {
  SchemaOrgBase,
  SchemaOrgPerson,
  SchemaOrgCreativeWork,
} from "../types"

type SchemaItem = SchemaOrgBase | SchemaOrgPerson | SchemaOrgCreativeWork

interface ParsedSchema extends SchemaOrgBase {
  "@graph"?: SchemaItem[]
  hasPart?: SchemaOrgCreativeWork[]
  sameAs?: string[]
  knowsAbout?: string[]
  image?: string
}

declare global {
  interface Window {
    testPortfolioSchema: () => void
    validateAllSchemas: () => void
    exportSchemaForTesting: () => string
  }
}

window.testPortfolioSchema = () => {
  console.group("🧪 Portfolio Schema Testing")

  const schemas = document.querySelectorAll(
    'script[type="application/ld+json"]'
  )
  console.log(`Found ${schemas.length} schema scripts`)

  schemas.forEach((script, index) => {
    try {
      const schema = JSON.parse(script.textContent || "")
      console.group(`Schema ${index + 1}`)
      console.log(
        "Type:",
        schema["@type"] || schema["@graph"]?.[0]?.["@type"] || "Unknown"
      )
      console.log("Content:", schema)

      if (!schema["@context"]) {
        console.warn("⚠️ Missing @context")
      }
      if (!schema["@type"] && !schema["@graph"]) {
        console.warn("⚠️ Missing @type or @graph")
      }

      console.groupEnd()
    } catch (error) {
      console.error(`❌ Invalid JSON in schema ${index + 1}:`, error)
    }
  })

  console.groupEnd()
}

window.validateAllSchemas = () => {
  console.group("✅ Schema Validation Report")

  const schemas = document.querySelectorAll(
    'script[type="application/ld+json"]'
  )

  schemas.forEach((script, index) => {
    try {
      const schema = JSON.parse(script.textContent || "") as ParsedSchema

      console.group(`Schema ${index + 1} - ${schema["@type"] || "Graph"}`)

      const issues: string[] = []
      const suggestions: string[] = []

      if (schema["@graph"]) {
        schema["@graph"].forEach((item: SchemaItem, i: number) => {
          console.log(
            `Graph item ${i + 1}:`,
            item["@type"],
            item.name || item["@id"]
          )
        })
      }

      if (
        schema["@type"] === "Person" ||
        schema["@graph"]?.some((item: SchemaItem) => item["@type"] === "Person")
      ) {
        const person = (
          schema["@type"] === "Person"
            ? schema
            : schema["@graph"]?.find(
                (item: SchemaItem) => item["@type"] === "Person"
              )
        ) as ParsedSchema | undefined

        if (!person?.image) suggestions.push("Add image for rich snippets")
        if (!person?.sameAs?.length) suggestions.push("Add social media links")
        if (!person?.knowsAbout?.length)
          suggestions.push("Add skills/knowledge areas")
      }

      if (
        schema["@type"] === "CreativeWork" ||
        schema["@graph"]?.some(
          (item: SchemaItem) => item["@type"] === "CreativeWork"
        )
      ) {
        const portfolio = (
          schema["@type"] === "CreativeWork"
            ? schema
            : schema["@graph"]?.find(
                (item: SchemaItem) => item["@type"] === "CreativeWork"
              )
        ) as ParsedSchema | undefined

        if (!portfolio?.hasPart?.length)
          issues.push("Portfolio missing projects (hasPart)")
        if (
          portfolio?.hasPart?.some(
            (project: SchemaOrgCreativeWork) => !project.url && !project["@id"]
          )
        ) {
          suggestions.push("Some projects missing URLs")
        }
      }

      if (issues.length) {
        console.warn("Issues:", issues)
      }
      if (suggestions.length) {
        console.info("Suggestions:", suggestions)
      }
      if (!issues.length && !suggestions.length) {
        console.log("✅ No issues found")
      }

      console.groupEnd()
    } catch (error) {
      console.error(`❌ Schema ${index + 1} parse error:`, error)
    }
  })

  console.groupEnd()
}

window.exportSchemaForTesting = () => {
  const schemas = document.querySelectorAll(
    'script[type="application/ld+json"]'
  )
  const allSchemas: ParsedSchema[] = []

  schemas.forEach((script) => {
    try {
      const schema = JSON.parse(script.textContent || "") as ParsedSchema
      allSchemas.push(schema)
    } catch (error) {
      console.error("Error parsing schema:", error)
    }
  })

  const exportData = JSON.stringify(allSchemas, null, 2)

  if (navigator.clipboard) {
    navigator.clipboard.writeText(exportData).then(() => {
      console.log("📋 Schema data copied to clipboard!")
      console.log("You can paste this into:")
      console.log(
        "- Google Rich Results Test: https://search.google.com/test/rich-results"
      )
      console.log("- Schema.org Validator: https://validator.schema.org/")
    })
  }

  console.log("📋 Schema Export:")
  console.log(exportData)

  return exportData
}

if (process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(() => {}, 1000)
  })
}

export {}
