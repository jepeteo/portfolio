import React, { memo, useState, useCallback, useMemo, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Check,
  X,
} from "lucide-react"
import {
  ContactFormData,
  validateFieldEmail,
  sanitizeEmail,
  sanitizeTextInput,
} from "../../utils/contactValidation"
import {
  SecureContactFormData,
  ContactFormErrors,
  validateContactFormSecure,
  detectBot,
} from "../../utils/secureContactValidation"
import { useToast } from "../ui/Toast"
import SectionShell from "../ui/SectionShell"
import ContactRequestFields from "../services/ContactRequestFields"
import { site } from "../../config/site"
import {
  requestTypeOptions,
  type RequestType,
} from "../../content/services"
import {
  generateContactSchema,
} from "../../content/schemas/contactSchema"

const ContactMethodSchema: React.FC<{
  method: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    href?: string
  }
}> = ({ method }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    contactType: method.label.toLowerCase(),
    ...(method.label === "Email" && { email: method.value }),
    ...(method.label === "Location" && {
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressRegion: site.location.region,
        addressCountry: site.location.country,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  )
}

// Enhanced Form Field Component with inline validation
interface FormFieldProps {
  id: string
  label: string
  type?: "text" | "email" | "textarea"
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onBlur?: () => void
  error?: string
  placeholder: string
  maxLength: number
  disabled?: boolean
  isDark: boolean
  rows?: number
  isValid?: boolean
  showCharCount?: boolean
  autoComplete?: string
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  maxLength,
  disabled,
  rows = 6,
  isValid,
  showCharCount = true,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const charCount = value.length
  const charPercentage = (charCount / maxLength) * 100
  const errorId = `${id}-error`

  const getCharCountColor = () => {
    if (charPercentage >= 90) return "text-red-500"
    if (charPercentage >= 75) return "text-[var(--v2-acid)]"
    return "text-[var(--v2-soft)]"
  }

  const getBorderColor = () => {
    if (error) return "border-red-500 focus:ring-red-500"
    if (isValid && value.length > 0)
      return "border-[var(--v2-ok)]/60 focus:ring-[var(--v2-ok)]"
    return "border-[var(--v2-line-strong)] focus:ring-[var(--v2-brand)]"
  }

  const inputClasses = `w-full rounded-xl border bg-[var(--v2-panel-2)] px-4 py-3 text-[var(--v2-text)] transition-all placeholder:text-[var(--v2-soft)] focus:border-transparent focus:ring-2 ${getBorderColor()}`

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--v2-muted)]"
        >
          {label} *
        </label>
        {showCharCount && (
          <motion.span
            className={`text-xs transition-colors ${getCharCountColor()}`}
            initial={false}
            animate={{
              scale: charPercentage >= 90 ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {charCount}/{maxLength}
          </motion.span>
        )}
      </div>

      <div className="relative">
        {type === "textarea" ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              onBlur?.()
            }}
            rows={rows}
            className={`${inputClasses} resize-none`}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            aria-required="true"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              onBlur?.()
            }}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            aria-required="true"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        )}

        {/* Validation indicator */}
        <AnimatePresence>
          {value.length > 0 && !isFocused && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {error ? (
                <X className="w-5 h-5 text-red-500" />
              ) : isValid ? (
                <Check className="w-5 h-5 text-[var(--v2-ok)]" />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message with animation */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const Contact: React.FC = memo(() => {
  const { isDark } = useTheme()
  const { addToast } = useToast()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    requestType: "",
    urgency: "",
    budget: "",
    websiteUrl: "",
  })

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const typeParam = searchParams.get("type")
    if (!typeParam) return

    const isValidType = requestTypeOptions.some(
      (option) => option.value === typeParam
    )
    if (!isValidType) return

    setFormData((prev) => ({
      ...prev,
      requestType: typeParam as RequestType,
    }))
  }, [searchParams])

  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  const [csrfToken, setCsrfToken] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [startTime] = useState(() => Date.now())
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Field validation states
  const fieldValidation = useMemo(() => {
    return {
      name: formData.name.length >= 2 && formData.name.length <= 50,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      subject: formData.subject.length >= 3 && formData.subject.length <= 100,
      message: formData.message.length >= 10 && formData.message.length <= 2000,
    }
  }, [formData])

  const isFormValid = useMemo(() => {
    return Object.values(fieldValidation).every(Boolean)
  }, [fieldValidation])

  const fetchCsrfToken = useCallback(async (): Promise<string> => {
    const response = await fetch("/api/contact/csrf", {
      method: "GET",
      credentials: "same-origin",
    })
    if (!response.ok) {
      throw new Error("Failed to initialize secure contact session")
    }
    const data = (await response.json()) as { csrfToken?: string }
    if (!data.csrfToken) {
      throw new Error("Missing CSRF token")
    }
    setCsrfToken(data.csrfToken)
    return data.csrfToken
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      let sanitizedValue: string

      if (name === "email") {
        sanitizedValue = sanitizeEmail(value)
      } else {
        sanitizedValue = sanitizeTextInput(value)
      }

      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))

      if (errors[name as keyof ContactFormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors]
  )

  const handleEmailBlur = useCallback(() => {
    setTouchedFields((prev) => new Set(prev).add("email"))
    const emailError = validateFieldEmail(formData.email)
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }))
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }, [formData.email])

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName))
  }, [])

  const validateForm = useCallback((): boolean => {
    const secureData: SecureContactFormData = {
      ...formData,
      csrfToken,
      timestamp: startTime,
      honeypot,
    }

    if (detectBot(secureData)) {
      setErrors({
        general: "Please wait at least 3 seconds before submitting the form.",
      })
      return false
    }

    const validationResult = validateContactFormSecure(secureData)

    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      return false
    }

    setErrors({})
    return true
  }, [formData, csrfToken, honeypot, startTime])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      const submissionTime = Date.now() - startTime
      if (submissionTime < 3000) {
        setErrors({
          general:
            "Please take a moment to review your message before submitting.",
        })
        return
      }

      setIsSubmitting(true)
      setSubmitStatus("idle")

      try {
        const token = csrfToken || (await fetchCsrfToken())

        const secureData: SecureContactFormData = {
          ...formData,
          csrfToken: token,
          timestamp: startTime, // Use the form's start time for bot detection
          honeypot,
          sourcePage:
            typeof window !== "undefined"
              ? window.location.pathname + window.location.search
              : undefined,
        }
        const response = await fetch("/api/contact", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
          },
          body: JSON.stringify(secureData),
        })

        if (!response.ok) {
          const result = (await response.json().catch(() => ({}))) as {
            error?: string
            fields?: ContactFormErrors
          }
          if (response.status === 400 && result.fields) {
            setErrors(result.fields)
          } else {
            setErrors({
              general:
                result.error ||
                "Something went wrong. Please try again or email me directly.",
            })
          }
          setSubmitStatus("error")
          return
        }

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          requestType: "",
          urgency: "",
          budget: "",
          websiteUrl: "",
        })
        setErrors({})
        setSubmitStatus("success")
        setCsrfToken("")
        addToast({
          type: "success",
          title: "Message Sent!",
          message: "Thank you for reaching out. I'll get back to you soon.",
          duration: 5000,
        })

        setTimeout(() => setSubmitStatus("idle"), 5000)
      } catch {
        setSubmitStatus("error")
        addToast({
          type: "error",
          title: "Failed to Send",
          message:
            "Something went wrong. Please try again or email me directly.",
          duration: 6000,
        })
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      formData,
      validateForm,
      csrfToken,
      startTime,
      fetchCsrfToken,
      addToast,
      honeypot,
    ]
  )

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: site.location.label,
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: site.social.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: site.social.linkedin,
    },
  ]

  return (
    <>
      {/* SEO Schema for Contact */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateContactSchema(), null, 2),
        }}
      />

      <SectionShell
        ref={targetRef}
        id="contact"
        variant="default"
        eyebrow="Start here"
        title="Tell me what you need fixed or built."
        subtitle="Send the website URL, the problem and your deadline. You'll get a clear next step and a fixed quote — no long questionnaire before we've spoken."
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--v2-text)]">
                  What to include
                </h3>

                <p className="mb-8 text-lg text-[var(--v2-muted)]">
                  A link to the site, a short description of what's broken or
                  what you want to build, and your timeline. Whether you're a
                  business owner, an agency needing extra capacity, or a team
                  looking to hire, I'll get back to you with practical next
                  steps.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const cardClassName = `flex items-center gap-4 rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-4 transition-all ${
                    item.href
                      ? "hover:-translate-y-0.5 hover:border-[var(--v2-acid)]/40 motion-reduce:hover:translate-y-0"
                      : ""
                  }`

                  const cardContent = (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--v2-soft)]">
                          {item.label}
                        </div>
                        <div className="font-semibold text-[var(--v2-text)]">
                          {item.value}
                        </div>
                      </div>
                    </>
                  )

                  return (
                    <React.Fragment key={index}>
                      <ContactMethodSchema method={item} />
                      {item.href ? (
                        <a href={item.href} className={cardClassName}>
                          {cardContent}
                        </a>
                      ) : (
                        <div className={cardClassName}>{cardContent}</div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold tracking-tight text-[var(--v2-text)]">
                  Follow me
                </h4>

                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-muted)] transition-all hover:bg-[var(--v2-acid)] hover:text-[var(--v2-acid-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--v2-line)] bg-[var(--v2-panel)] p-8">
              {submitStatus === "success" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--v2-ok)]/30 bg-[var(--v2-ok)]/15 p-4 text-[var(--v2-ok)]"
                >
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                  <span>
                    Message sent successfully! I'll get back to you soon.
                  </span>
                </div>
              )}

              {submitStatus === "error" && (
                <div
                  role="alert"
                  className={`flex items-center gap-3 p-4 mb-6 rounded-xl ${
                    isDark
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form progress indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--v2-muted)]">
                      Form progress
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isFormValid
                          ? "text-[var(--v2-acid)]"
                          : "text-[var(--v2-muted)]"
                      }`}
                    >
                      {Object.values(fieldValidation).filter(Boolean).length}/4
                      fields complete
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--v2-line)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--v2-acid)]"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (Object.values(fieldValidation).filter(Boolean)
                            .length /
                            4) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <FormField
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur("name")}
                  error={
                    touchedFields.has("name") &&
                    !fieldValidation.name &&
                    formData.name.length > 0
                      ? "Name must be 2-50 characters"
                      : errors.name
                  }
                  placeholder="Your full name"
                  maxLength={50}
                  disabled={isSubmitting}
                  isDark={isDark}
                  isValid={fieldValidation.name}
                  autoComplete="name"
                />

                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  error={errors.email}
                  placeholder="your.email@example.com"
                  maxLength={254}
                  disabled={isSubmitting}
                  isDark={isDark}
                  isValid={fieldValidation.email}
                  autoComplete="email"
                />

                <FormField
                  id="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur("subject")}
                  error={
                    touchedFields.has("subject") &&
                    !fieldValidation.subject &&
                    formData.subject.length > 0
                      ? "Subject must be 3-100 characters"
                      : errors.subject
                  }
                  placeholder="Project inquiry, collaboration, etc."
                  maxLength={100}
                  disabled={isSubmitting}
                  isDark={isDark}
                  isValid={fieldValidation.subject}
                />

                <ContactRequestFields
                  requestType={formData.requestType || ""}
                  urgency={formData.urgency || ""}
                  budget={formData.budget || ""}
                  websiteUrl={formData.websiteUrl || ""}
                  websiteUrlError={errors.websiteUrl}
                  disabled={isSubmitting}
                  onRequestTypeChange={(value) =>
                    setFormData((prev) => ({ ...prev, requestType: value }))
                  }
                  onUrgencyChange={(value) =>
                    setFormData((prev) => ({ ...prev, urgency: value }))
                  }
                  onBudgetChange={(value) =>
                    setFormData((prev) => ({ ...prev, budget: value }))
                  }
                  onWebsiteUrlChange={(value) => {
                    const sanitized = sanitizeTextInput(value)
                    setFormData((prev) => ({ ...prev, websiteUrl: sanitized }))
                    if (errors.websiteUrl) {
                      setErrors((prev) => ({ ...prev, websiteUrl: undefined }))
                    }
                  }}
                />

                <FormField
                  id="message"
                  label="Message"
                  type="textarea"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur("message")}
                  error={
                    touchedFields.has("message") &&
                    !fieldValidation.message &&
                    formData.message.length > 0
                      ? "Message must be 10-2000 characters"
                      : errors.message
                  }
                  placeholder="Describe the issue, goals, timeline, or anything else that helps me understand your request."
                  maxLength={2000}
                  disabled={isSubmitting}
                  isDark={isDark}
                  isValid={fieldValidation.message}
                  rows={6}
                />

                <div style={{ display: "none" }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {errors.general && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {errors.general}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--v2-acid)] px-8 py-4 font-bold tracking-tight text-[var(--v2-acid-ink)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-acid)] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send project request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
      </SectionShell>
    </>
  )
})

Contact.displayName = "Contact"
export default Contact
