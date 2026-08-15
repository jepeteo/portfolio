import { useEffect, useLayoutEffect, useRef } from "react"
import { useLocation, useNavigationType } from "react-router-dom"
import {
  hashTargetId,
  shouldRestoreScroll,
  waitForElement,
} from "../../utils/routeScroll"

const RouteScrollManager: React.FC = () => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef(new Map<string, number>())
  const previousKey = useRef(location.key)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  useLayoutEffect(() => {
    if (previousKey.current !== location.key) {
      positions.current.set(previousKey.current, window.scrollY)
      previousKey.current = location.key
    }

    if (location.hash) return

    if (shouldRestoreScroll(navigationType, location.hash)) {
      const y = positions.current.get(location.key) ?? 0
      window.scrollTo({ top: y, left: 0, behavior: "auto" })
      return
    }

    if (!isFirstRender.current) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
  }, [location.hash, location.key, navigationType])

  useEffect(() => {
    const first = isFirstRender.current
    isFirstRender.current = false
    let cancelled = false

    const focusTarget = (node: HTMLElement | null) => {
      if (!node || cancelled) return
      if (!node.hasAttribute("tabindex")) {
        node.tabIndex = -1
      }
      node.focus({ preventScroll: true })
    }

    const run = async () => {
      if (location.hash) {
        const id = hashTargetId(location.hash)
        const node = await waitForElement(id)
        if (cancelled) return
        if (node) {
          node.scrollIntoView({ block: "start", behavior: "auto" })
          focusTarget(node)
          return
        }
      }

      if (!first) {
        const heading = document.querySelector<HTMLElement>("main h1")
        const main = document.getElementById("main-content")
        focusTarget(heading ?? main)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [location.hash, location.key, location.pathname])

  return null
}

export default RouteScrollManager
