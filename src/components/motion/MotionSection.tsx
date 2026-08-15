import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../utils/styles"
import { useMotionConfig, type MotionDirection } from "../../hooks/useMotionConfig"

type MotionSectionElement = "section" | "div" | "article"

export type MotionSectionProps = {
  as?: MotionSectionElement
  delay?: number
  direction?: MotionDirection
  className?: string
  children: React.ReactNode
  id?: string
  "aria-labelledby"?: string
  "aria-label"?: string
}

const MotionSection: React.FC<MotionSectionProps> = ({
  as = "section",
  delay = 0,
  direction = "up",
  className,
  children,
  id,
  "aria-labelledby": ariaLabelledby,
  "aria-label": ariaLabel,
}) => {
  const { sectionReveal } = useMotionConfig()
  const revealProps = sectionReveal(direction, delay)
  const sharedProps = {
    id,
    "aria-labelledby": ariaLabelledby,
    "aria-label": ariaLabel,
    className: cn(className),
    ...revealProps,
  }

  if (as === "div") {
    return <motion.div {...sharedProps}>{children}</motion.div>
  }

  if (as === "article") {
    return <motion.article {...sharedProps}>{children}</motion.article>
  }

  return <motion.section {...sharedProps}>{children}</motion.section>
}

export default MotionSection
