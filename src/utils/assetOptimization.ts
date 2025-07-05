

import { useEffect, useRef, useState } from "react"
export function useProgressiveImage(src: string, fallback?: string) {
  const [currentSrc, setCurrentSrc] = useState(fallback || "")
  const [isLoading, setIsLoading] = useState(!!src) // Only loading if we have a src
  const [hasError, setHasError] = useState(false)
  const imageRef = useRef<HTMLImageElement>()

  useEffect(() => {
    if (!src) {
      setIsLoading(false)
      return
    }
    const img = new Image()
    imageRef.current = img
    if (img.complete && img.naturalWidth > 0) {
      setCurrentSrc(src)
      setIsLoading(false)
      setHasError(false)
      return
    }

    setIsLoading(true)
    setHasError(false)

    img.onload = () => {
      setCurrentSrc(src)
      setIsLoading(false)
      setHasError(false)
    }

    img.onerror = () => {
      setIsLoading(false)
      setHasError(true)
      if (fallback) {
        setCurrentSrc(fallback)
      }
    }

    img.src = src

    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null
        imageRef.current.onerror = null
      }
    }
  }, [src, fallback])

  return { src: currentSrc, isLoading, hasError }
}
export function generateResponsiveSizes(
  breakpoints: { [key: string]: number } = {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    large: 1440,
  }
): string {
  const sizes = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([, width], index, arr) => {
      if (index === arr.length - 1) {
        return `${width}px`
      }
      return `(max-width: ${width}px) ${width}px`
    })

  return sizes.join(", ")
}
export function useWebPSupport() {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null)

  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setSupportsWebP(false)
      return
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, 1, 1)

    try {
      const dataURL = canvas.toDataURL("image/webp")
      setSupportsWebP(dataURL.indexOf("data:image/webp") === 0)
    } catch {
      setSupportsWebP(false)
    }
  }, [])

  return supportsWebP
}
export interface OptimizedImageProps {
  src: string
  alt: string
  webpSrc?: string
  fallbackSrc?: string
  sizes?: string
  loading?: "lazy" | "eager"
  className?: string
  onLoad?: () => void
  onError?: () => void
  placeholder?: string
  blur?: boolean
}
export function getOptimizedImageSrc(
  baseSrc: string,
  webpSrc?: string,
  supportsWebP?: boolean | null
): string {
  if (supportsWebP && webpSrc) {
    return webpSrc
  }
  return baseSrc
}
export function useFontLoading(fontFamily: string, timeout: number = 3000) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!document.fonts) {
      setIsLoaded(true)
      return
    }

    const timeoutId = setTimeout(() => {
      setHasError(true)
    }, timeout)

    document.fonts.ready
      .then(() => {
        clearTimeout(timeoutId)
        const hasFont = Array.from(document.fonts).some(
          (font) => font.family === fontFamily && font.status === "loaded"
        )
        setIsLoaded(hasFont)
        if (!hasFont) {
          setHasError(true)
        }
      })
      .catch(() => {
        clearTimeout(timeoutId)
        setHasError(true)
      })

    return () => clearTimeout(timeoutId)
  }, [fontFamily, timeout])

  return { isLoaded, hasError }
}
export function preloadResource(
  href: string,
  as: "style" | "script" | "font" | "image" | "document" = "script",
  crossorigin?: "anonymous" | "use-credentials"
) {
  const link = document.createElement("link")
  link.rel = "preload"
  link.href = href
  link.as = as

  if (crossorigin) {
    link.crossOrigin = crossorigin
  }

  if (as === "font") {
    link.crossOrigin = "anonymous"
  }

  document.head.appendChild(link)
}
export function prefetchResource(href: string) {
  const link = document.createElement("link")
  link.rel = "prefetch"
  link.href = href
  document.head.appendChild(link)
}
export function inlineCriticalCSS(css: string) {
  const style = document.createElement("style")
  style.type = "text/css"
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}
export function useLazyImage(
  ref: React.RefObject<HTMLImageElement>,
  src: string,
  options: IntersectionObserverInit = {}
) {
  const [imageSrc, setImageSrc] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observer.unobserve(element)
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, src, options])

  useEffect(() => {
    if (imageSrc && ref.current) {
      const img = ref.current
      const handleLoad = () => setIsLoaded(true)

      img.addEventListener("load", handleLoad)
      return () => img.removeEventListener("load", handleLoad)
    }
  }, [imageSrc, ref])

  return { imageSrc, isLoaded }
}
export class ResourceHintsManager {
  private static preloadedResources = new Set<string>()
  private static prefetchedResources = new Set<string>()

