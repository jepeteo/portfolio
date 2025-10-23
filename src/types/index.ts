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
  schema: any
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
