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
        <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
          {animate ? displayValue : value}
        </p>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
          {label}
        </p>
      </SurfaceCard>
    </motion.div>
  )
}

export default StatBlock
