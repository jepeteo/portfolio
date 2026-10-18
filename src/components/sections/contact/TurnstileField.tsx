import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const SCRIPT_ID = "cf-turnstile-api"

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

export type TurnstileFieldHandle = {
  reset: () => void
}

type TurnstileFieldProps = {
  siteKey: string
  theme: "light" | "dark"
  onToken: (token: string) => void
}

function getTurnstile(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile
}

function loadTurnstileScript(): Promise<void> {
  if (getTurnstile()) return Promise.resolve()

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
  if (existing) {
    if (existing.dataset.loaded === "true") return Promise.resolve()
    return new Promise((resolve, reject) => {
      existing.addEventListener(
        "load",
        () => {
          existing.dataset.loaded = "true"
          resolve()
        },
        { once: true }
      )
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed")), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      script.dataset.loaded = "true"
      resolve()
    }
    script.onerror = () => reject(new Error("Turnstile script failed"))
    document.head.appendChild(script)
  })
}

export const TurnstileField = forwardRef<TurnstileFieldHandle, TurnstileFieldProps>(
  function TurnstileField({ siteKey, theme, onToken }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef("")
    const [status, setStatus] = useState<"pending" | "passed" | "error">("pending")

    useImperativeHandle(ref, () => ({
      reset() {
        setStatus("pending")
        onToken("")
        const widgetId = widgetIdRef.current
        if (widgetId) getTurnstile()?.reset(widgetId)
      },
    }))

    useEffect(() => {
      const container = containerRef.current
      if (!container || !siteKey) return

      let cancelled = false
      setStatus("pending")

      loadTurnstileScript()
        .then(() => {
          const turnstile = getTurnstile()
          if (cancelled || !containerRef.current) return
          if (!turnstile) {
            setStatus("error")
            return
          }
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            size: "flexible",
            appearance: "interaction-only",
            callback: (token: string) => {
              setStatus("passed")
              onToken(token)
            },
            "expired-callback": () => {
              setStatus("pending")
              onToken("")
            },
            "error-callback": () => {
              setStatus("error")
              onToken("")
            },
          })
        })
        .catch(() => {
          if (!cancelled) setStatus("error")
        })

      return () => {
        cancelled = true
        const widgetId = widgetIdRef.current
        widgetIdRef.current = ""
        if (widgetId) getTurnstile()?.remove(widgetId)
      }
    }, [onToken, siteKey, theme])

    const message = !siteKey
      ? "Security check is unavailable."
      : status === "error"
        ? "Security check could not load. Refresh the page and try again."
        : status === "passed"
          ? "Security check passed."
          : "Confirming this is a person."

    return (
      <div className="space-y-2" role="group" aria-label="Security check">
        <p className="text-sm text-[var(--v2-muted)]" aria-live="polite">
          {message}
        </p>
        <div ref={containerRef} className="w-full max-w-full overflow-hidden" />
      </div>
    )
  }
)
