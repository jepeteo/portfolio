import { useEffect, useRef, useState } from "react"

type UseCountUpOptions = {
  value: string
  duration?: number
  steps?: number
  enabled?: boolean
  delay?: number
}

export function useCountUp({
  value,
  duration = 1500,
  steps = 30,
  enabled = true,
  delay = 0,
}: UseCountUpOptions) {
  const [displayValue, setDisplayValue] = useState(value)
  const hasAnimatedRef = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(value)
      return
    }

    const numericValue = parseInt(value.replace(/\D/g, ""), 10)
    const suffix = value.replace(/\d/g, "")

    if (Number.isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    const node = ref.current
    if (!node) return

    let timeoutId: number | undefined
    let intervalId: number | undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return

        timeoutId = window.setTimeout(() => {
          let currentValue = 0
          const increment = numericValue / steps
          const intervalMs = duration / steps

          intervalId = window.setInterval(() => {
            currentValue += increment
            if (currentValue >= numericValue) {
              setDisplayValue(value)
              hasAnimatedRef.current = true
              if (intervalId) window.clearInterval(intervalId)
            } else {
              setDisplayValue(`${Math.floor(currentValue)}${suffix}`)
            }
          }, intervalMs)
        }, delay)
      },
      { threshold: 0.4, rootMargin: "40px" }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (timeoutId) window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [delay, duration, enabled, steps, value])

  return { displayValue, ref }
}

export default useCountUp
