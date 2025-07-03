/**
 * Advanced Animation and Micro-Interaction Utilities
 * Enhanced UX through sophisticated animations and interactions
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { useReducedMotion } from "./accessibilityOptimization"

// Enhanced animation configuration
export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
  direction?: "normal" | "reverse" | "alternate"
  fillMode?: "none" | "forwards" | "backwards" | "both"
  iterationCount?: number | "infinite"
  playState?: "running" | "paused"
}

// Micro-interaction states
export interface MicroInteractionState {
  isHovered: boolean
  isPressed: boolean
  isFocused: boolean
  isActive: boolean
}

// Advanced hover effects
export function useAdvancedHover<T extends HTMLElement>() {
  const elementRef = useRef<T>(null)
  const [hoverState, setHoverState] = useState<MicroInteractionState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isActive: false,
  })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion) return

    const handleMouseEnter = () => {
      setHoverState((prev) => ({ ...prev, isHovered: true }))
    }

    const handleMouseLeave = () => {
      setHoverState((prev) => ({ ...prev, isHovered: false, isPressed: false }))
    }

    const handleMouseDown = () => {
      setHoverState((prev) => ({ ...prev, isPressed: true }))
    }

    const handleMouseUp = () => {
      setHoverState((prev) => ({ ...prev, isPressed: false }))
    }

    const handleFocus = () => {
      setHoverState((prev) => ({ ...prev, isFocused: true }))
    }

    const handleBlur = () => {
      setHoverState((prev) => ({ ...prev, isFocused: false }))
    }

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)
    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("mouseup", handleMouseUp)
    element.addEventListener("focus", handleFocus)
    element.addEventListener("blur", handleBlur)

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
      element.removeEventListener("mousedown", handleMouseDown)
      element.removeEventListener("mouseup", handleMouseUp)
      element.removeEventListener("focus", handleFocus)
      element.removeEventListener("blur", handleBlur)
    }
  }, [prefersReducedMotion])

  return { elementRef, hoverState }
}

// Magnetic effect for buttons and interactive elements
export function useMagneticEffect<T extends HTMLElement>(
  strength = 0.5,
  speed = 0.3
) {
  const elementRef = useRef<T>(null)
  const animationRef = useRef<number>()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion) return

    let mouseX = 0
    let mouseY = 0
    let elementX = 0
    let elementY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      mouseX = (e.clientX - centerX) * strength
      mouseY = (e.clientY - centerY) * strength
    }

    const handleMouseLeave = () => {
      mouseX = 0
      mouseY = 0
    }

    const animate = () => {
      elementX += (mouseX - elementX) * speed
      elementY += (mouseY - elementY) * speed

      element.style.transform = `translate3d(${elementX}px, ${elementY}px, 0)`

      animationRef.current = requestAnimationFrame(animate)
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [strength, speed, prefersReducedMotion])

  return elementRef
}

// Parallax scroll effect
export function useParallaxScroll(speed = 0.5) {
  const elementRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * speed

      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        element.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed, prefersReducedMotion])

  return elementRef
}

// Text reveal animation
export function useTextReveal(
  delay = 0,
  duration = 1000,
  direction: "up" | "down" | "left" | "right" = "up"
) {
  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion) return

    if (isVisible) {
      const transforms = {
        up: "translateY(0)",
        down: "translateY(0)",
        left: "translateX(0)",
        right: "translateX(0)",
      }

      element.style.transform = transforms[direction]
      element.style.opacity = "1"
      element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease`
    }
  }, [isVisible, duration, direction, prefersReducedMotion])

  return { elementRef, isVisible }
}

// Stagger animation for lists and grids
export function useStaggerAnimation<T extends HTMLElement>(
  itemSelector = ".stagger-item",
  staggerDelay = 100,
  duration = 500
) {
  const containerRef = useRef<T>(null)
  const [isTriggered, setIsTriggered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const trigger = useCallback(() => {
    setIsTriggered(true)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !isTriggered || prefersReducedMotion) return

    const items = container.querySelectorAll(
      itemSelector
    ) as NodeListOf<HTMLElement>

    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
        item.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      }, index * staggerDelay)
    })
  }, [isTriggered, itemSelector, staggerDelay, duration, prefersReducedMotion])

  return { containerRef, trigger, isTriggered }
}

// Morphing shape animation
export function useMorphingShape(shapes: string[], interval = 3000) {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || shapes.length <= 1) return

    const timer = setInterval(() => {
      setCurrentShapeIndex((prev) => (prev + 1) % shapes.length)
    }, interval)

    return () => clearInterval(timer)
  }, [shapes.length, interval, prefersReducedMotion])

  return {
    currentShape: shapes[currentShapeIndex],
    currentIndex: currentShapeIndex,
  }
}

// Cursor follow effect
export function useCursorFollow<T extends HTMLElement>(sensitivity = 0.1) {
  const elementRef = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion) return

    let cursorElement: HTMLDivElement | null = null

    // Create cursor element
    cursorElement = document.createElement("div")
    cursorElement.className = "cursor-follower"
    cursorElement.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: rgba(59, 130, 246, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
    `
    document.body.appendChild(cursorElement)

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorElement) {
        cursorElement.style.left = `${e.clientX - 10}px`
        cursorElement.style.top = `${e.clientY - 10}px`
        cursorElement.style.opacity = "1"
      }
    }

    const handleMouseLeave = () => {
      if (cursorElement) {
        cursorElement.style.opacity = "0"
      }
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)

      if (cursorElement && document.body.contains(cursorElement)) {
        document.body.removeChild(cursorElement)
      }
    }
  }, [sensitivity, prefersReducedMotion])

  return elementRef
}

// Enhanced loading states with skeleton morphing
export function useSkeletonMorph(isLoading: boolean, morphDuration = 300) {
  const elementRef = useRef<HTMLElement>(null)
  const [isInMorphState, setIsInMorphState] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setIsInMorphState(true)
    } else {
      setTimeout(() => {
        setIsInMorphState(false)
      }, morphDuration)
    }
  }, [isLoading, morphDuration])

  return {
    elementRef,
    isInMorphState,
    morphClass: isInMorphState ? "skeleton-morph" : "",
  }
}

// CSS-in-JS animation utilities
export const animationStyles = {
  // Magnetic button effect
  magneticButton: `
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  `,

  // Floating animation
  floating: `
    animation: floating 3s ease-in-out infinite;
    
    @keyframes floating {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,

  // Pulse glow effect
  pulseGlow: `
    animation: pulseGlow 2s ease-in-out infinite;
    
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
      50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
    }
  `,

  // Text shimmer
  textShimmer: `
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,

  // Ripple effect
  ripple: `
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    &:active::after {
      width: 300px;
      height: 300px;
    }
  `,
}

// Advanced transition utilities
export class TransitionManager {
  private static instance: TransitionManager

  static getInstance(): TransitionManager {
    if (!TransitionManager.instance) {
      TransitionManager.instance = new TransitionManager()
    }
    return TransitionManager.instance
  }

  // Create smooth page transitions
  createPageTransition(
    fromElement: HTMLElement,
    toElement: HTMLElement,
    direction: "left" | "right" | "up" | "down" = "right"
  ): Promise<void> {
    return new Promise((resolve) => {
      const duration = 300
      const transforms = {
        left: {
          from: "translateX(0)",
          to: "translateX(-100%)",
          enter: "translateX(100%)",
        },
        right: {
          from: "translateX(0)",
          to: "translateX(100%)",
          enter: "translateX(-100%)",
        },
        up: {
          from: "translateY(0)",
          to: "translateY(-100%)",
          enter: "translateY(100%)",
        },
        down: {
          from: "translateY(0)",
          to: "translateY(100%)",
          enter: "translateY(-100%)",
        },
      }

      const transform = transforms[direction]

      // Animate out current element
      fromElement.animate(
        [
          { transform: transform.from, opacity: 1 },
          { transform: transform.to, opacity: 0 },
        ],
        { duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
      )

      // Prepare and animate in new element
      toElement.style.transform = transform.enter
      toElement.style.opacity = "0"

      setTimeout(() => {
        const inAnimation = toElement.animate(
          [
            { transform: transform.enter, opacity: 0 },
            { transform: transform.from, opacity: 1 },
          ],
          { duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
        )

        inAnimation.onfinish = () => {
          toElement.style.transform = transform.from
          toElement.style.opacity = "1"
          resolve()
        }
      }, duration / 2)
    })
  }

  // Enhanced modal transitions
  createModalTransition(modal: HTMLElement, isOpening: boolean): Promise<void> {
    return new Promise((resolve) => {
      const duration = 250

      if (isOpening) {
        const animation = modal.animate(
          [
            { transform: "scale(0.95)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ],
          { duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
        )

        animation.onfinish = () => resolve()
      } else {
        const animation = modal.animate(
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(0.95)", opacity: 0 },
          ],
          { duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
        )

        animation.onfinish = () => resolve()
      }
    })
  }
}

// Export utilities
export const transitionManager = TransitionManager.getInstance()

// Helper function to check if animations are supported
export function supportsAnimations(): boolean {
  return typeof window !== "undefined" && "animate" in HTMLElement.prototype
}

// Performance-aware animation wrapper
export function withPerformanceCheck<T extends (...args: any[]) => any>(
  animationFunction: T
): T {
  return ((...args: Parameters<T>) => {
    if (!supportsAnimations()) {
      console.warn("Animations not supported, skipping")
      return Promise.resolve()
    }

    // Check for performance budget
    if (performance.now() - performance.timing.navigationStart > 3000) {
      console.warn("Performance budget exceeded, reducing animations")
      return Promise.resolve()
    }

    return animationFunction(...args)
  }) as T
}
