import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App.tsx"
import "/src/index.css"

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const posthogHost =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"
const posthogEnabled = import.meta.env.VITE_ENABLE_POSTHOG === "true"

// Deferred PostHog wrapper - loads analytics after page is interactive
const DeferredPostHogProvider = React.lazy(() =>
  import("posthog-js/react").then((module) => ({
    default: ({ children }: { children: React.ReactNode }) => (
      <module.PostHogProvider
        apiKey={posthogKey!}
        options={{
          api_host: posthogHost,
          capture_pageview: false,
          disable_session_recording: import.meta.env.DEV,
          loaded: (posthog) => {
            // PostHog is now loaded and ready
            if (import.meta.env.DEV) {
              console.log("PostHog loaded (deferred)")
            }
          },
        }}
      >
        {children}
      </module.PostHogProvider>
    ),
  }))
)

// Component that defers PostHog until after hydration
function AppWithDeferredAnalytics() {
  const [analyticsReady, setAnalyticsReady] = React.useState(false)

  React.useEffect(() => {
    // Defer analytics loading until after paint and idle time
    if (posthogEnabled && posthogKey) {
      // Use requestIdleCallback for non-critical initialization
      const loadAnalytics = () => {
        setAnalyticsReady(true)
      }

      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadAnalytics, { timeout: 3000 })
      } else {
        // Fallback: load after 2 seconds
        setTimeout(loadAnalytics, 2000)
      }
    }
  }, [])

  if (analyticsReady) {
    return (
      <React.Suspense fallback={<App />}>
        <DeferredPostHogProvider>
          <App />
        </DeferredPostHogProvider>
      </React.Suspense>
    )
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppWithDeferredAnalytics />
    </Router>
  </React.StrictMode>
)
