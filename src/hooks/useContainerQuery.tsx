
import React, { useState, useEffect, useRef } from "react"
export const useContainerQuery = (query: string) => {
  const [matches, setMatches] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!window.CSS?.supports?.("container-type: inline-size")) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize } = entry.contentBoxSize[0]
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
