// CSS Container Queries Hook (2025 Cutting-Edge)
import React, { useState, useEffect, useRef } from "react"

// Container Query Hook
export const useContainerQuery = (query: string) => {
  const [matches, setMatches] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check if container queries are supported
    if (!window.CSS?.supports?.("container-type: inline-size")) {
      // Fallback for browsers without support
      return
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize } = entry.contentBoxSize[0]

        // Parse query (simple implementation for width queries)
        const match = query.match(/min-width:\s*(\d+)px/)
        if (match) {
          const minWidth = parseInt(match[1])
          setMatches(inlineSize >= minWidth)
        }
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [query])

  return { matches, ref }
}

// Container Query Component
interface ContainerQueryProps {
  query: string
  children: (matches: boolean) => React.ReactNode
  className?: string
  fallback?: React.ReactNode
}

export const ContainerQuery: React.FC<ContainerQueryProps> = ({
  query,
  children,
  className,
  fallback,
}) => {
  const { matches, ref } = useContainerQuery(query)

  return (
    <div
      ref={ref}
      className={className}
      style={{ containerType: "inline-size" }}
    >
      {children(matches) || fallback}
    </div>
  )
}

// Responsive Grid with Container Queries
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`grid gap-6 ${className}`}
      style={{
        containerType: "inline-size",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
      }}
    >
      {children}
    </div>
  )
}

// Container-aware Card Component
interface ContainerCardProps {
  children: React.ReactNode
  className?: string
}

export const ContainerCard: React.FC<ContainerCardProps> = ({
  children,
  className,
}) => {
  const { matches: isWide } = useContainerQuery("min-width: 400px")

  return (
    <div
      className={`
        transition-all duration-300
        ${isWide ? "p-8 text-lg" : "p-4 text-base"}
        ${className}
      `}
      style={{ containerType: "inline-size" }}
    >
      {children}
    </div>
  )
}

export default useContainerQuery
