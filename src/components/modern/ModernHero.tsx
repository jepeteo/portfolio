// Modern Hero Section (2025 Version)
import React from "react"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { Button } from "../ui/Button"
import { Icon, icons } from "../icons/ModernIcons"
import { AnimatedText, MagneticButton } from "../animations/AdvancedAnimations"
import { cn, typography, spacing } from "../../utils/styles"
import { useViewTransition } from "../../hooks/useViewTransition"
import { ProgressiveImage } from "../loading/ModernLoading"

const ModernHero: React.FC = () => {
  const { isDark } = useTheme()
  const { startTransition } = useViewTransition()

  const scrollToSection = (sectionId: string) => {
    startTransition(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center",
        spacing.container,
        "overflow-hidden"
      )}
      id="hero"
      style={{ viewTransitionName: "hero-section" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div
          className={cn(
            "absolute top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-20",
            "bg-gradient-to-br from-primary to-purple-500 blur-3xl"
          )}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className={cn(
            "absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full opacity-20",
            "bg-gradient-to-br from-blue-500 to-cyan-500 blur-3xl"
          )}
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text Content */}
        <motion.div className="space-y-8" variants={itemVariants}>
          {/* Greeting Badge */}
          <motion.div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
              "bg-background/80 backdrop-blur-sm",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👋
            </motion.div>
            <span className="text-sm font-medium">Hello, I'm Theodore</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <AnimatedText
              text="Senior Full Stack"
              className={cn(typography.heading.h1, "leading-tight")}
            />
            <motion.div className="relative" variants={itemVariants}>
              <AnimatedText
                text="Developer"
                className={cn(
                  typography.heading.h1,
                  "leading-tight bg-gradient-to-r from-primary via-purple-500 to-blue-500",
                  "bg-clip-text text-transparent animate-gradient-x"
                )}
                delay={0.5}
              />
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            className={cn(
              typography.body.large,
              isDark ? "text-gray-300" : "text-gray-600",
              "max-w-lg"
            )}
            variants={itemVariants}
          >
            Transforming complex problems into elegant solutions with modern web
            technologies. Specialized in React, TypeScript, and WordPress
            development.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <MagneticButton className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="gradient"
                className="w-full sm:w-auto group"
                onClick={() => scrollToSection("contact")}
                rightIcon={
                  <Icon
                    icon={icons.social.send}
                    className="transition-transform group-hover:translate-x-1"
                  />
                }
              >
                Get In Touch
              </Button>
            </MagneticButton>

            <MagneticButton className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto group"
                onClick={() => scrollToSection("projects")}
                rightIcon={
                  <Icon
                    icon={icons.navigation.arrowRight}
                    className="transition-transform group-hover:translate-x-1"
                  />
                }
              >
                View Projects
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Social Links */}
          <motion.div className="flex gap-4 pt-4" variants={itemVariants}>
            {[
              {
                icon: icons.social.github,
                href: "https://github.com/jepeteo",
                label: "GitHub",
              },
              {
                icon: icons.social.linkedin,
                href: "https://linkedin.com/in/thmentis",
                label: "LinkedIn",
              },
              {
                icon: icons.social.email,
                href: "mailto:th.mentis@gmail.com",
                label: "Email",
              },
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-full border transition-all duration-300",
                  "hover:scale-110 hover:shadow-lg",
                  isDark
                    ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                aria-label={social.label}
              >
                <Icon icon={social.icon} size="lg" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="relative flex justify-center lg:justify-end"
          variants={itemVariants}
        >
          <motion.div
            className="relative"
            variants={floatingVariants}
            animate="animate"
          >
            <motion.div
              className={cn(
                "relative rounded-3xl overflow-hidden shadow-2xl",
                "bg-gradient-to-br from-primary/20 to-purple-500/20 p-1"
              )}
              variants={imageVariants}
              whileHover="hover"
              style={{ viewTransitionName: "hero-image" }}
            >
              <ProgressiveImage
                src="/src/assets/images/new_programmer.webp"
                alt="Theodore Mentis - Senior Full Stack Developer"
                className="w-80 h-96 lg:w-96 lg:h-[28rem] rounded-3xl"
              />

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full backdrop-blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-8 h-8 bg-purple-500/20 rounded-full backdrop-blur-sm"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Floating tech icons */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { icon: icons.tech.code, position: "top-8 left-8", delay: 0 },
              {
                icon: icons.tech.database,
                position: "top-16 right-16",
                delay: 0.5,
              },
              {
                icon: icons.tech.server,
                position: "bottom-16 left-16",
                delay: 1,
              },
              {
                icon: icons.tech.globe,
                position: "bottom-8 right-8",
                delay: 1.5,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={cn(
                  "absolute p-3 rounded-xl backdrop-blur-sm border",
                  "bg-background/80 shadow-lg",
                  isDark ? "border-gray-700" : "border-gray-200",
                  item.position
                )}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + item.delay, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <Icon icon={item.icon} className="text-primary" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <motion.div
          className={cn(
            "p-2 rounded-full border cursor-pointer",
            isDark ? "border-gray-700" : "border-gray-200"
          )}
          onClick={() => scrollToSection("bio")}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon icon={icons.navigation.chevronDown} />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default ModernHero
