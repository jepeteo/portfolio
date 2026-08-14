import React, { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
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

const lazyPage = (loader: () => Promise<{ default: React.ComponentType }>) =>
  createLazyComponent(loader, {})

const ServicesPage = lazyPage(() => import("./pages/ServicesPage"))
const EmergencyHelpPage = lazyPage(() => import("./pages/EmergencyHelpPage"))
const ServiceLandingPage = lazyPage(() => import("./pages/ServiceLandingPage"))
const ProjectsPage = lazyPage(() => import("./pages/ProjectsPage"))
const ProjectDetailPage = lazyPage(() => import("./pages/ProjectDetailPage"))
const EngineeringPage = lazyPage(() => import("./pages/EngineeringPage"))
const ExperiencePage = lazyPage(() => import("./pages/ExperiencePage"))
const CertificationsPage = lazyPage(() => import("./pages/CertificationsPage"))
const AboutPage = lazyPage(() => import("./pages/AboutPage"))
const ContactPage = lazyPage(() => import("./pages/ContactPage"))
const NotFoundPage = lazyPage(() => import("./pages/NotFoundPage"))

if (process.env.NODE_ENV === "development") {
  import("./utils/schemaTesting")
}

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
)

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
                    <Page>
                      <ServicesPage />
                    </Page>
                  }
                />
                <Route
                  path="services/emergency-website-help"
                  element={
                    <Page>
                      <EmergencyHelpPage />
                    </Page>
                  }
                />
                <Route
                  path="services/:serviceSlug"
                  element={
                    <Page>
                      <ServiceLandingPage />
                    </Page>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <Page>
                      <ProjectsPage />
                    </Page>
                  }
                />
                <Route
                  path="projects/:slug"
                  element={
                    <Page>
                      <ProjectDetailPage />
                    </Page>
                  }
                />
                <Route
                  path="engineering"
                  element={
                    <Page>
                      <EngineeringPage />
                    </Page>
                  }
                />
                <Route
                  path="experience"
                  element={
                    <Page>
                      <ExperiencePage />
                    </Page>
                  }
                />
                <Route
                  path="certifications"
                  element={
                    <Page>
                      <CertificationsPage />
                    </Page>
                  }
                />
                <Route
                  path="about"
                  element={
                    <Page>
                      <AboutPage />
                    </Page>
                  }
                />
                <Route
                  path="contact"
                  element={
                    <Page>
                      <ContactPage />
                    </Page>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Page>
                      <NotFoundPage />
                    </Page>
                  }
                />
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
