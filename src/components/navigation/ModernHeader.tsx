import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn, typography } from "../../utils/styles"
import ModernNav from "../navigation/ModernNav"

interface ModernHeaderProps {
  className?: string
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 20)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Set initial state

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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
          "container flex items-center justify-between",
          "py-4 px-6"
        )}
      >
        <motion.a
          href="#hero"
          className="flex items-center gap-4 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.preventDefault()
            const heroSection = document.getElementById("hero")
            if (heroSection) {
              heroSection.scrollIntoView({ behavior: "smooth" })
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          }}
          aria-label="Go to homepage"
        >

          <motion.div
            className="block" // Show title on all screen sizes
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              className={cn(
                typography.heading.h4,
                "font-bold text-text-primary leading-tight",
                "group-hover:text-primary transition-colors duration-200",
                "text-base sm:text-lg lg:text-xl xl:text-2xl"
              )}
            >
              <span className="text-text-primary">Theodoros</span>{" "}
              <span className="text-text-primary">Mentis</span>
            </h1>
            <p
              className={cn(
                typography.body.small,
                "text-text-muted opacity-80 hidden lg:block",
                "text-xs lg:text-sm"
              )}
            >
              Full Stack Developer • WordPress Expert
            </p>
          </motion.div>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ModernNav />
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
        style={{
          scaleX:
            typeof window !== "undefined"
              ? Math.min(
                  window.scrollY /
                    (document.documentElement.scrollHeight -
                      window.innerHeight),
                  1
                )
              : 0,
        }}
        transition={{ duration: 0.1 }}
      />
    </motion.header>
  )
}

export default ModernHeader
