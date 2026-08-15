import React, { useEffect, useState } from "react"
import useReducedMotion from "../../hooks/useReducedMotion"
import { cn } from "../../utils/styles"

export type TerminalLine = {
  prompt?: string
  text: string
}

export type AnimatedTerminalProps = {
  lines: TerminalLine[]
  className?: string
  lineDelayMs?: number
  ariaLabel?: string
}

const AnimatedTerminal: React.FC<AnimatedTerminalProps> = ({
  lines,
  className,
  lineDelayMs = 400,
  ariaLabel = "Diagnostic output",
}) => {
  const prefersReducedMotion = useReducedMotion()
  const [visibleCount, setVisibleCount] = useState(
    prefersReducedMotion ? lines.length : 0
  )

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCount(lines.length)
      return
    }

    setVisibleCount(0)
    let current = 0
    const interval = window.setInterval(() => {
      current += 1
      setVisibleCount(current)
      if (current >= lines.length) {
        window.clearInterval(interval)
      }
    }, lineDelayMs)

    return () => window.clearInterval(interval)
  }, [lines.length, lineDelayMs, prefersReducedMotion])

  return (
    <div className={cn("relative", className)}>
      <div
        className="sr-only"
        aria-label={ariaLabel}
      >
        {lines.map((line, index) => (
          <p key={`sr-${index}`}>
            {line.prompt ? `${line.prompt} ` : ""}
            {line.text}
          </p>
        ))}
      </div>

      <div aria-hidden="true">
        {lines.slice(0, visibleCount).map((line, index) => (
          <div key={index}>
            {line.prompt ? (
              <span className="text-[#7dd3fc]">{line.prompt} </span>
            ) : null}
            {line.text}
          </div>
        ))}
        {!prefersReducedMotion && visibleCount < lines.length ? (
          <span className="inline-block h-3 w-2 animate-pulse bg-[#d9f99d]/80 motion-reduce:animate-none" />
        ) : null}
      </div>
    </div>
  )
}

export default AnimatedTerminal
