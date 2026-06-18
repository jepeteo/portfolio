import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../utils/styles"
import { useCountUp } from "../../hooks/useCountUp"
import SurfaceCard from "./SurfaceCard"

type StatBlockProps = {
  value: string
  label: string
  index?: number
  animate?: boolean
  className?: string
}

const StatBlock: React.FC<StatBlockProps> = ({
  value,
  label,
  index = 0,
  animate = true,
  className,
}) => {
  const { displayValue, ref } = useCountUp({
    value,
    enabled: animate,
    delay: index * 120,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <SurfaceCard className={cn("p-6 text-center", className)}>
        <p className="mb-2 font-display text-3xl font-bold tracking-tight text-[var(--v2-text)] md:text-4xl">
          {animate ? displayValue : value}
        </p>
        <p className="text-sm text-[var(--v2-muted)] md:text-base">{label}</p>
      </SurfaceCard>
    </motion.div>
  )
}

export default StatBlock
