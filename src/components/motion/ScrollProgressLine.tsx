import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "../../utils/styles"
import useReducedMotion from "../../hooks/useReducedMotion"

export type ScrollProgressLineProps = {
  orientation?: "vertical" | "horizontal"
  className?: string
  trackClassName?: string
  fillClassName?: string
}

const ScrollProgressLine: React.FC<ScrollProgressLineProps> = ({
  orientation = "vertical",
  className,
  trackClassName,
  fillClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  })

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  const isVertical = orientation === "vertical"

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        isVertical ? "h-full min-h-[200px] w-px" : "h-px w-full min-w-[200px]",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute bg-[var(--v2-line)]",
          isVertical ? "inset-y-0 left-0 w-full" : "inset-x-0 top-0 h-full",
          trackClassName
        )}
      />
      <motion.div
        className={cn(
          "absolute origin-top bg-[var(--v2-acid)]",
          isVertical ? "inset-x-0 top-0 w-full" : "inset-y-0 left-0 h-full",
          fillClassName
        )}
        style={
          prefersReducedMotion
            ? isVertical
              ? { scaleY: 1, height: "100%" }
              : { scaleX: 1, width: "100%" }
            : isVertical
              ? { scaleY, height: "100%" }
              : { scaleX, width: "100%" }
        }
      />
    </div>
  )
}

export default ScrollProgressLine
