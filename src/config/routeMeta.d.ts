// Type declarations for routeMeta.js (plain ESM data shared with the prerender script).

export const SITE_URL: "https://www.theodorosmentis.com"
export const SITE_EMAIL: "contact@theodorosmentis.com"
export const OG_IMAGE: string
export const SITE_NAME: string
export const TWITTER_CREATOR: string

export interface RouteMeta {
  title: string
  description: string
  canonicalPath: string
  ogType: "website" | "article" | "profile"
  jsonLd: Record<string, unknown>[]
}

export const routeMeta: Record<string, RouteMeta>
export const prerenderRoutes: string[]
export function absoluteUrl(canonicalPath: string): string
