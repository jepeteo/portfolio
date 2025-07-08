declare module "*.png" {
  const content: string
  export default content
}
declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.webp" {
  const content: string
  export default content
}

interface ImportMeta {
  env: {
    MODE: string
    DEV: boolean
    PROD: boolean
    VITE_EMAILJS_PUBLIC_KEY: string
    VITE_EMAILJS_SERVICE_ID: string
    VITE_EMAILJS_TEMPLATE_ID: string
    VITE_CONTACT_EMAIL: string
    VITE_ENABLE_MONITORING: string
    // Updated PostHog environment variables to match official docs
    VITE_PUBLIC_POSTHOG_KEY?: string
    VITE_PUBLIC_POSTHOG_HOST?: string
    VITE_ENABLE_POSTHOG?: string
    // Legacy support (will be removed)
    VITE_POSTHOG_API_KEY?: string
    VITE_POSTHOG_HOST?: string
  }
}
