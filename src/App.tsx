import React, { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import ErrorBoundary from "./components/system/ErrorBoundary"
import Layout from "./components/layout/Layout"
import HomePage from "./pages/HomePage"
import { ThemeProvider } from "./context/ThemeContext"
import { createLazyComponent } from "./utils/performanceOptimization"

const ToastProvider = lazy(() =>
  import("./components/ui/Toast").then((m) => ({ default: m.ToastProvider }))
)

const VercelIntegrations = createLazyComponent(
  () =>
    import("./components/system/VercelIntegrations").then((m) => ({
      default: m.VercelIntegrations,
    })),
  {}
)

const ServicesPage = createLazyComponent(
  () => import("./pages/ServicesPage"),
  {}
)

const EmergencyHelpPage = createLazyComponent(
  () => import("./pages/EmergencyHelpPage"),
  {}
)

if (process.env.NODE_ENV === "development") {
  import("./utils/schemaTesting")
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Suspense fallback={null}>
          <ToastProvider position="top-right">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route
                  path="services"
                  element={
                    <Suspense fallback={null}>
                      <ServicesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="services/emergency-website-help"
                  element={
                    <Suspense fallback={null}>
                      <EmergencyHelpPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            <Suspense fallback={null}>
              <VercelIntegrations />
            </Suspense>
          </ToastProvider>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
