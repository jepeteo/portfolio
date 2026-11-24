import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const SCRIPT_ID = "cf-turnstile-api"
const LOAD_TIMEOUT_MS = 4000

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

export type TurnstileFieldHandle = {
  reset: () => void
}

export type TurnstileStatus = "loading" | "ready" | "passed" | "unavailable"

type TurnstileFieldProps = {
  siteKey: string
  theme: "light" | "dark"
  onToken: (token: string) => void
  onStatus?: (status: TurnstileStatus) => void
  fallbackEmail?: string
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
  function TurnstileField({ siteKey, theme, onToken, onStatus, fallbackEmail }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef("")
    const readyRef = useRef(false)
    const [status, setStatus] = useState<TurnstileStatus>(siteKey ? "loading" : "unavailable")

    useImperativeHandle(ref, () => ({
      reset() {
        readyRef.current = Boolean(widgetIdRef.current)
        const next = widgetIdRef.current ? "ready" : "loading"
        setStatus(next)
        onStatus?.(next)
        onToken("")
        const widgetId = widgetIdRef.current
        if (widgetId) getTurnstile()?.reset(widgetId)
      },
    }))

    useEffect(() => {
      const container = containerRef.current
      if (!siteKey) {
        readyRef.current = false
        setStatus("unavailable")
        onStatus?.("unavailable")
        return
      }
      if (!container) return

      let cancelled = false
      readyRef.current = false
      setStatus("loading")
      onStatus?.("loading")

      const markUnavailable = () => {
        if (cancelled || readyRef.current) return
        setStatus("unavailable")
        onStatus?.("unavailable")
      }

      const timer = window.setTimeout(markUnavailable, LOAD_TIMEOUT_MS)

      loadTurnstileScript()
        .then(() => {
          const turnstile = getTurnstile()
          if (cancelled || !containerRef.current) return
          if (!turnstile) {
            markUnavailable()
            return
          }
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            size: "flexible",
            appearance: "always",
            callback: (token: string) => {
              setStatus("passed")
              onStatus?.("passed")
              onToken(token)
            },
            "expired-callback": () => {
              setStatus("ready")
              onStatus?.("ready")
              onToken("")
            },
            "error-callback": () => {
              readyRef.current = false
              setStatus("unavailable")
              onStatus?.("unavailable")
              onToken("")
            },
          })
          readyRef.current = true
          window.clearTimeout(timer)
          setStatus("ready")
          onStatus?.("ready")
        })
        .catch(() => {
          markUnavailable()
        })

      return () => {
        cancelled = true
        window.clearTimeout(timer)
        const widgetId = widgetIdRef.current
        widgetIdRef.current = ""
        readyRef.current = false
        if (widgetId) getTurnstile()?.remove(widgetId)
      }
    }, [onStatus, onToken, siteKey, theme])

    const unavailableMessage = fallbackEmail ? (
      <>
        The security check didn&apos;t load. Email{" "}
        <a
          href={`mailto:${fallbackEmail}`}
          className="font-bold text-[var(--v2-acid)] underline underline-offset-2"
        >
          {fallbackEmail}
        </a>{" "}
        and I&apos;ll reply directly.
      </>
    ) : (
      "The security check didn't load. Refresh the page and try again."
    )

    const message =
      status === "unavailable"
        ? unavailableMessage
        : status === "passed"
          ? "Security check passed."
          : status === "ready"
            ? "Tick the check, then send your message."
            : "Confirming this is a person."

    return (
      <div
        id="security-check"
        tabIndex={-1}
        className="space-y-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
        role="group"
        aria-label="Security check"
      >
        <p className="text-sm text-[var(--v2-muted)]" aria-live="polite">
          {message}
        </p>
        <div ref={containerRef} className="w-full max-w-full overflow-hidden" />
      </div>
    )
  }
)
