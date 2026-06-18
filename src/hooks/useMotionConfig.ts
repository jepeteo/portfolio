import { useMemo } from "react"
import useReducedMotion from "./useReducedMotion"

export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion()

  return useMemo(
    () => ({
      prefersReducedMotion,
      fadeUp: prefersReducedMotion
        ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            viewport: { once: true, margin: "-40px" },
          },
      stagger: (index: number, base = 0.1) =>
        prefersReducedMotion ? 0 : index * base,
      pulseClass: prefersReducedMotion ? "" : "animate-soft-pulse",
      hoverScale: prefersReducedMotion ? undefined : { scale: 1.02 },
    }),
    [prefersReducedMotion]
  )
}

export default useMotionConfig
