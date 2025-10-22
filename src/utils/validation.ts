import {
  Job,
  Project,
  ModernCertificate,
  Skill,
  ModernReactProject,
} from "../types"

export const isValidJob = (obj: any): obj is Job => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.title === "string" &&
    typeof obj.company === "string" &&
    typeof obj.from === "string" &&
    typeof obj.description === "string" &&
    (obj.to === null || typeof obj.to === "string") &&
    (obj.location === undefined || typeof obj.location === "string") &&
    (obj.technologies === undefined || Array.isArray(obj.technologies))
  )
}

export const isValidProject = (obj: any): obj is Project => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.prName === "string" &&
    typeof obj.prType === "string" &&
    typeof obj.prFeatured === "boolean" &&
    typeof obj.prUrl === "string" &&
    typeof obj.prDescription === "string" &&
    typeof obj.prImageSlug === "string"
  )
}

export const isValidReactProject = (obj: any): obj is ModernReactProject => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.prName === "string" &&
    typeof obj.prType === "string" &&
    typeof obj.prUrl === "string" &&
    typeof obj.prDescription === "string" &&
    typeof obj.prImageSlug === "string"
  )
}

export const validateReactProject = (obj: any): boolean => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    (obj.technologies === undefined || Array.isArray(obj.technologies)) &&
    (obj.githubUrl === undefined || typeof obj.githubUrl === "string") &&
    (obj.liveUrl === undefined || typeof obj.liveUrl === "string") &&
    (obj.image === undefined || typeof obj.image === "string") &&
    (obj.date === undefined || typeof obj.date === "string") &&
    (obj.status === undefined || typeof obj.status === "string") &&
    (obj.featured === undefined || typeof obj.featured === "boolean") &&
    (obj.performance === undefined || typeof obj.performance === "string")
  )
}

export const validateCertificate = (obj: any): obj is ModernCertificate => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.issuer === "string" &&
    typeof obj.issueDate === "string" &&
    (obj.category === undefined || typeof obj.category === "string") &&
    (obj.expirationDate === undefined ||
      typeof obj.expirationDate === "string") &&
    (obj.credentialId === undefined || typeof obj.credentialId === "string") &&
    (obj.credentialUrl === undefined ||
      typeof obj.credentialUrl === "string") &&
    (obj.description === undefined || typeof obj.description === "string") &&
    (obj.skills === undefined || Array.isArray(obj.skills))
  )
}

export const isValidCertificate = (obj: any): boolean => {

  if (obj && typeof obj === "object" && obj.certName && obj.certUrl) {
    return (
      typeof obj.certName === "string" &&
      typeof obj.certUrl === "string" &&
      typeof obj.certImg === "string" &&
      typeof obj.certVisible === "boolean" &&
      typeof obj.certCat === "string"
    )
  }

  return validateCertificate(obj)
}

export const isValidSkill = (obj: any): obj is Skill => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.skillName === "string" &&
    typeof obj.category === "string" &&
    typeof obj.description === "string" &&
    typeof obj.visible === "boolean"
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
