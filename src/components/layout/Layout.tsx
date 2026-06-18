import React, { Suspense, lazy } from "react"
import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import PortfolioSchema from "../seo/PortfolioSchema"
import { SkipLink } from "../accessibility/SkipLink"
import ScrollToTop from "../system/ScrollToTop"
import { createLazyComponent } from "../../utils/performanceOptimization"

const Header = lazy(() => import("./Header"))

const OfflineIndicator = lazy(() =>
  import("../ui/OfflineIndicator").then((m) => ({
    default: m.OfflineIndicator,
  }))
)

const PerformanceDashboard = createLazyComponent(
  () => import("../system/PerformanceDashboard"),
  {}
)

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen transition-colors duration-300 text-slate-900 dark:text-slate-100">
      <ScrollToTop />
      <SkipLink href="#main-content" />
      <PortfolioSchema
        includePersonSchema={false}
        includeOrganizationSchema={true}
      />
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
      <Suspense fallback={null}>
        <PerformanceDashboard />
      </Suspense>
    </div>
  )
}

export default Layout
