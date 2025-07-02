import React, { useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import "../../styles/tooltip.css"

interface TooltipProps {
  content: string
  children: React.ReactElement
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate position based on the trigger element
  const updateTooltipPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPosition({
        top: window.scrollY + rect.top, // Position at the top of the element
        left: rect.left + rect.width / 2, // Center horizontally
      })
    }
  }

  // Handle showing/hiding the tooltip
  const handleMouseEnter = () => {
    updateTooltipPosition()
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  // Update position on scroll or resize
  useEffect(() => {
    if (isVisible) {
      const handleWindowEvents = () => {
        updateTooltipPosition()
      }

      window.addEventListener("scroll", handleWindowEvents)
      window.addEventListener("resize", handleWindowEvents)

      return () => {
        window.removeEventListener("scroll", handleWindowEvents)
        window.removeEventListener("resize", handleWindowEvents)
      }
    }
  }, [isVisible])

  return (
    <div
      ref={containerRef}
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible &&
        content &&
        ReactDOM.createPortal(
          <div
            className="fixed z-[1000] transform -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div className="bg-black/90 text-white text-xs p-2 rounded-lg mb-4 max-w-xs opacity-0 animate-fadeIn shadow-lg">
              {content}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-black/90"></div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
