/**
 * Enhanced SEO Optimization Utilities
 * Advanced SEO features for better search engine visibility
 */

import { useEffect } from "react"

// Enhanced SEO configuration interface
export interface EnhancedSEOConfig {
  // Basic meta tags
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string

  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: "website" | "article" | "profile"
  ogSiteName?: string

  // Twitter Card
  twitterCard?: "summary" | "summary_large_image" | "app" | "player"
  twitterSite?: string
  twitterCreator?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string

  // Article specific (for blog posts)
  articleAuthor?: string
  articlePublishedTime?: string
  articleModifiedTime?: string
  articleSection?: string
  articleTags?: string[]

  // Structured data
  structuredData?: any

  // Technical SEO
  robots?: string
  language?: string
  alternateUrls?: { lang: string; href: string }[]

  // Performance hints
  preloadResources?: { href: string; as: string; type?: string }[]
  prefetchUrls?: string[]
}

class SEOManager {
  private static instance: SEOManager
  private metaTags: Map<string, HTMLMetaElement> = new Map()
  private linkTags: Map<string, HTMLLinkElement> = new Map()
  private structuredDataScript: HTMLScriptElement | null = null

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager()
    }
    return SEOManager.instance
  }

  // Apply comprehensive SEO configuration
  applySEO(config: EnhancedSEOConfig): () => void {
    // Update document title
    if (config.title) {
      document.title = config.title
    }

    // Apply basic meta tags
    this.setMetaTag("description", config.description)
    this.setMetaTag("keywords", config.keywords?.join(", "))
    this.setMetaTag("robots", config.robots || "index,follow")
    this.setMetaTag("language", config.language || "en")

    // Apply Open Graph tags
    this.setMetaTag("og:title", config.ogTitle || config.title, true)
    this.setMetaTag(
      "og:description",
      config.ogDescription || config.description,
      true
    )
    this.setMetaTag("og:image", config.ogImage, true)
    this.setMetaTag("og:url", config.ogUrl || window.location.href, true)
    this.setMetaTag("og:type", config.ogType || "website", true)
    this.setMetaTag("og:site_name", config.ogSiteName, true)

    // Apply Twitter Card tags
    this.setMetaTag("twitter:card", config.twitterCard || "summary_large_image")
    this.setMetaTag("twitter:site", config.twitterSite)
    this.setMetaTag("twitter:creator", config.twitterCreator)
    this.setMetaTag("twitter:title", config.twitterTitle || config.title)
    this.setMetaTag(
      "twitter:description",
      config.twitterDescription || config.description
    )
    this.setMetaTag("twitter:image", config.twitterImage || config.ogImage)

    // Apply article-specific tags if provided
    if (config.articleAuthor) {
      this.setMetaTag("article:author", config.articleAuthor, true)
      this.setMetaTag(
        "article:published_time",
        config.articlePublishedTime,
        true
      )
      this.setMetaTag("article:modified_time", config.articleModifiedTime, true)
      this.setMetaTag("article:section", config.articleSection, true)

      config.articleTags?.forEach((tag, index) => {
        this.setMetaTag(`article:tag${index}`, tag, true)
      })
    }

    // Set canonical URL
    if (config.canonical) {
      this.setLinkTag("canonical", config.canonical, "canonical")
    }

    // Set alternate language URLs
    config.alternateUrls?.forEach(({ lang, href }) => {
      this.setLinkTag(`alternate-${lang}`, href, "alternate", {
        hreflang: lang,
      })
    })

    // Preload/prefetch resources
    config.preloadResources?.forEach(({ href, as, type }) => {
      const attributes: Record<string, string> = { as }
      if (type) attributes.type = type
      this.setLinkTag(`preload-${href}`, href, "preload", attributes)
    })

    config.prefetchUrls?.forEach((url) => {
      this.setLinkTag(`prefetch-${url}`, url, "prefetch")
    })

    // Apply structured data
    if (config.structuredData) {
      this.setStructuredData(config.structuredData)
    }

    // Return cleanup function
    return () => {
      this.cleanup()
    }
  }

  private setMetaTag(name: string, content?: string, isProperty = false): void {
    if (!content) return

    const attribute = isProperty ? "property" : "name"
    const selector = `meta[${attribute}="${name}"]`

    let meta = document.querySelector(selector) as HTMLMetaElement

    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute(attribute, name)
      document.head.appendChild(meta)
    }

    meta.setAttribute("content", content)
    this.metaTags.set(name, meta)
  }

  private setLinkTag(
    key: string,
    href: string,
    rel: string,
    attributes: Record<string, string> = {}
  ): void {
    const existingLink = document.querySelector(
      `link[rel="${rel}"][href="${href}"]`
    ) as HTMLLinkElement

    if (existingLink) {
      this.linkTags.set(key, existingLink)
      return
    }

    const link = document.createElement("link")
    link.rel = rel
    link.href = href

    Object.entries(attributes).forEach(([attr, value]) => {
      link.setAttribute(attr, value)
    })

    document.head.appendChild(link)
    this.linkTags.set(key, link)
  }

  private setStructuredData(data: any): void {
    // Remove existing structured data
    if (this.structuredDataScript) {
      document.head.removeChild(this.structuredDataScript)
    }

    // Create new structured data script
    this.structuredDataScript = document.createElement("script")
    this.structuredDataScript.type = "application/ld+json"
    this.structuredDataScript.textContent = JSON.stringify(data)
    document.head.appendChild(this.structuredDataScript)
  }

  private cleanup(): void {
    // Reset to default title if needed
    if (document.title !== "Theodoros Mentis - Senior Full Stack Developer") {
      document.title = "Theodoros Mentis - Senior Full Stack Developer"
    }
  }

  // Generate structured data for different content types
  generatePersonSchema(config: {
    name: string
    jobTitle: string
    email: string
    url: string
    image: string
    skills: string[]
    location: string
    description: string
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: config.name,
      jobTitle: config.jobTitle,
      email: config.email,
      url: config.url,
      image: config.image,
      knowsAbout: config.skills,
      address: {
        "@type": "Place",
        addressLocality: config.location,
      },
      description: config.description,
      sameAs: [
        // Social media profiles can be added here
      ],
    }
  }

  generateWebsiteSchema(config: {
    name: string
    url: string
    description: string
    author: string
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Website",
      name: config.name,
      url: config.url,
      description: config.description,
      author: {
        "@type": "Person",
        name: config.author,
      },
      inLanguage: "en-US",
    }
  }

  generatePortfolioSchema(
    projects: Array<{
      name: string
      description: string
      url: string
      technologies: string[]
      dateCreated: string
    }>
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Theodore Mentis Portfolio",
      description: "Portfolio showcasing web development projects and skills",
      creator: {
        "@type": "Person",
        name: "Theodore Mentis",
      },
      hasPart: projects.map((project) => ({
        "@type": "SoftwareApplication",
        name: project.name,
        description: project.description,
        url: project.url,
        programmingLanguage: project.technologies,
        dateCreated: project.dateCreated,
      })),
    }
  }

  // Core Web Vitals optimization helpers
  optimizeCorewWebVitals() {
    // Preload critical resources
    this.preloadCriticalResources()

    // Optimize fonts
    this.optimizeFonts()

    // Add resource hints
    this.addResourceHints()
  }

  private preloadCriticalResources() {
    const criticalResources = [
      { href: "/portfolio/src/assets/images/teo.png", as: "image" },
      {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
        as: "style",
      },
    ]

    criticalResources.forEach(({ href, as }) => {
      this.setLinkTag(`preload-${href}`, href, "preload", { as })
    })
  }

  private optimizeFonts() {
    // Font display optimization
    const fontLinks = document.querySelectorAll(
      'link[href*="fonts.googleapis.com"]'
    )
    fontLinks.forEach((link) => {
      if (!link.getAttribute("href")?.includes("display=")) {
        const href = link.getAttribute("href")
        if (href) {
          link.setAttribute("href", `${href}&display=swap`)
        }
      }
    })
  }

  private addResourceHints() {
    const domains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "cdn.jsdelivr.net",
    ]

    domains.forEach((domain) => {
      this.setLinkTag(`dns-prefetch-${domain}`, `//${domain}`, "dns-prefetch")
    })
  }
}

