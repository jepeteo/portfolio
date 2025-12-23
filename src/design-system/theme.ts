
import { designTokens } from "./tokens"

export const createCSSVariables = (theme: "light" | "dark") => {
  const variables: Record<string, string> = {}

  Object.entries(designTokens.colors.semantic).forEach(([key, value]) => {
    variables[`--color-${key}`] = value
  })

  Object.entries(designTokens.colors.brand).forEach(([key, value]) => {
    variables[`--color-${key}`] = value
  })

  Object.entries(designTokens.colors.neutral).forEach(([key, value]) => {
    variables[`--color-neutral-${key}`] = value
  })

  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value
  })

  Object.entries(designTokens.typography.fontSizes).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value
  })

  if (theme === "dark") {
    variables["--color-background"] = designTokens.colors.neutral[900]
    variables["--color-foreground"] = designTokens.colors.neutral[50]
    variables["--color-surface"] = designTokens.colors.neutral[800]
  } else {
    variables["--color-background"] = designTokens.colors.neutral[50]
    variables["--color-foreground"] = designTokens.colors.neutral[900]
    variables["--color-surface"] = designTokens.colors.neutral[100]
  }

  return variables
}

export const useDesignSystem = () => {
  const tokens = designTokens

  return {
    tokens,
    spacing: (size: keyof typeof tokens.spacing) => tokens.spacing[size],
    color: (path: string) => {
      const keys = path.split(".")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: Record<string, any> = tokens.colors
      for (const key of keys) {
        value = value[key]
      }
      return value as string
    },
    typography: (size: keyof typeof tokens.typography.fontSizes) => ({
      fontSize: tokens.typography.fontSizes[size],
      lineHeight: tokens.typography.lineHeights.normal,
    }),
    shadow: (size: keyof typeof tokens.shadows) => tokens.shadows[size],
    radius: (size: keyof typeof tokens.radii) => tokens.radii[size],
  }
}

export const containerQueries = {
  sm: "@container (min-width: 320px)",
  md: "@container (min-width: 640px)",
  lg: "@container (min-width: 1024px)",
  xl: "@container (min-width: 1280px)",
}

export const focusStyles = {
  base: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  rounded:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-lg",
}

export default designTokens
