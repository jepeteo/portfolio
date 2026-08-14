import { useMemo } from "react"
import useReducedMotion from "./useReducedMotion"

export type MotionDirection = "up" | "left" | "right" | "down"

const directionOffset: Record<
  MotionDirection,
  { x: number; y: number }
> = {
  up: { x: 0, y: 16 },
  down: { x: 0, y: -16 },
  left: { x: 16, y: 0 },
  right: { x: -16, y: 0 },
}

const STAGGER_CAP = 0.2

export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion()

  return useMemo(
    () => ({
      prefersReducedMotion,
      fadeUp: prefersReducedMotion
        ? {
            initial: false,
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            viewport: { once: true, margin: "-40px" },
          },
      sectionReveal: (
        direction: MotionDirection = "up",
        delay = 0
      ) => {
        const offset = directionOffset[direction]
        if (prefersReducedMotion) {
          return {
            initial: false,
            animate: { opacity: 1, x: 0, y: 0 },
            transition: { duration: 0 },
          }
        }
        return {
          initial: { opacity: 0, x: offset.x, y: offset.y },
          whileInView: { opacity: 1, x: 0, y: 0 },
          transition: {
            duration: 0.35,
            delay: Math.min(delay, STAGGER_CAP),
            ease: [0.22, 1, 0.36, 1] as const,
          },
          viewport: { once: true, margin: "-60px" },
        }
      },
      cardHover: prefersReducedMotion
        ? {}
        : {
            whileHover: { y: -4, transition: { duration: 0.2 } },
          },
      lineDraw: prefersReducedMotion
        ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
        : {
            initial: { pathLength: 0 },
            whileInView: { pathLength: 1 },
            transition: { duration: 0.45, ease: "easeOut" as const },
            viewport: { once: true },
          },
      stagger: (index: number, base = 0.05) =>
        prefersReducedMotion ? 0 : Math.min(index * base, STAGGER_CAP),
      pulseClass: prefersReducedMotion ? "" : "animate-soft-pulse",
      hoverScale: prefersReducedMotion ? undefined : { scale: 1.02 },
    }),
    [prefersReducedMotion]
  )
}

export default useMotionConfig
