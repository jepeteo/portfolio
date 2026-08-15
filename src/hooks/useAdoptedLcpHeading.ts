import { useLayoutEffect, useRef, useState, type RefObject } from "react"

/**
 * Adopt the prerendered LCP heading (same DOM node) into the React tree so
 * createRoot does not replace it with a new element and reset LCP timing.
 *
 * On client-side navigations there is no static fallback; render React heading.
 */
export function useAdoptedLcpHeading(
  headingId: string,
  className: string
): {
  slotRef: RefObject<HTMLDivElement>
  renderReactHeading: boolean
} {
  const slotRef = useRef<HTMLDivElement>(null!)
  const [renderReactHeading, setRenderReactHeading] = useState(() => {
    if (typeof document === "undefined") return true
    const staticH1 = document.querySelector(
      "#static-crawl-fallback h1, #lcp-static-heading"
    )
    return !staticH1
  })

  useLayoutEffect(() => {
    if (renderReactHeading) return

    const slot = slotRef.current
    const staticH1 = document.querySelector(
      "#static-crawl-fallback h1, #lcp-static-heading"
    ) as HTMLElement | null

    if (!slot || !staticH1) {
      setRenderReactHeading(true)
      return
    }

    staticH1.id = headingId
    staticH1.className = className
    slot.appendChild(staticH1)

    document.getElementById("static-crawl-fallback")?.remove()
    // Keep the shell until any static subtitle has also been adopted.
    const shell = document.getElementById("lcp-static-shell")
    if (shell && !shell.querySelector("#lcp-static-subtitle")) {
      shell.remove()
    }
  }, [className, headingId, renderReactHeading])

  return { slotRef, renderReactHeading }
}
