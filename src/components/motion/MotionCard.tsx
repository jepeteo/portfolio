import React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../../utils/styles"
import useMotionConfig from "../../hooks/useMotionConfig"

export type MotionCardProps = {
  index?: number
  staggerBase?: number
  enableHover?: boolean
  className?: string
  children: React.ReactNode
} & Omit<HTMLMotionProps<"div">, "children">

const MotionCard: React.FC<MotionCardProps> = ({
  index = 0,
  staggerBase = 0.05,
  enableHover = true,
  className,
  children,
  ...rest
}) => {
  const { fadeUp, stagger, cardHover, prefersReducedMotion } = useMotionConfig()

  return (
    <motion.div
      className={cn(
        "motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
      {...fadeUp}
      transition={{
        ...(typeof fadeUp.transition === "object" ? fadeUp.transition : {}),
        delay: stagger(index, staggerBase),
      }}
      {...(enableHover && !prefersReducedMotion ? cardHover : {})}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export default MotionCard
