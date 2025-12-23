import React, { memo, useEffect, useRef, useState } from "react"
import { useTheme } from "../context/ThemeContext"
import TypedText from "./TypedText"
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
      className={`relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 transition-all duration-1000 ${
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
              ? "bg-gradient-to-b from-slate-900 via-slate-800 to-transparent"
              : "bg-gradient-to-b from-slate-50 via-white to-transparent"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(to_right,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.1)_1px,transparent_1px)]"
                : "bg-[linear-gradient(to_right,rgba(71,85,105,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.1)_1px,transparent_1px)]"
            } bg-[size:50px_50px]`}
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            }}
          />

          <div
            className={`absolute inset-x-0 bottom-0 h-32 ${
              isDark
                ? "bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"
                : "bg-gradient-to-t from-white via-white/80 to-transparent"
            }`}
            style={{
              maskImage:
                "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
            }}
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
                  top: `${Math.random() * 80}%`, // Keep dots in upper 80% to respect fade
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
              👋 Hello, I'm Theodoros
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
            With 18+ years of experience partnering with clients to bring their
            digital visions to life, I believe the best projects emerge from
            close collaboration. Together, we transform your ideas into
            extraordinary web experiences.
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
            <h3
              id="tech-stack-title"
              className={`text-xs font-medium mb-3 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Technologies I work with:
            </h3>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
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
                src="/images/opti/teo-hero.jpg"
                alt="Theodoros Mentis - Professional headshot of a Senior Full-Stack Developer with 18+ years of experience, based in Berlin, Germany"
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

            {/* Available for hire badge - centered below image */}
            <div className="flex justify-center mt-4">
              <div
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
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
            </div>

            {/* Relocation badge hidden for now */}
            {/* <div
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
            </div> */}
          </div>
        </div>
      </div>

      <div
        className={`container mx-auto px-6 py-12 transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } ${prefersReducedMotion ? "!transition-none" : ""}`}
        role="region"
        aria-labelledby="approach-title"
      >
        <div className="relative flex items-center justify-center mb-6">
          <div className="flex-1 h-px relative mr-6">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDark
                  ? "from-transparent via-purple-500/40 to-blue-500/40"
                  : "from-transparent via-purple-400/40 to-blue-400/40"
              } animate-pulse`}
              style={{
                animationDuration: "3s",
                animationDelay: "0s",
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDark
                  ? "from-transparent via-blue-500/30 to-purple-500/30"
                  : "from-transparent via-blue-400/30 to-purple-400/30"
              } animate-pulse`}
              style={{
                animationDuration: "2.5s",
                animationDelay: "1s",
              }}
            />
          </div>

          <h2
            id="approach-title"
            className={`text-sm font-medium whitespace-nowrap ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            My Approach
          </h2>

          <div className="flex-1 h-px relative ml-6">
            <div
              className={`absolute inset-0 bg-gradient-to-l ${
                isDark
                  ? "from-transparent via-purple-500/40 to-blue-500/40"
                  : "from-transparent via-purple-400/40 to-blue-400/40"
              } animate-pulse`}
              style={{
                animationDuration: "3s",
                animationDelay: "0.5s",
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-l ${
                isDark
                  ? "from-transparent via-blue-500/30 to-purple-500/30"
                  : "from-transparent via-blue-400/30 to-purple-400/30"
              } animate-pulse`}
              style={{
                animationDuration: "2.5s",
                animationDelay: "1.5s",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? "bg-slate-800/40 border-slate-700 hover:border-blue-500/30"
                : "bg-white/60 border-slate-200 hover:border-blue-300"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-3 ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Collaborative Partnership
            </h3>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              I believe in working alongside you as a true partner, sharing
              insights and expertise to achieve your vision together.
            </p>
          </div>

          <div
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? "bg-slate-800/40 border-slate-700 hover:border-purple-500/30"
                : "bg-white/60 border-slate-200 hover:border-purple-300"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-3 ${
                isDark ? "text-purple-300" : "text-purple-600"
              }`}
            >
              Strategic Thinking
            </h3>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Each project begins with understanding your goals and audience,
              ensuring we create experiences with purpose and direction.
            </p>
          </div>

          <div
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? "bg-slate-800/40 border-slate-700 hover:border-emerald-500/30"
                : "bg-white/60 border-slate-200 hover:border-emerald-300"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-3 ${
                isDark ? "text-emerald-300" : "text-emerald-600"
              }`}
            >
              Continuous Innovation
            </h3>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              I constantly explore new technologies and techniques to enhance
              your projects with cutting-edge capabilities.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`container mx-auto px-6 pb-16 transition-all duration-1000 delay-800 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } ${prefersReducedMotion ? "!transition-none" : ""}`}
        role="group"
        aria-labelledby="expertise-title"
      >
        <div className="relative flex items-center justify-center mb-6">
          <div className="flex-1 h-px relative mr-6">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDark
                  ? "from-transparent via-blue-500/40 to-purple-500/40"
                  : "from-transparent via-blue-400/40 to-purple-400/40"
              } animate-pulse`}
              style={{
                animationDuration: "3s",
                animationDelay: "0s",
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDark
                  ? "from-transparent via-purple-500/30 to-blue-500/30"
                  : "from-transparent via-purple-400/30 to-blue-400/30"
              } animate-pulse`}
              style={{
                animationDuration: "2.5s",
                animationDelay: "1s",
              }}
            />
          </div>

          <h2
            id="expertise-title"
            className={`text-sm font-medium whitespace-nowrap ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            My expertise areas
          </h2>

          <div className="flex-1 h-px relative ml-6">
            <div
              className={`absolute inset-0 bg-gradient-to-l ${
                isDark
                  ? "from-transparent via-blue-500/40 to-purple-500/40"
                  : "from-transparent via-blue-400/40 to-purple-400/40"
              } animate-pulse`}
              style={{
                animationDuration: "3s",
                animationDelay: "0.5s",
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-l ${
                isDark
                  ? "from-transparent via-purple-500/30 to-blue-500/30"
                  : "from-transparent via-purple-400/30 to-blue-400/30"
              } animate-pulse`}
              style={{
                animationDuration: "2.5s",
                animationDelay: "1.5s",
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {[
            "Senior Full Stack Developer",
            "WordPress & WooCommerce Expert",
            "Server Administrator",
          ].map((expertise) => (
            <span
              key={expertise}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                expertise === "WordPress & WooCommerce Expert"
                  ? isDark
                    ? "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30 hover:from-emerald-600/30 hover:to-teal-600/30"
                    : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200 hover:from-emerald-200 hover:to-teal-200"
                  : isDark
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30 hover:from-blue-600/30 hover:to-purple-600/30"
                  : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-purple-200"
              }`}
              role="listitem"
              aria-label={`Expertise: ${expertise}`}
            >
              {expertise}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"
export default Hero
