import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { validateImageSrc } from "../../utils/validation"
import { cn, typography } from "../../utils/styles"
import ModernNav from "../navigation/ModernNav"
import logo from "../../assets/images/gteo.webp"

interface ModernHeaderProps {
  className?: string
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const logoSrc = validateImageSrc(logo, "Portfolio Logo")

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
            className="relative"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={cn(
                "relative w-12 h-12 rounded-full overflow-hidden",
                "border-2 border-primary/20 shadow-lg",
                "before:absolute before:inset-0 before:bg-gradient-to-br",
                "before:from-primary/10 before:to-accent/10 before:rounded-full"
              )}
            >
              <img
                src={logoSrc}
                alt="Theodoros Mentis Portfolio Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover relative z-10"
                loading="eager"
              />
            </div>

            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          </motion.div>

          <motion.div
            className="hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              className={cn(
                typography.heading.h4,
                "font-bold text-text-primary leading-tight",
                "group-hover:text-primary transition-colors duration-200"
              )}
            >
              <span className="text-text-primary">Theodoros</span>{" "}
              <span className="text-text-primary">Mentis</span>
            </h1>
            <p
              className={cn(
                typography.body.small,
                "text-text-muted opacity-80 hidden md:block"
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
