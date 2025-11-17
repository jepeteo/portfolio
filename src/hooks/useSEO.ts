import { useEffect } from "react"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: string
  schema?: object
}

const useSEO = ({
  title = "Theodoros Mentis - Senior Full-Stack Developer",
  description = "Senior Full-Stack Developer with 18+ years of experience specializing in WordPress, React, and modern web technologies. Based in Berlin, Germany. Building scalable web solutions.",
  keywords = "full stack developer, wordpress expert, react developer, web development, javascript, typescript, php, mysql, berlin developer",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "/src/assets/images/teo.png",
  ogUrl,
  twitterCard = "summary_large_image",
  schema,
}: SEOProps = {}) => {
  useEffect(() => {
    document.title = title

    const updateMetaTag = (
      name: string,
      content: string,
      property?: boolean
    ) => {
      const attribute = property ? "property" : "name"
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)

      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }

      meta.setAttribute("content", content)
    }

    updateMetaTag("description", description)
    updateMetaTag("keywords", keywords)

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement("link")
        link.setAttribute("rel", "canonical")
        document.head.appendChild(link)
      }
      link.setAttribute("href", canonical)
    }

    updateMetaTag("og:title", ogTitle || title, true)
    updateMetaTag("og:description", ogDescription || description, true)
    updateMetaTag("og:image", ogImage, true)
    updateMetaTag("og:type", "website", true)

    if (ogUrl) {
      updateMetaTag("og:url", ogUrl, true)
    }

    updateMetaTag("twitter:card", twitterCard)
    updateMetaTag("twitter:title", ogTitle || title)
    updateMetaTag("twitter:description", ogDescription || description)
    updateMetaTag("twitter:image", ogImage)

    if (schema) {
      let script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement("script")
        script.setAttribute("type", "application/ld+json")
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(schema)
    }

    return () => {
      document.title = "Theodoros Mentis - Senior Full-Stack Developer"
    }
  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    schema,
  ])
}

export default useSEO
