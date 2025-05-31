import { useEffect, useRef, useState } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

const useIntersectionObserver = <T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const targetRef = useRef<T>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting
        setIsIntersecting(isCurrentlyIntersecting)

        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true)
          if (triggerOnce) {
            observer.unobserve(target)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(target)

    return () => {
      observer.unobserve(target)
    }
  }, [threshold, rootMargin, triggerOnce, hasIntersected])

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
    isVisible: triggerOnce ? hasIntersected : isIntersecting,
  }
}

export default useIntersectionObserver
