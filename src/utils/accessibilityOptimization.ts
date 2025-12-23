import { useEffect, useRef, useState, useCallback } from "react"

export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    selector?: string
    loop?: boolean
    autoFocus?: boolean
  } = {}
) {
  const {
    selector = '[tabindex]:not([tabindex="-1"]), button, input, select, textarea, a[href]',
    loop = true,
    autoFocus = false,
  } = options
  const [currentIndex, setCurrentIndex] = useState(0)
  const focusableElements = useRef<Element[]>([])

  const updateFocusableElements = useCallback(() => {
    if (containerRef.current) {
      focusableElements.current = Array.from(
        containerRef.current.querySelectorAll(selector)
      )
    }
  }, [containerRef, selector])

  const focusElement = useCallback((index: number) => {
    const element = focusableElements.current[index] as HTMLElement
    if (element) {
      element.focus()
      setCurrentIndex(index)
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return

      const elements = focusableElements.current
      if (elements.length === 0) return

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight": {
          event.preventDefault()
          const nextIndex = loop
            ? (currentIndex + 1) % elements.length
            : Math.min(currentIndex + 1, elements.length - 1)
          focusElement(nextIndex)
          break
        }

        case "ArrowUp":
        case "ArrowLeft": {
          event.preventDefault()
          const prevIndex = loop
            ? currentIndex === 0
              ? elements.length - 1
              : currentIndex - 1
            : Math.max(currentIndex - 1, 0)
          focusElement(prevIndex)
          break
        }

        case "Home":
          event.preventDefault()
          focusElement(0)
          break

        case "End":
          event.preventDefault()
          focusElement(elements.length - 1)
          break
      }
    },
    [currentIndex, loop, focusElement]
  )

  useEffect(() => {
    updateFocusableElements()

    if (autoFocus && focusableElements.current.length > 0) {
      focusElement(0)
    }
  }, [updateFocusableElements, autoFocus, focusElement])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    currentIndex,
    focusableElements: focusableElements.current,
    updateFocusableElements,
    focusElement,
  }
}

export function useFocusManagement() {
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus()
      lastFocusedElement.current = null
    }
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener("keydown", handleTabKey)

    return () => {
      container.removeEventListener("keydown", handleTabKey)
    }
  }, [])

  return { saveFocus, restoreFocus, trapFocus }
}

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return prefersReducedMotion
}

export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)")
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return prefersHighContrast
}

export function useScreenReader() {
  const announceRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!announceRef.current) {
      const announcer = document.createElement("div")
      announcer.setAttribute("aria-live", "polite")
      announcer.setAttribute("aria-atomic", "true")
      announcer.className = "sr-only"
      announcer.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `
      document.body.appendChild(announcer)
      announceRef.current = announcer
    }

    return () => {
      if (announceRef.current && announceRef.current.parentNode) {
        announceRef.current.parentNode.removeChild(announceRef.current)
      }
    }
  }, [])

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (announceRef.current) {
        announceRef.current.setAttribute("aria-live", priority)
        announceRef.current.textContent = message

        setTimeout(() => {
          if (announceRef.current) {
            announceRef.current.textContent = ""
          }
        }, 1000)
      }
    },
    []
  )

  return { announce }
}

export function useSkipLinks() {
  const skipLinkRef = useRef<HTMLAnchorElement | null>(null)

  const createSkipLink = useCallback(
    (target: string, text: string = "Skip to main content") => {
      if (!skipLinkRef.current) {
        const skipLink = document.createElement("a")
        skipLink.href = `#${target}`
        skipLink.textContent = text
        skipLink.className = "skip-link"
        skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 999999;
        padding: 8px 16px;
        background: #000;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s ease;
      `

        skipLink.addEventListener("focus", () => {
          skipLink.style.top = "6px"
        })

        skipLink.addEventListener("blur", () => {
          skipLink.style.top = "-40px"
        })

        document.body.insertBefore(skipLink, document.body.firstChild)
        skipLinkRef.current = skipLink
      }
    },
    []
  )

  useEffect(() => {
    return () => {
      if (skipLinkRef.current && skipLinkRef.current.parentNode) {
        skipLinkRef.current.parentNode.removeChild(skipLinkRef.current)
      }
    }
  }, [])

  return { createSkipLink }
}

export const ColorContrast = {
  getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  },

  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1)
    const lum2 = this.getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  },

  meetsWCAG(
    color1: string,
    color2: string,
    level: "AA" | "AAA" = "AA",
    size: "normal" | "large" = "normal"
  ): boolean {
    const ratio = this.getContrastRatio(color1, color2)

    if (level === "AAA") {
      return size === "large" ? ratio >= 4.5 : ratio >= 7
    }

    return size === "large" ? ratio >= 3 : ratio >= 4.5
  },

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  },
}

export function useAccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { announce } = useScreenReader()

  const validateField = useCallback(
    (name: string, value: string, rules: { required?: boolean; email?: boolean; minLength?: number }) => {
      let error = ""

      if (rules.required && !value.trim()) {
        error = `${name} is required`
      } else if (rules.email && value && !isValidEmail(value)) {
        error = `Please enter a valid email address`
      } else if (rules.minLength && value.length < rules.minLength) {
        error = `${name} must be at least ${rules.minLength} characters`
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))

      if (error) {
        announce(`Error in ${name}: ${error}`, "assertive")
      }

      return !error
    },
    [announce]
  )

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return { errors, validateField }
}

export function createLiveRegion(
  politeness: "polite" | "assertive" | "off" = "polite",
  atomic: boolean = true
): HTMLDivElement {
  const liveRegion = document.createElement("div")
  liveRegion.setAttribute("aria-live", politeness)
  liveRegion.setAttribute("aria-atomic", atomic.toString())
  liveRegion.className = "sr-only"
  liveRegion.style.cssText = `
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `

  document.body.appendChild(liveRegion)
  return liveRegion
}

export const A11yChecker = {
  checkImages(): string[] {
    const issues: string[] = []
    const images = document.querySelectorAll("img")

    images.forEach((img, index) => {
      if (
        !img.alt &&
        !img.hasAttribute("aria-label") &&
        !img.hasAttribute("aria-hidden")
      ) {
        issues.push(`Image ${index + 1} is missing alt text`)
      }
    })

    return issues
  },

  checkHeadings(): string[] {
    const issues: string[] = []
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    let previousLevel = 0

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1])

      if (index === 0 && level !== 1) {
        issues.push("Page should start with h1")
      }

      if (level > previousLevel + 1) {
        issues.push(`Heading level jumps from h${previousLevel} to h${level}`)
      }

      previousLevel = level
    })

    return issues
  },

  checkKeyboardAccess(): string[] {
    const issues: string[] = []
    const interactiveElements = document.querySelectorAll(
      "button, a, input, select, textarea"
    )

    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute("tabindex")
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(
          `Element ${
            index + 1
          } has positive tabindex, which can cause confusion`
        )
      }

      if (!element.hasAttribute("aria-label") && !element.textContent?.trim()) {
        issues.push(`Interactive element ${index + 1} has no accessible name`)
      }
    })

    return issues
  },

  runAllChecks(): { images: string[]; headings: string[]; keyboard: string[] } {
    return {
      images: this.checkImages(),
      headings: this.checkHeadings(),
      keyboard: this.checkKeyboardAccess(),
    }
  },
}

export default {
  useKeyboardNavigation,
  useFocusManagement,
  useReducedMotion,
  useHighContrast,
  useScreenReader,
  useSkipLinks,
  ColorContrast,
  useAccessibleForm,
  createLiveRegion,
  A11yChecker,
}