  static preload(href: string, as: string, crossorigin?: string) {
    if (this.preloadedResources.has(href)) return

    this.preloadedResources.add(href)
    preloadResource(href, as as any, crossorigin as any)
  }

  static prefetch(href: string) {
    if (this.prefetchedResources.has(href)) return

    this.prefetchedResources.add(href)
    prefetchResource(href)
  }

  static preloadImage(src: string) {
    this.preload(src, "image")
  }

  static preloadFont(src: string) {
    this.preload(src, "font", "anonymous")
  }

  static preloadScript(src: string) {
    this.preload(src, "script")
  }

  static preloadStyle(src: string) {
    this.preload(src, "style")
  }

  static clear() {
    this.preloadedResources.clear()
    this.prefetchedResources.clear()
  }
}
export const ImageOptimization = {
  generateSrcSet(
    basePath: string,
    sizes: number[],
    format: string = "webp"
  ): string {
    return sizes
      .map((size) => `${basePath}-${size}w.${format} ${size}w`)
      .join(", ")
  },
  getOptimalSize(
    containerWidth: number,
    devicePixelRatio: number = window.devicePixelRatio
  ): number {
    const targetWidth = containerWidth * devicePixelRatio
    const standardSizes = [320, 480, 640, 768, 1024, 1280, 1600, 1920]

    return (
      standardSizes.find((size) => size >= targetWidth) ||
      standardSizes[standardSizes.length - 1]
    )
  },
  createImageProps(
    src: string,
    alt: string,
    containerWidth: number,
    options: {
      hasWebP?: boolean
      sizes?: string
      loading?: "lazy" | "eager"
      placeholder?: string
    } = {}
  ): OptimizedImageProps {
    const { hasWebP = true, sizes, loading = "lazy", placeholder } = options
    const optimalSize = this.getOptimalSize(containerWidth)

    return {
      src: `${src}-${optimalSize}w.jpg`,
      webpSrc: hasWebP ? `${src}-${optimalSize}w.webp` : undefined,
      alt,
      sizes: sizes || generateResponsiveSizes(),
      loading,
      placeholder,
    }
  },
}
export const FontOptimization = {
  preloadCriticalFonts() {
    const criticalFonts = ["/fonts/inter-var.woff2", "/fonts/fira-code.woff2"]

    criticalFonts.forEach((font) => {
      ResourceHintsManager.preloadFont(font)
    })
  },
  applyFontDisplay(
    strategy: "auto" | "block" | "swap" | "fallback" | "optional" = "swap"
  ) {
    const style = document.createElement("style")
    style.textContent = `
      @font-face {
        font-display: ${strategy};
      }
    `
    document.head.appendChild(style)
  },
  getFontSubsetConfig(languages: string[] = ["en"]) {
    const subsets: Record<string, string> = {
      en: "U+0020-007F",
      es: "U+0020-007F,U+00A1,U+00A9,U+00AB,U+00AE,U+00B0-00B3,U+00B7,U+00BB,U+00BF,U+00C0-00D6,U+00D8-00F6,U+00F8-017F",
      fr: "U+0020-007F,U+00A0-00FF,U+0152-0153,U+0178,U+02C6,U+02DC",
      de: "U+0020-007F,U+00A0-00FF,U+0152-0153,U+1E9E,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122",
    }

    return languages.map((lang) => subsets[lang] || subsets.en).join(",")
  },
}

export default {
  useProgressiveImage,
  generateResponsiveSizes,
  useWebPSupport,
  getOptimizedImageSrc,
  useFontLoading,
  preloadResource,
  prefetchResource,
  inlineCriticalCSS,
  useLazyImage,
  ResourceHintsManager,
  ImageOptimization,
  FontOptimization,
}
