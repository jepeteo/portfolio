import React, { memo, useEffect, useRef, useState } from "react"
import { useTheme } from "../context/ThemeContext"
import TypedText from "./TypedText"
import programmer from "/src/assets/images/new_programmer.webp"
import {
  useReducedMotion,
  useSkipLinks,
  useScreenReader,
} from "../utils/accessibilityOptimization"

const Hero: React.FC = memo(() => {
  const { isDark } = useTheme()
  const heroRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { announce } = useScreenReader()
  const { createSkipLink } = useSkipLinks()

  useEffect(() => {
    createSkipLink("main-content", "Skip to main content")
  }, []) // Remove dependency to prevent re-running

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            announce("Hero section loaded", "polite")
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, []) // Remove announce dependency to prevent re-creating observer

  return (
    <section
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center pt-24 pb-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${prefersReducedMotion ? "!transition-none" : ""}`}
      id="top"
      role="banner"
      aria-label="Hero section - Theodore Mentis, Senior Full Stack Developer"
    >
      
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
          }`}
        >
          
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(to_right,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.1)_1px,transparent_1px)]"
                : "bg-[linear-gradient(to_right,rgba(71,85,105,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.1)_1px,transparent_1px)]"
            } bg-[size:50px_50px]`}
          />

          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 ${
                  isDark ? "bg-blue-400/20" : "bg-blue-600/20"
                } rounded-full animate-pulse`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-between min-h-[85vh] lg:flex-row py-16">
        
        <div
          className={`flex-1 text-center lg:text-left transition-all duration-1000 delay-300 ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >
          
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              👋 Hello, I'm Theodore
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            role="heading"
            aria-level={1}
          >
            <span
              className={`block ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Senior
            </span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
              Full Stack
            </span>
            <span
              className={`block ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Developer
            </span>
          </h1>

          <div className="mb-8">
            <TypedText />
          </div>

          <p
            className={`text-lg md:text-xl mb-8 max-w-2xl ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            With 18+ years of experience crafting scalable web solutions, I
            specialize in WordPress, React, and modern web technologies. Let's
            build something extraordinary together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#projects"
              className={`group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
                isDark
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              } ${
                prefersReducedMotion ? "!transform-none !transition-none" : ""
              }`}
              role="button"
              aria-label="View my portfolio projects"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <a
              href="#contact"
              className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
                isDark
                  ? "border-slate-600 text-slate-300 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10"
                  : "border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50"
              } ${
                prefersReducedMotion ? "!transform-none !transition-none" : ""
              }`}
              role="button"
              aria-label="Contact Theodore Mentis"
            >
              Get In Touch
            </a>
          </div>

          <div
            className="mt-12"
            role="group"
            aria-labelledby="tech-stack-title"
          >
            <h2
              id="tech-stack-title"
              className={`text-sm font-medium mb-4 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Technologies I work with:
            </h2>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                "React",
                "TypeScript",
                "WordPress",
                "Node.js",
                "PHP",
                "MySQL",
              ].map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                  role="listitem"
                  aria-label={`Technology: ${tech}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`flex-1 lg:flex-none lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <div className="relative max-w-lg mx-auto">
            
            <div
              className={`absolute -inset-4 rounded-3xl ${
                isDark
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  : "bg-gradient-to-r from-blue-100 to-purple-100"
              } blur-xl animate-pulse`}
            />

            <div
              className={`relative rounded-3xl overflow-hidden ${
                isDark
                  ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700"
                  : "bg-white/50 backdrop-blur-sm border border-slate-200"
              }`}
            >
              <img
                ref={imageRef}
                src={programmer}
                alt="Theodore Mentis - Professional headshot of a Senior Full Stack Developer working at a modern computer setup"
                className={`w-full h-auto rounded-3xl transform transition-transform duration-500 hover:scale-105 ${
                  prefersReducedMotion ? "!transform-none !transition-none" : ""
                }`}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.png"
                }}
                role="img"
              />
            </div>

            <div
              className={`absolute -top-4 -right-4 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                isDark
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
              role="status"
              aria-label="Current availability status"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Available for hire
            </div>

            <div
              className={`absolute -bottom-4 -left-4 px-3 py-2 rounded-xl text-sm font-semibold animate-pulse transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              } ${prefersReducedMotion ? "!transition-none" : ""} ${
                isDark
                  ? "bg-blue-500/50 text-blue-300 border border-blue-500/70"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
              role="status"
              aria-label="Relocation availability status"
            >
              🌍 Open for relocation
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"
export default Hero
