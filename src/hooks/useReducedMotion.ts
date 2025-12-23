import { useEffect, useState } from "react"

/**
 * useReducedMotion - Hook to detect user's motion preference
 *
 * Respects the user's system preference for reduced motion.
 * Use this to disable or simplify animations for users who prefer reduced motion.
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    return mediaQuery.matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Get animation props based on reduced motion preference
 *
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Animation configuration object
 */
export function getReducedMotionProps(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      // Disable spring animations
      transition: { duration: 0 },
      // Remove initial animations
      initial: false,
      // Disable hover/tap animations
      whileHover: undefined,
      whileTap: undefined,
      // Keep layout animations but instant
      layout: false,
    }
  }

  return {}
}

/**
 * Reduced motion variants for Framer Motion
 *
 * Use with AnimatePresence and motion components
 */
export const reducedMotionVariants = {
  // For fade animations
  fade: {
    reduced: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    },
    full: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },

  // For slide animations
  slideUp: {
    reduced: {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 1, y: 0 },
    },
    full: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
  },

  // For scale animations
  scale: {
    reduced: {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 1, scale: 1 },
    },
    full: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
}

export default useReducedMotion
