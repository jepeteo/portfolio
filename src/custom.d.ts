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
    VERCEL?: string
    VITE_EMAILJS_PUBLIC_KEY: string
    VITE_EMAILJS_SERVICE_ID: string
    VITE_EMAILJS_TEMPLATE_ID: string
    VITE_CONTACT_EMAIL: string
    VITE_ENABLE_MONITORING: string
    VITE_VERCEL_ANALYTICS_ENABLED: string
    VITE_VERCEL_SPEED_INSIGHTS_ENABLED: string
  }
}
