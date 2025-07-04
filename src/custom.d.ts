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
    VITE_EMAILJS_PUBLIC_KEY: string
    VITE_EMAILJS_SERVICE_ID: string
    VITE_EMAILJS_TEMPLATE_ID: string
    VITE_CONTACT_EMAIL: string
  }
}
