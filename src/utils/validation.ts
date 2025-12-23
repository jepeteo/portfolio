import {
  Job,
  Project,
  ModernCertificate,
  Skill,
  ModernReactProject,
} from "../types"

export const isValidJob = (obj: unknown): obj is Job => {
  if (typeof obj !== "object" || obj === null) return false
  const job = obj as Record<string, unknown>
  return (
    typeof job.title === "string" &&
    typeof job.company === "string" &&
    typeof job.from === "string" &&
    typeof job.description === "string" &&
    (job.to === null || typeof job.to === "string") &&
    (job.location === undefined || typeof job.location === "string") &&
    (job.technologies === undefined || Array.isArray(job.technologies))
  )
}

export const isValidProject = (obj: unknown): obj is Project => {
  if (typeof obj !== "object" || obj === null) return false
  const project = obj as Record<string, unknown>
  return (
    typeof project.prName === "string" &&
    typeof project.prType === "string" &&
    typeof project.prFeatured === "boolean" &&
    typeof project.prUrl === "string" &&
    typeof project.prDescription === "string" &&
    typeof project.prImageSlug === "string"
  )
}

export const isValidReactProject = (
  obj: unknown
): obj is ModernReactProject => {
  if (typeof obj !== "object" || obj === null) return false
  const project = obj as Record<string, unknown>
  return (
    typeof project.prName === "string" &&
    typeof project.prType === "string" &&
    typeof project.prUrl === "string" &&
    typeof project.prDescription === "string" &&
    typeof project.prImageSlug === "string"
  )
}

export const validateReactProject = (obj: unknown): boolean => {
  if (typeof obj !== "object" || obj === null) return false
  const project = obj as Record<string, unknown>
  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    typeof project.description === "string" &&
    (project.technologies === undefined ||
      Array.isArray(project.technologies)) &&
    (project.githubUrl === undefined ||
      typeof project.githubUrl === "string") &&
    (project.liveUrl === undefined || typeof project.liveUrl === "string") &&
    (project.image === undefined || typeof project.image === "string") &&
    (project.date === undefined || typeof project.date === "string") &&
    (project.status === undefined || typeof project.status === "string") &&
    (project.featured === undefined || typeof project.featured === "boolean") &&
    (project.performance === undefined ||
      typeof project.performance === "string")
  )
}

export const validateCertificate = (obj: unknown): obj is ModernCertificate => {
  if (typeof obj !== "object" || obj === null) return false
  const cert = obj as Record<string, unknown>
  return (
    typeof cert.id === "string" &&
    typeof cert.name === "string" &&
    typeof cert.issuer === "string" &&
    typeof cert.issueDate === "string" &&
    (cert.category === undefined || typeof cert.category === "string") &&
    (cert.expirationDate === undefined ||
      typeof cert.expirationDate === "string") &&
    (cert.credentialId === undefined ||
      typeof cert.credentialId === "string") &&
    (cert.credentialUrl === undefined ||
      typeof cert.credentialUrl === "string") &&
    (cert.description === undefined || typeof cert.description === "string") &&
    (cert.skills === undefined || Array.isArray(cert.skills))
  )
}

export const isValidCertificate = (obj: unknown): boolean => {
  if (typeof obj !== "object" || obj === null) return false
  const cert = obj as Record<string, unknown>

  if (cert.certName && cert.certUrl) {
    return (
      typeof cert.certName === "string" &&
      typeof cert.certUrl === "string" &&
      typeof cert.certImg === "string" &&
      typeof cert.certVisible === "boolean" &&
      typeof cert.certCat === "string"
    )
  }

  return validateCertificate(obj)
}

export const isValidSkill = (obj: unknown): obj is Skill => {
  if (typeof obj !== "object" || obj === null) return false
  const skill = obj as Record<string, unknown>
  return (
    typeof skill.skillName === "string" &&
    typeof skill.category === "string" &&
    typeof skill.description === "string" &&
    typeof skill.visible === "boolean"
  )
}

export const validateImageSrc = (
  src: string,
  fallback: string = "/placeholder-image.png"
): string => {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return fallback
  }

  try {
    if (src.startsWith("http")) {
      new URL(src)
      return src
    }

    return src
  } catch {
    return fallback
  }
}

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateURL = (url: string): boolean => {
  if (!url || typeof url !== "string") return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== "string") {
    return ""
  }

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/data:/gi, "") // Remove data: protocol
    .replace(/vbscript:/gi, "") // Remove vbscript: protocol
    .substring(0, 1000) // Limit length
}

export const validateName = (name: string): boolean => {
  if (!name || typeof name !== "string") return false
  const trimmed = name.trim()
  return (
    trimmed.length >= 2 &&
    trimmed.length <= 50 &&
    /^[a-zA-Z\s'.-]+$/.test(trimmed)
  )
}

export const validateMessage = (message: string): boolean => {
  if (!message || typeof message !== "string") return false
  const trimmed = message.trim()
  return trimmed.length >= 10 && trimmed.length <= 1000
}

export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false
  const cleaned = phone.replace(/[\s().'-]/g, "")
  const phoneRegex = /^[+]?[\d]{10,15}$/
  return phoneRegex.test(cleaned)
}

export const validateSubject = (subject: string): boolean => {
  if (!subject || typeof subject !== "string") return false
  const trimmed = subject.trim()
  return trimmed.length >= 3 && trimmed.length <= 100
}

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  phone?: string
  message: string
}

export const validateContactForm = (
  data: ContactFormData
): {
  isValid: boolean
  errors: Record<string, string>
} => {
  const errors: Record<string, string> = {}

  if (!validateName(data.name)) {
    errors.name =
      "Name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, and periods"
  }

  if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (data.subject && !validateSubject(data.subject)) {
    errors.subject = "Subject must be 3-100 characters"
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = "Please enter a valid phone number"
  }

  if (!validateMessage(data.message)) {
    errors.message = "Message must be 10-1000 characters"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const sanitizeContactForm = (data: ContactFormData): ContactFormData => {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    subject: data.subject ? sanitizeInput(data.subject) : undefined,
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    message: sanitizeInput(data.message),
  }
}
