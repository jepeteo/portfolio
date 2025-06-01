export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

// Email validation - strict for email fields
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false

  // Remove any spaces (emails shouldn't have spaces)
  const cleanEmail = email.replace(/\s/g, "")

  // Comprehensive email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  return (
    emailRegex.test(cleanEmail) &&
    cleanEmail.length >= 5 &&
    cleanEmail.length <= 254
  )
}

// Name validation - allows spaces and common name characters
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== "string") return false

  const trimmed = name.trim()

  if (trimmed.length < 2 || trimmed.length > 50) return false

  // Allow letters, spaces, hyphens, apostrophes, and periods
  const nameRegex = /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s\-\'\.]+$/

  return nameRegex.test(trimmed)
}

// Subject validation - allows spaces and most characters
export const validateSubject = (subject: string): boolean => {
  if (!subject || typeof subject !== "string") return false

  const trimmed = subject.trim()

  if (trimmed.length < 3 || trimmed.length > 100) return false

  // Allow most characters except dangerous ones
  const subjectRegex = /^[^<>{}[\]\\\/]*$/

  return subjectRegex.test(trimmed)
}

// Message validation - allows spaces and most characters
export const validateMessage = (message: string): boolean => {
  if (!message || typeof message !== "string") return false

  const trimmed = message.trim()

  if (trimmed.length < 10 || trimmed.length > 2000) return false

  // Allow most characters except dangerous HTML/script tags
  const messageRegex = /^[^<>{}[\]\\]*$/

  return messageRegex.test(trimmed)
}

// Sanitization functions
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== "string") return ""

  return email
    .replace(/\s/g, "") // Remove all spaces from email
    .replace(/[<>{}[\]\\]/g, "") // Remove dangerous characters
    .toLowerCase()
    .trim()
    .substring(0, 254) // Email length limit
}

export const sanitizeTextInput = (input: string): string => {
  if (!input || typeof input !== "string") return ""

  return input
    .replace(/[<>{}[\]\\]/g, "") // Remove dangerous characters but keep spaces
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/data:/gi, "") // Remove data: protocol
}

// Individual field validation with error messages
export const validateFieldName = (name: string): string | null => {
  if (!name || !name.trim()) {
    return "Name is required"
  }

  if (!validateName(name)) {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      return "Name must be at least 2 characters long"
    }
    if (trimmed.length > 50) {
      return "Name must be less than 50 characters"
    }
    return "Name contains invalid characters. Only letters, spaces, hyphens, apostrophes, and periods are allowed"
  }

  return null
}

export const validateFieldEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return "Email is required"
  }

  if (email.includes(" ")) {
    return "Email addresses cannot contain spaces"
  }

  if (!validateEmail(email)) {
    return "Please enter a valid email address"
  }

  return null
}

export const validateFieldSubject = (subject: string): string | null => {
  if (!subject || !subject.trim()) {
    return "Subject is required"
  }

  if (!validateSubject(subject)) {
    const trimmed = subject.trim()
    if (trimmed.length < 3) {
      return "Subject must be at least 3 characters long"
    }
    if (trimmed.length > 100) {
      return "Subject must be less than 100 characters"
    }
    return "Subject contains invalid characters"
  }

  return null
}

export const validateFieldMessage = (message: string): string | null => {
  if (!message || !message.trim()) {
    return "Message is required"
  }

  if (!validateMessage(message)) {
    const trimmed = message.trim()
    if (trimmed.length < 10) {
      return "Message must be at least 10 characters long"
    }
    if (trimmed.length > 2000) {
      return "Message must be less than 2000 characters"
    }
    return "Message contains invalid characters"
  }

  return null
}

// Complete form validation
export const validateContactForm = (
  data: ContactFormData
): ContactFormErrors => {
  const errors: ContactFormErrors = {}

  const nameError = validateFieldName(data.name)
  if (nameError) errors.name = nameError

  const emailError = validateFieldEmail(data.email)
  if (emailError) errors.email = emailError

  const subjectError = validateFieldSubject(data.subject)
  if (subjectError) errors.subject = subjectError

  const messageError = validateFieldMessage(data.message)
  if (messageError) errors.message = messageError

  return errors
}

// Check if form is valid
export const isFormValid = (errors: ContactFormErrors): boolean => {
  return Object.keys(errors).length === 0
}

// Sanitize entire form
export const sanitizeContactForm = (data: ContactFormData): ContactFormData => {
  return {
    name: sanitizeTextInput(data.name),
    email: sanitizeEmail(data.email),
    subject: sanitizeTextInput(data.subject),
    message: sanitizeTextInput(data.message),
  }
}
