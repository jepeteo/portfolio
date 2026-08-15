import React, { Suspense, lazy } from "react"
import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import HashRedirect from "../system/HashRedirect"
import { SkipLink } from "../accessibility/SkipLink"
import RouteScrollManager from "../system/RouteScrollManager"
import { createLazyComponent } from "../../utils/performanceOptimization"

const Header = lazy(() => import("./Header"))

const OfflineIndicator = lazy(() =>
  import("../ui/OfflineIndicator").then((m) => ({
    default: m.OfflineIndicator,
  }))
)

const PerformanceDashboard = import.meta.env.DEV
  ? createLazyComponent(() => import("../system/PerformanceDashboard"), {})
  : null

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen transition-colors duration-300 text-slate-900 dark:text-slate-100">
      <RouteScrollManager />
      <HashRedirect />
      <SkipLink href="#main-content" />
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />

      <Suspense fallback={null}>
        <OfflineIndicator position="bottom" />
      </Suspense>
      {PerformanceDashboard ? (
        <Suspense fallback={null}>
          <PerformanceDashboard />
        </Suspense>
      ) : null}
    </div>
  )
}

export default Layout
