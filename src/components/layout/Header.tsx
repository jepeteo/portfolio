import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn, typography } from "../../utils/styles"
import { site } from "../../config/site"
import Nav from "./Nav"
import useReducedMotion from "../../hooks/useReducedMotion"

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 20)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "sticky top-0 left-0 right-0 z-[9999]",
        "border-b backdrop-blur-xl",
        "transition-all duration-300 ease-in-out",
        "supports-[backdrop-filter]:bg-surface-primary/60",
        isScrolled
          ? "bg-surface-primary/95 shadow-lg shadow-black/10 border-border/80 backdrop-blur-xl"
          : "bg-surface-primary/80 border-border/30 backdrop-blur-sm",
        className
      )}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        willChange: "transform",
      }}
    >
      {" "}
      <div
        className={cn(
          "container flex items-center justify-between px-6",
          isScrolled ? "py-2.5" : "py-4"
        )}
      >
        <motion.a
          href="/"
          className="flex items-center gap-4 cursor-pointer group"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.preventDefault()
            navigate("/")
          }}
          aria-label="Theodoros Mentis"
          title="Go to homepage"
        >
          <motion.div
            className="block"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0 }}
          >
            <div
              className={`font-display font-bold leading-tight tracking-tight text-[var(--v2-text)] transition-colors duration-200 group-hover:text-[var(--v2-acid)] ${
                isScrolled
                  ? "text-sm sm:text-base lg:text-lg xl:text-xl"
                  : "text-base sm:text-lg lg:text-xl xl:text-2xl"
              }`}
            >
              <span>Theodoros</span> <span>Mentis</span>
            </div>
            <p
              className={cn(
                typography.body.small,
                "text-text-muted opacity-80 hidden lg:block",

                "text-xs lg:text-sm"
              )}
            >
              {site.title} • WordPress & Systems
            </p>
          </motion.div>
        </motion.a>

        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0 }}
          className="flex items-center"
        >
          <Nav />
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--v2-line-strong)] to-transparent"
        initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          delay: 0,
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 origin-left bg-[var(--v2-acid)]"
        style={prefersReducedMotion ? { scaleX: scrollYProgress } : { scaleX }}
      />
    </motion.header>
  )
}

export default Header
