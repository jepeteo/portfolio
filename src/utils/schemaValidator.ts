import type {
  SchemaOrgType,
  SchemaOrgPerson,
  SchemaOrgCreativeWork,
  SchemaOrgWebSite,
  SchemaOrgItemList,
  SchemaOrgOrganization,
  SchemaOrgGraph,
  UnknownObject,
} from "../types"

export interface SchemaValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

type SchemaInput = SchemaOrgType | UnknownObject

export class SchemaValidator {
  static validateSchemaInConsole() {
    // Validation disabled - schema validation happens at build time
    return
  }

  static validatePersonSchema(schema: SchemaInput): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    if (!schema.name) errors.push("Person schema missing required 'name' field")
    if (!schema["@type"] || schema["@type"] !== "Person") {
      errors.push("Schema must have @type: 'Person'")
    }

    if (!schema.jobTitle)
      warnings.push("Consider adding 'jobTitle' for better SEO")
    if (!schema.image)
      warnings.push("Consider adding 'image' for rich snippets")
    if (!schema.url) warnings.push("Consider adding 'url' field")

    if (
      !schema.sameAs ||
      !Array.isArray(schema.sameAs) ||
      schema.sameAs.length === 0
    ) {
      suggestions.push(
        "Add 'sameAs' array with social media profiles for better entity linking"
      )
    }

    if (!schema.knowsAbout || !Array.isArray(schema.knowsAbout)) {
      suggestions.push("Add 'knowsAbout' array to specify skills and expertise")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  static validatePortfolioSchema(schema: SchemaInput): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    const schemaObj = schema as UnknownObject
    if (!schemaObj["@context"]) errors.push("Missing @context")
    if (!schemaObj["@type"]) errors.push("Missing @type")
    if (!schemaObj.name) errors.push("Missing name field")

    const hasPart = schemaObj.hasPart as SchemaOrgCreativeWork[] | undefined
    if (!hasPart || !Array.isArray(hasPart)) {
      errors.push("Portfolio schema should have 'hasPart' array with projects")
    } else {
      hasPart.forEach((project: SchemaOrgCreativeWork, index: number) => {
        if (!project.name) {
          errors.push(`Project ${index} missing name`)
        }
        if (!project.description) {
          warnings.push(`Project ${index} missing description`)
        }
        if (!project.url && !project["@id"]) {
          warnings.push(`Project ${index} missing URL or ID`)
        }
      })
    }

    if (!schema.creator) {
      suggestions.push("Add creator field to link portfolio to person")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  static validateWebsiteSchema(schema: SchemaInput): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    const schemaObj = schema as SchemaOrgWebSite
    if (!schemaObj.url) errors.push("Website schema missing URL")
    if (!schemaObj.name) errors.push("Website schema missing name")

    if (!schemaObj.potentialAction) {
      suggestions.push("Add potentialAction for search functionality")
    }

    if (!schemaObj.mainEntity) {
      suggestions.push("Add mainEntity to link to primary content")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  static validateItemListSchema(schema: SchemaInput): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    const schemaObj = schema as SchemaOrgItemList
    if (
      !schemaObj.itemListElement ||
      !Array.isArray(schemaObj.itemListElement)
    ) {
      errors.push("ItemList schema missing 'itemListElement' array")
    }

    if (!schemaObj.name) warnings.push("Consider adding 'name' for better SEO")
    if (!schemaObj.description) warnings.push("Consider adding 'description'")

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  static validateOrganizationSchema(
    schema: SchemaInput
  ): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    const schemaObj = schema as SchemaOrgOrganization
    if (!schemaObj.name) errors.push("Organization schema missing 'name'")

    if (!schemaObj.url) warnings.push("Consider adding 'url' field")
    if (!schemaObj.description) warnings.push("Consider adding 'description'")

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  static generateSchemaReport(schema: SchemaInput): string {
    let report = "Schema Validation Report\n"
    report += "========================\n\n"

    const schemaType = schema["@type"]
    let result: SchemaValidationResult

    switch (schemaType) {
      case "Person":
        result = this.validatePersonSchema(schema)
        break
      case "CreativeWork":
        result = this.validatePortfolioSchema(schema)
        break
      case "WebSite":
        result = this.validateWebsiteSchema(schema)
        break
      case "ItemList":
        result = this.validateItemListSchema(schema)
        break
      case "Organization":
        result = this.validateOrganizationSchema(schema)
        break
      case "BreadcrumbList":
      case "FAQPage":
      case "Question":
      case "Answer":
        result = {
          isValid: true,
          errors: [],
          warnings: [],
          suggestions: [],
        }
        break
      default:
        result = {
          isValid: true,
          errors: [],
          warnings: [
            `Unknown schema type: ${schemaType} - This may be a valid schema type not yet implemented in validator`,
          ],
          suggestions: [],
        }
    }

    report += `Schema Type: ${schemaType}\n`
    report += `Valid: ${result.isValid ? "✅ Yes" : "❌ No"}\n\n`

    if (result.errors.length > 0) {
      report += "ERRORS:\n"
      result.errors.forEach((error) => (report += `❌ ${error}\n`))
      report += "\n"
    }

    if (result.warnings.length > 0) {
      report += "WARNINGS:\n"
      result.warnings.forEach((warning) => (report += `⚠️ ${warning}\n`))
      report += "\n"
    }

    if (result.suggestions.length > 0) {
      report += "SUGGESTIONS:\n"
      result.suggestions.forEach(
        (suggestion) => (report += `💡 ${suggestion}\n`)
      )
      report += "\n"
    }

    return report
  }

  static optimizeSchema<T extends SchemaInput>(schema: T): T {
    const optimized = { ...schema } as T & UnknownObject

    if (!optimized["@context"]) {
      optimized["@context"] = "https://schema.org"
    }

    const schemaType = optimized["@type"] as string | undefined
    if (!optimized["@id"] && optimized.url && schemaType) {
      optimized["@id"] = `${optimized.url}#${schemaType.toLowerCase()}`
    }

    Object.keys(optimized).forEach((key) => {
      const value = optimized[key]
      if (Array.isArray(value)) {
        optimized[key] = value.filter(
          (item: unknown) => item !== null && item !== undefined && item !== ""
        )

        if ((optimized[key] as unknown[]).length === 0) {
          delete optimized[key]
        }
      }
    })

    return optimized as T
  }

  static async testGoogleRichResults(schema: SchemaInput): Promise<{
    eligible: boolean
    richResultTypes: string[]
    issues: string[]
  }> {
    const issues: string[] = []
    const richResultTypes: string[] = []

    if (schema["@type"] === "Person") {
      if (schema.name && schema.jobTitle) {
        richResultTypes.push("Person Rich Card")
      } else {
        issues.push("Person schema missing required fields for rich results")
      }
    }

    if (schema["@type"] === "CreativeWork" || schema.hasPart) {
      if (schema.name && schema.description) {
        richResultTypes.push("Creative Work")
      }
    }

    if (schema["@type"] === "WebSite" && schema.potentialAction) {
      richResultTypes.push("Sitelinks Search Box")
    }

    return {
      eligible: richResultTypes.length > 0,
      richResultTypes,
      issues,
    }
  }
}

export const validateSchemaInDev = () => {
  // Schema validation disabled - happens at build time
  return
}

declare global {
  interface Window {
    schemaValidationCache?: Set<string>
  }
}

export default SchemaValidator
