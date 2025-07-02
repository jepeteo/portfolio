import React, { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export const BackToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show button when scrolled down more than 300px
      const shouldShow = scrollTop > 300

      // Hide button when near footer (within 150px of bottom)
      const nearFooter = scrollTop + windowHeight >= documentHeight - 150

      setShowButton(shouldShow && !nearFooter)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Add keyframes to document head
    const style = document.createElement("style")
    style.textContent = `
      @keyframes backToTopFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
      
      @keyframes backToTopPulse {
        0% { box-shadow: 0 10px 25px rgba(0,0,0,0.2), 0 6px 15px rgba(102, 126, 234, 0.3), 0 0 0 0 rgba(102, 126, 234, 0.3); }
        100% { box-shadow: 0 10px 25px rgba(0,0,0,0.2), 0 6px 15px rgba(102, 126, 234, 0.3), 0 0 0 6px rgba(102, 126, 234, 0); }
      }
      
      @keyframes backToTopArrowBounce {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-1px); }
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
        onClick={scrollToTop}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: showButton
            ? "0 10px 25px rgba(0,0,0,0.2), 0 6px 15px rgba(102, 126, 234, 0.3)"
            : "0 0 0 rgba(0,0,0,0)",
          opacity: showButton ? 1 : 0,
          visibility: showButton ? "visible" : "hidden",
          transform: showButton
            ? "translateY(0px) scale(1)"
            : "translateY(10px) scale(0.9)",
          transition: "all 0.3s ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          animation: showButton
            ? "backToTopFloat 2.5s ease-in-out infinite, backToTopPulse 3s ease-in-out infinite alternate"
            : "none",
        }}
        onMouseEnter={(e) => {
          if (showButton) {
            e.currentTarget.style.animation = "none" // Disable animations during hover
            e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"
            e.currentTarget.style.boxShadow =
              "0 15px 35px rgba(0,0,0,0.3), 0 8px 20px rgba(102, 126, 234, 0.4)"
          }
        }}
        onMouseLeave={(e) => {
          if (showButton) {
            e.currentTarget.style.transform = "translateY(0px) scale(1)"
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(0,0,0,0.2), 0 6px 15px rgba(102, 126, 234, 0.3)"
            // Re-enable animations after a short delay to allow transition to complete
            setTimeout(() => {
              if (showButton) {
                e.currentTarget.style.animation =
                  "backToTopFloat 2.5s ease-in-out infinite, backToTopPulse 3s ease-in-out infinite alternate"
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
