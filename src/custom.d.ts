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
    VITE_APP_EMAILJS_PUBLIC_KEY: string;
    VITE_APP_EMAILJS_SERVICE_ID: string;
    VITE_APP_EMAILJS_TEMPLATE_ID: string;
  }
}
