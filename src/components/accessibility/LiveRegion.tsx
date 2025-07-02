/**
 * LiveRegion React Component
 * Accessible live region for dynamic content announcements
 */

import React from "react"

interface LiveRegionProps {
  children: React.ReactNode
  politeness?: "polite" | "assertive" | "off"
  atomic?: boolean
  className?: string
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = "polite",
  atomic = true,
  className = "",
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: "0",
      }}
    >
      {children}
    </div>
  )
}

export default LiveRegion
