import { motion, type MotionProps } from "framer-motion"
import React from "react"

export const animationVariants = {
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  },

  hoverScale: {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    whileTap: { scale: 0.98 },
  },

  cardFloat: {
    initial: { y: 0 },
    whileHover: {
      y: -8,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  },

  reveal: {
    initial: { opacity: 0, y: 50 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    viewport: { once: true, margin: "-100px" },
  },

  textReveal: {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
      },
    }),
  },

  magnetic: {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    whileTap: { scale: 0.95 },
  },
} as const

interface AnimatedContainerProps extends MotionProps {
  children: React.ReactNode
  variant?: keyof typeof animationVariants
  className?: string
}

type AnimationVariant =
  (typeof animationVariants)[keyof typeof animationVariants]

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  variant = "reveal",
  className,
  ...props
}) => {
  const variants = animationVariants[variant] as AnimationVariant

  const viewport = (
    variants as { viewport?: { once: boolean; margin: string } }
  ).viewport || { once: true, margin: "-50px" }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      whileInView="whileInView"
      whileHover="whileHover"
      whileTap="whileTap"
      viewport={viewport}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerContainer: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={animationVariants.staggerContainer}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: "-50px" }}
  >
    {children}
  </motion.div>
)

export const StaggerItem: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <motion.div className={className} variants={animationVariants.staggerItem}>
    {children}
  </motion.div>
)

export const FloatingCard: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={animationVariants.cardFloat}
    initial="initial"
    whileHover="whileHover"
    style={{
      transformStyle: "preserve-3d",
    }}
  >
    {children}
  </motion.div>
)

export const AnimatedText: React.FC<{
  text: string
  className?: string
  delay?: number
}> = ({ text, className, delay = 0 }) => {
  const words = text.split(" ")

  return (
    <motion.div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i + delay}
          variants={animationVariants.textReveal}
          initial="initial"
          animate="animate"
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export const MagneticButton: React.FC<{
  children: React.ReactNode
  className?: string
  strength?: number
}> = ({ children, className, strength = 10 }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const ref = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) / rect.width
    const deltaY = (e.clientY - centerY) / rect.height

    setMousePosition({
      x: deltaX * strength,
      y: deltaY * strength,
    })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      variants={animationVariants.magnetic}
      whileHover="whileHover"
      whileTap="whileTap"
    >
      {children}
    </motion.div>
  )
}

export const useViewTransition = () => {
  const startTransition = React.useCallback((callback: () => void) => {
    if ("startViewTransition" in document) {
      document.startViewTransition(callback)
    } else {
      callback()
    }
  }, [])

  return { startTransition }
}

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

export const PageTransition: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={animationVariants.pageEnter}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
)

export const ScrollReveal: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }}
    viewport={{ once: true, margin: "-100px" }}
  >
    {children}
  </motion.div>
)

export default animationVariants
