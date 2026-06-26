import { useEffect, useState } from "react"

/**
 * True when the primary input is a fine pointer (mouse/trackpad).
 * Use to gate hover-only effects like 3D tilt on desktop.
 */
export function usePointerFine(): boolean {
  const [hasFinePointer, setHasFinePointer] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(pointer: fine)").matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)")

    const handleChange = (event: MediaQueryListEvent) => {
      setHasFinePointer(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return hasFinePointer
}

export default usePointerFine
