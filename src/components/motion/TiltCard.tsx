import React, { useCallback, useRef } from "react"
import { cn } from "../../utils/styles"
import useReducedMotion from "../../hooks/useReducedMotion"
import usePointerFine from "../../hooks/usePointerFine"

const MAX_TILT = 3

export type TiltCardProps = {
  className?: string
  innerClassName?: string
  enableGlow?: boolean
  children: React.ReactNode
}

const TiltCard: React.FC<TiltCardProps> = ({
  className,
  innerClassName,
  enableGlow = true,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const hasFinePointer = usePointerFine()
  const innerRef = useRef<HTMLDivElement>(null)
  const enabled = hasFinePointer && !prefersReducedMotion

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !innerRef.current) return

      const rect = innerRef.current.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5

      innerRef.current.style.setProperty(
        "--tilt-x",
        `${(-y * MAX_TILT).toFixed(2)}deg`
      )
      innerRef.current.style.setProperty(
        "--tilt-y",
        `${(x * MAX_TILT).toFixed(2)}deg`
      )

      if (enableGlow) {
        innerRef.current.style.setProperty(
          "--glow-x",
          `${((event.clientX - rect.left) / rect.width) * 100}%`
        )
        innerRef.current.style.setProperty(
          "--glow-y",
          `${((event.clientY - rect.top) / rect.height) * 100}%`
        )
      }
    },
    [enabled, enableGlow]
  )

  const handleLeave = useCallback(() => {
    if (!innerRef.current) return
    innerRef.current.style.setProperty("--tilt-x", "0deg")
    innerRef.current.style.setProperty("--tilt-y", "0deg")
  }, [])

  return (
    <div
      className={cn("relative", className)}
      onMouseMove={enabled ? handleMove : undefined}
      onMouseLeave={enabled ? handleLeave : undefined}
    >
      <div
        ref={innerRef}
        className={cn(
          "relative h-full w-full transition-transform duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none",
          enabled &&
            "[transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]",
          innerClassName
        )}
        style={
          enabled
            ? ({
                "--tilt-x": "0deg",
                "--tilt-y": "0deg",
                "--glow-x": "50%",
                "--glow-y": "50%",
              } as React.CSSProperties)
            : undefined
        }
      >
        {enableGlow && enabled ? (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
            style={{
              background: `radial-gradient(420px circle at var(--glow-x) var(--glow-y), rgba(77,124,15,0.08), transparent 55%)`,
            }}
          />
        ) : null}
        {children}
      </div>
    </div>
  )
}

export default TiltCard
