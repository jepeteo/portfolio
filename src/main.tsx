import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import { PostHogProvider } from "posthog-js/react"
import App from "./App.tsx"
import "/src/index.css"

// PostHog configuration
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const posthogHost =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"
const posthogEnabled = import.meta.env.VITE_ENABLE_POSTHOG === "true"

const options = {
  api_host: posthogHost,
  // Development-friendly settings
  capture_pageview: false, // We'll manually track pageviews
  disable_session_recording: import.meta.env.DEV,
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {posthogEnabled && posthogKey ? (
        <PostHogProvider apiKey={posthogKey} options={options}>
          <App />
        </PostHogProvider>
      ) : (
        <App />
      )}
    </Router>
  </React.StrictMode>
)
