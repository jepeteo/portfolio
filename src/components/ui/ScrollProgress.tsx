import React, { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "../../utils/styles"

interface ScrollProgressProps {
  /** Position of the progress bar */
  position?: "top" | "bottom"
  /** Height of the progress bar in pixels */
  height?: number
  /** Whether to show percentage text */
  showPercentage?: boolean
  /** Color scheme - uses CSS gradient or solid color */
  colorScheme?: "gradient" | "primary" | "accent"
  /** Whether to hide when at top */
  hideAtTop?: boolean
  /** Additional className */
  className?: string
}

/**
 * ScrollProgress - Visual indicator of page scroll progress
 * 
 * Shows a progress bar that fills as the user scrolls through the page.
 * Useful for long-form content to give users a sense of their position.
 */
export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  position = "top",
  height = 3,
  showPercentage = false,
  colorScheme = "gradient",
  hideAtTop = true,
  className,
}) => {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const { scrollYProgress } = useScroll()
  
  // Smooth spring animation for the progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Track scroll percentage for conditional display and percentage text
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollPercentage(Math.round(latest * 100))
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  // Color scheme classes
  const colorClasses = {
    gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
    primary: "bg-primary",
    accent: "bg-accent",
  }

  // Don't render if hideAtTop is true and we're at the top
  if (hideAtTop && scrollPercentage < 1) {
    return null
  }

  return (
    <>
      <motion.div
        className={cn(
          "fixed left-0 right-0 z-50 origin-left",
          position === "top" ? "top-0" : "bottom-0",
          colorClasses[colorScheme],
          className
        )}
        style={{
          scaleX,
          height: `${height}px`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {showPercentage && (
        <motion.div
          className={cn(
            "fixed right-4 z-50 px-2 py-1 rounded-full",
            "bg-slate-900/80 dark:bg-slate-700/80 text-white text-xs font-medium",
            "backdrop-blur-sm shadow-lg",
            position === "top" ? "top-4" : "bottom-4"
          )}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          {scrollPercentage}%
        </motion.div>
      )}
    </>
  )
}

/**
 * ReadingProgress - Specialized progress bar for reading content
 * 
 * Shows reading progress with estimated time remaining.
 */
interface ReadingProgressProps extends ScrollProgressProps {
  /** Total word count of the content */
  wordCount?: number
  /** Average reading speed in words per minute */
  wordsPerMinute?: number
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  wordCount = 0,
  wordsPerMinute = 200,
  ...props
}) => {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const { scrollYProgress } = useScroll()
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollPercentage(Math.round(latest * 100))
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  // Calculate remaining reading time
  const totalMinutes = wordCount / wordsPerMinute
  const remainingMinutes = Math.ceil(totalMinutes * (1 - scrollPercentage / 100))

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <ScrollProgress {...props} hideAtTop={false} />
      {wordCount > 0 && scrollPercentage > 0 && scrollPercentage < 100 && (
        <motion.div
          className="absolute right-4 top-2 px-3 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-700/80 text-white text-xs font-medium backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {remainingMinutes} min left
        </motion.div>
      )}
    </div>
  )
}

export default ScrollProgress