// React hook for enhanced SEO
export function useEnhancedSEO(config: EnhancedSEOConfig) {
  useEffect(() => {
    const seoManager = SEOManager.getInstance()
    const cleanup = seoManager.applySEO(config)

    return cleanup
  }, [
    config.title,
    config.description,
    config.ogImage,
    config.canonical,
    JSON.stringify(config.keywords),
    JSON.stringify(config.structuredData),
  ])
}

// Utility functions for generating SEO-optimized content
export class SEOUtils {
  // Generate SEO-friendly title
  static generateTitle(
    pageName: string,
    siteName = "Theodoros Mentis"
  ): string {
    return `${pageName} | ${siteName} - Senior Full Stack Developer`
  }

  // Generate meta description with optimal length
  static generateDescription(content: string, maxLength = 160): string {
    if (content.length <= maxLength) return content

    const trimmed = content.substring(0, maxLength - 3)
    const lastSpace = trimmed.lastIndexOf(" ")

    return trimmed.substring(0, lastSpace) + "..."
  }

  // Generate keywords array from text
  static extractKeywords(text: string, maxKeywords = 10): string[] {
    const commonWords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ]

    const wordCounts = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word))
      .reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      }, {})

    return Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  }

  // Validate and optimize Open Graph image
  static async validateOGImage(imageUrl: string): Promise<boolean> {
    // Basic validation for OG image requirements
    const img = new Image()
    img.src = imageUrl

    return new Promise<boolean>((resolve) => {
      img.onload = () => {
        const isValidSize = img.width >= 1200 && img.height >= 630
        const hasCorrectRatio = Math.abs(img.width / img.height - 1.91) < 0.1
        resolve(isValidSize && hasCorrectRatio)
      }
      img.onerror = () => resolve(false)
    })
  }
}

// Export singleton instance
export const seoManager = SEOManager.getInstance()

// Default SEO configuration for the portfolio
export const defaultSEOConfig: EnhancedSEOConfig = {
  title: "Theodoros Mentis - Senior Full Stack Developer Portfolio",
  description:
    "Senior Full Stack Developer with 15+ years of experience in WordPress, React, and modern web technologies. Specializing in scalable web solutions and server administration.",
  keywords: [
    "full stack developer",
    "wordpress expert",
    "react developer",
    "web development",
    "javascript",
    "typescript",
    "php",
    "mysql",
    "theodoros mentis",
    "portfolio",
  ],
  ogTitle: "Theodoros Mentis - Senior Full Stack Developer",
  ogDescription:
    "Experienced developer creating seamless web experiences with WordPress, React, and modern web technologies.",
  ogImage: "/src/assets/images/teo.png",
  ogType: "profile",
  ogSiteName: "Theodore Mentis Portfolio",
  twitterCard: "summary_large_image",
  twitterCreator: "@your_twitter",
  robots: "index,follow,max-image-preview:large",
  language: "en-US",
}
