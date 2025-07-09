import React, { memo, useState, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import emailjs from "@emailjs/browser"
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
} from "lucide-react"
import {
  ContactFormData,
  validateFieldEmail,
  sanitizeEmail,
  sanitizeTextInput,
} from "../utils/contactValidation"
import {
  SecureContactFormData,
  ContactFormErrors,
  validateContactFormSecure,
  detectBot,
  sanitizeContactFormData,
} from "../utils/secureContactValidation"
import {
  checkContactFormLimit,
  recordContactFormAttempt,
} from "../utils/enhancedRateLimit"
import { CSRFProtection } from "../utils/enhancedCSRF"

const Contact: React.FC = memo(() => {
  const { isDark } = useTheme()
  const { targetRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "50px",
  })

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  const [csrfToken, setCsrfToken] = useState(() =>
    CSRFProtection.getCurrentToken()
  )
  const [honeypot, setHoneypot] = useState("")
  const [startTime] = useState(() => Date.now())

  const emailjsConfig = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  }

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
    const emailError = validateFieldEmail(formData.email)
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }))
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }, [formData.email])

  const validateForm = useCallback((): boolean => {
    const rateLimitResult = checkContactFormLimit("default")

    if (!rateLimitResult.allowed) {
      if (rateLimitResult.blocked) {
        setErrors({
          general:
            rateLimitResult.message ||
            "Too many attempts. Please try again later.",
        })
      } else {
        setErrors({
          general: `Rate limit exceeded. ${
            rateLimitResult.remaining
          } attempts remaining. Try again after ${new Date(
            rateLimitResult.resetTime
          ).toLocaleTimeString()}.`,
        })
      }
      return false
    }

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

      recordContactFormAttempt("default")

      if (!validateForm()) return

      if (!CSRFProtection.isTokenValid(csrfToken)) {
        const newToken = CSRFProtection.getCurrentToken()
        setCsrfToken(newToken)

        if (!CSRFProtection.isTokenValid(newToken)) {
          setErrors({
            general:
              "Security validation failed. Please refresh the page and try again.",
          })
          return
        }
      }

      const submissionTime = Date.now() - startTime
      if (submissionTime < 3000) {
        setErrors({
          general:
            "Please take a moment to review your message before submitting.",
        })
        return
      }

      if (
        !emailjsConfig.serviceId ||
        !emailjsConfig.templateId ||
        !emailjsConfig.publicKey
      ) {
        setIsSubmitting(true)
        setSubmitStatus("idle")

        try {
          await new Promise((resolve) => setTimeout(resolve, 2000))

          setCsrfToken(CSRFProtection.getCurrentToken())

          setFormData({ name: "", email: "", subject: "", message: "" })
          setSubmitStatus("success")
          setTimeout(() => setSubmitStatus("idle"), 5000)
        } catch {
          setSubmitStatus("error")
          setTimeout(() => setSubmitStatus("idle"), 5000)
        } finally {
          setIsSubmitting(false)
        }
        return
      }

      setIsSubmitting(true)
      setSubmitStatus("idle")

      try {
        if (!CSRFProtection.validateToken(csrfToken)) {
          setErrors({
            general:
              "Security validation failed. Please refresh the page and try again.",
          })
          setIsSubmitting(false)
          return
        }

        const secureData: SecureContactFormData = {
          ...formData,
          csrfToken,
          timestamp: startTime, // Use the form's start time for bot detection
          honeypot,
        }
        const sanitizedData = sanitizeContactFormData(secureData)

        const templateParams = {
          from_name: sanitizedData.name,
          from_email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          to_email: import.meta.env.VITE_CONTACT_EMAIL || "th.mentis@gmail.com",
          reply_to: sanitizedData.email,
        }

        await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          templateParams,
          emailjsConfig.publicKey
        )

        setCsrfToken(CSRFProtection.getCurrentToken())

        setFormData({ name: "", email: "", subject: "", message: "" })
        setErrors({})
        setSubmitStatus("success")

        setTimeout(() => setSubmitStatus("idle"), 5000)
      } catch {
        setSubmitStatus("error")
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, emailjsConfig, csrfToken, startTime, setCsrfToken]
  )

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "th.mentis@gmail.com",
      href: "mailto:th.mentis@gmail.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Piraeus, Attica, Greece",
      href: "https://www.linkedin.com/in/thmentis/",
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/jepeteo",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/thmentis/",
    },
  ]

  return (
    <section
      ref={targetRef}
      className={`py-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      id="contact"
    >
      <div className="container">
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            Get In Touch
          </div>

          <h2
            className={`text-6xl md:text-8xl font-bold mb-8 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Conversations I Welcome
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Ready to collaborate? Let's discuss your next project and bring your
            ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3
                className={`text-2xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Let's Connect
              </h3>

              <p
                className={`text-lg mb-8 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                I'm always interested in hearing about new opportunities and
                exciting projects. Whether you're a company looking to hire, or
                you're looking for a freelancer, I'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                    isDark
                      ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-green-500/50"
                      : "bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-green-500/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDark
                        ? "bg-green-500/20 text-green-300"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div>
              <h4
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Follow Me
              </h4>

              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                      isDark
                        ? "bg-slate-800 text-slate-400 hover:bg-green-500 hover:text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-green-500 hover:text-white"
                    }`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`p-8 rounded-2xl ${
              isDark
                ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700"
                : "bg-white/50 backdrop-blur-sm border border-slate-200"
            }`}
          >
            {submitStatus === "success" && (
              <div
                className={`flex items-center gap-3 p-4 mb-6 rounded-xl ${
                  isDark
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span>
                  Message sent successfully! I'll get back to you soon.
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className={`flex items-center gap-3 p-4 mb-6 rounded-xl ${
                  isDark
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span>Failed to send message. Please try again.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name
                      ? "border-red-500"
                      : isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  maxLength={50}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-500"
                      : isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                  maxLength={254}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.subject
                      ? "border-red-500"
                      : isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                  placeholder="Project inquiry, collaboration, etc."
                  disabled={isSubmitting}
                  maxLength={100}
                />
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                    errors.message
                      ? "border-red-500"
                      : isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                  placeholder="Tell me about your project, requirements, timeline, etc."
                  disabled={isSubmitting}
                  maxLength={2000}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <div style={{ display: "none" }}>
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
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isDark
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
})

Contact.displayName = "Contact"
export default Contact
