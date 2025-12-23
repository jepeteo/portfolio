import React from "react"
import { cn } from "../../utils/styles"

interface SkipLinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

/**
 * SkipLink - Accessibility component for keyboard users
 *
 * Allows keyboard users to skip directly to main content,
 * bypassing repetitive navigation elements.
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  href = "#main-content",
  children = "Skip to main content",
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible on focus
        "sr-only focus:not-sr-only",
        // Positioning
        "fixed top-4 left-4 z-[100]",
        // Styling
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-md",
        "text-sm font-medium",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Animation
        "transition-transform duration-200",
        "focus:translate-y-0 -translate-y-full",
        className
      )}
    >
      {children}
    </a>
  )
}

export default SkipLink
