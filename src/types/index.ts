export interface Job {
  title: string
  company: string
  from: string
  to: string | null
  description: string
  location?: string
  technologies?: string[]
}

export interface Project {
  id: string
  prName: string
  prUrl?: string
  prImageSlug?: string
  prDescription: string
  prType: string
  prTags?: string | string[]
  tech?: string[]
  prEmployer?: string
  prFeatured?: boolean
}

export interface ModernReactProject {
  id: string
  title: string
  description: string
  image?: string
  technologies?: string[]
  githubUrl?: string
  liveUrl?: string
  date?: string
  status?: "completed" | "in-progress" | "planned"
  featured?: boolean
  performance?: string
}

export interface ModernCertificate {
  id: string
  name: string
  issuer: string
  issueDate: string
  category?: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
  description?: string
  skills?: string[]
}

export interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
  technologies: string[]
}

export interface Skill {
  name: string
  level: number
  category: string
}

export interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

export interface NavLink {
  href: string
  text: string
}

export interface FilterType {
  type: string | null
  label: string
}

export type Theme = "light" | "dark"

export interface EmailResponse {
  status: number
  text: string
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export interface NavigationLink {
  href: string
  text: string
  ariaLabel: string
}

export interface SEOConfig {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  schema: SchemaOrgType
}

export interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

export interface IntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  root?: Element | null
}

// Schema.org Types for structured data
export interface SchemaOrgBase {
  "@context"?: string
  "@type": string
  "@id"?: string
  name?: string
  description?: string
  url?: string
}

export interface SchemaOrgPerson extends SchemaOrgBase {
  "@type": "Person"
  jobTitle?: string
  image?: string | SchemaOrgImageObject
  sameAs?: string[]
  knowsAbout?: string[]
  email?: string
  worksFor?: SchemaOrgOrganization
  alumniOf?: SchemaOrgOrganization | SchemaOrgOrganization[]
}

export interface SchemaOrgOrganization extends SchemaOrgBase {
  "@type": "Organization"
  logo?: string | SchemaOrgImageObject
  contactPoint?: SchemaOrgContactPoint
  address?: SchemaOrgPostalAddress
}

export interface SchemaOrgContactPoint {
  "@type": "ContactPoint"
  telephone?: string
  contactType?: string
  email?: string
}

export interface SchemaOrgPostalAddress {
  "@type": "PostalAddress"
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
}

export interface SchemaOrgImageObject {
  "@type": "ImageObject"
  url: string
  width?: number
  height?: number
  caption?: string
}

export interface SchemaOrgWebSite extends SchemaOrgBase {
  "@type": "WebSite"
  potentialAction?: SchemaOrgSearchAction
  mainEntity?: SchemaOrgType
  publisher?: SchemaOrgOrganization | SchemaOrgPerson
}

export interface SchemaOrgSearchAction {
  "@type": "SearchAction"
  target?: string | { "@type": "EntryPoint"; urlTemplate: string }
  "query-input"?: string
}

export interface SchemaOrgCreativeWork extends SchemaOrgBase {
  "@type": "CreativeWork" | "SoftwareApplication" | "WebApplication"
  creator?: SchemaOrgPerson | SchemaOrgOrganization
  hasPart?: SchemaOrgCreativeWork[]
  dateCreated?: string
  datePublished?: string
  thumbnailUrl?: string
  keywords?: string | string[]
}

export interface SchemaOrgItemList extends SchemaOrgBase {
  "@type": "ItemList"
  itemListElement: SchemaOrgListItem[]
  numberOfItems?: number
}

export interface SchemaOrgListItem {
  "@type": "ListItem"
  position: number
  item?: SchemaOrgType
  name?: string
  url?: string
}

export interface SchemaOrgBreadcrumbList extends SchemaOrgBase {
  "@type": "BreadcrumbList"
  itemListElement: SchemaOrgListItem[]
}

export interface SchemaOrgFAQPage extends SchemaOrgBase {
  "@type": "FAQPage"
  mainEntity: SchemaOrgQuestion[]
}

export interface SchemaOrgQuestion {
  "@type": "Question"
  name: string
  acceptedAnswer: SchemaOrgAnswer
}

export interface SchemaOrgAnswer {
  "@type": "Answer"
  text: string
}

export interface SchemaOrgGraph {
  "@context": string
  "@graph": SchemaOrgType[]
}

export type SchemaOrgType =
  | SchemaOrgPerson
  | SchemaOrgOrganization
  | SchemaOrgWebSite
  | SchemaOrgCreativeWork
  | SchemaOrgItemList
  | SchemaOrgBreadcrumbList
  | SchemaOrgFAQPage
  | SchemaOrgGraph
  | SchemaOrgBase

// Web Performance API Types (for non-standard properties)
export interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
  sources?: LayoutShiftAttribution[]
}

export interface LayoutShiftAttribution {
  node?: Node
  previousRect: DOMRectReadOnly
  currentRect: DOMRectReadOnly
}

export interface FirstInputEntry extends PerformanceEntry {
  processingStart: number
  processingEnd: number
  target?: EventTarget
}

export interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

export interface NetworkInformation {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g"
  downlink?: number
  rtt?: number
  saveData?: boolean
}

// Extend Navigator and Performance for vendor-prefixed APIs
declare global {
  interface Performance {
    memory?: PerformanceMemory
  }

  interface Navigator {
    connection?: NetworkInformation
    mozConnection?: NetworkInformation
    webkitConnection?: NetworkInformation
  }
}

// Filter types for components
export type ExperienceFilterType =
  | "all"
  | "current"
  | "past"
  | "freelance"
  | "employment"

// Generic unknown type for validation functions
export type UnknownObject = Record<string, unknown>

// Storage value type
export type StorageValue = string | number | boolean | object | null
