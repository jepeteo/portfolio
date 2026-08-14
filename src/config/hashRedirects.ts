export const hashRedirects: Record<string, string> = {
  projects: "/projects",
  certificates: "/certifications",
  experience: "/experience",
  skills: "/engineering",
  about: "/about",
  contact: "/contact",
  faq: "/about#faq",
}

export const resolveHashRedirect = (
  pathname: string,
  hash: string,
  search = ""
) => {
  if (pathname !== "/") return null
  const key = hash.replace(/^#/, "").split(/[?&]/)[0]
  if (!key || key === "top") return null
  const target = hashRedirects[key]
  if (!target) return null
  if (target.includes("#")) return target
  return `${target}${search}`
}
