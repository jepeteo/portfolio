/**
 * Schema validation and optimization utilities
 * Helps ensure schema markup follows Google's guidelines and best practices
 */

export interface SchemaValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export class SchemaValidator {
  static validatePersonSchema(schema: any): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Required fields
    if (!schema.name) errors.push("Person schema missing required 'name' field")
    if (!schema["@type"] || schema["@type"] !== "Person") {
      errors.push("Schema must have @type: 'Person'")
    }

    // Recommended fields
    if (!schema.jobTitle)
      warnings.push("Consider adding 'jobTitle' for better SEO")
    if (!schema.image)
      warnings.push("Consider adding 'image' for rich snippets")
    if (!schema.url) warnings.push("Consider adding 'url' field")

    // Best practices
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

  static validatePortfolioSchema(schema: any): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Basic structure validation
    if (!schema["@context"]) errors.push("Missing @context")
    if (!schema["@type"]) errors.push("Missing @type")
    if (!schema.name) errors.push("Missing name field")

    // Portfolio-specific validation
    if (!schema.hasPart || !Array.isArray(schema.hasPart)) {
      errors.push("Portfolio schema should have 'hasPart' array with projects")
    } else {
      schema.hasPart.forEach((project: any, index: number) => {
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

    // SEO best practices
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

  static validateWebsiteSchema(schema: any): SchemaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    if (!schema.url) errors.push("Website schema missing URL")
    if (!schema.name) errors.push("Website schema missing name")

    if (!schema.potentialAction) {
      suggestions.push("Add potentialAction for search functionality")
    }

    if (!schema.mainEntity) {
      suggestions.push("Add mainEntity to link to primary content")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  }

  static generateSchemaReport(schema: any): string {
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
      default:
        result = {
          isValid: true,
          errors: [],
          warnings: [`Unknown schema type: ${schemaType}`],
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

  /**
   * Optimize schema for better SEO performance
   */
  static optimizeSchema(schema: any): any {
    const optimized = { ...schema }

    // Ensure required fields
    if (!optimized["@context"]) {
      optimized["@context"] = "https://schema.org"
    }

    // Add missing IDs for better linking
    if (!optimized["@id"] && optimized.url) {
      optimized["@id"] = `${optimized.url}#${optimized["@type"].toLowerCase()}`
    }

    // Optimize arrays (remove empty values)
    Object.keys(optimized).forEach((key) => {
      if (Array.isArray(optimized[key])) {
        optimized[key] = optimized[key].filter(
          (item: any) => item !== null && item !== undefined && item !== ""
        )

        // Remove empty arrays
        if (optimized[key].length === 0) {
          delete optimized[key]
        }
      }
    })

    return optimized
  }

  /**
   * Test schema against Google's Rich Results Test (simulation)
   */
  static async testGoogleRichResults(schema: any): Promise<{
    eligible: boolean
    richResultTypes: string[]
    issues: string[]
  }> {
    const issues: string[] = []
    const richResultTypes: string[] = []

    // Simulate Google's validation
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

// Development helper - logs schema validation in development mode
export const validateSchemaInDev = (schema: any, label: string = "Schema") => {
  if (process.env.NODE_ENV === "development") {
    console.group(`🔍 ${label} Validation`)
    console.log("Schema Object:", schema)

    const report = SchemaValidator.generateSchemaReport(schema)
    console.log(report)

    const optimized = SchemaValidator.optimizeSchema(schema)
    if (JSON.stringify(optimized) !== JSON.stringify(schema)) {
      console.log("Optimized Schema:", optimized)
    }

    console.groupEnd()
  }
}

export default SchemaValidator
