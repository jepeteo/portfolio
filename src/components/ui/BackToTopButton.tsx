import React, { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export const BackToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const shouldShow = scrollTop > 300
      const nearFooter = scrollTop + windowHeight >= documentHeight - 150

      setShowButton(shouldShow && !nearFooter)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes backToTopFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }

      @keyframes backToTopArrowBounce {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-1px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .back-to-top-btn { animation: none !important; }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div
      style={{
        height: "0",
        overflow: "visible",
        position: "sticky",
        bottom: "72px",
        zIndex: 1000,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "20px",
      }}
    >
      <button
        className="back-to-top-btn"
        onClick={scrollToTop}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "9999px",
          background: "var(--v2-acid)",
          color: "var(--v2-acid-ink)",
          border: "1px solid var(--v2-line-strong)",
          cursor: "pointer",
          boxShadow: showButton ? "var(--v2-shadow)" : "0 0 0 rgba(0,0,0,0)",
          opacity: showButton ? 1 : 0,
          visibility: showButton ? "visible" : "hidden",
          transform: showButton
            ? "translateY(0px) scale(1)"
            : "translateY(10px) scale(0.9)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          animation: showButton
            ? "backToTopFloat 2.5s ease-in-out infinite"
            : "none",
        }}
        onMouseEnter={(e) => {
          if (showButton) {
            e.currentTarget.style.animation = "none"
            e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"
          }
        }}
        onMouseLeave={(e) => {
          if (showButton) {
            e.currentTarget.style.transform = "translateY(0px) scale(1)"
            setTimeout(() => {
              if (showButton) {
                e.currentTarget.style.animation =
                  "backToTopFloat 2.5s ease-in-out infinite"
              }
            }, 100)
          }
        }}
        aria-label="Back to top"
      >
        <ArrowUp
          size={22}
          style={{
            animation: showButton
              ? "backToTopArrowBounce 2s ease-in-out infinite"
              : "none",
          }}
        />
      </button>
    </div>
  )
}
