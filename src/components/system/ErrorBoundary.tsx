import { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  /** Name of the component/section for better error messages */
  componentName?: string
  /** Whether to show error details in development */
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * ErrorFallback - Beautiful error state UI component
 */
const ErrorFallback: React.FC<{
  error?: Error
  errorInfo?: ErrorInfo
  componentName?: string
  showDetails?: boolean
  onRetry?: () => void
}> = ({ error, errorInfo, componentName, showDetails = false, onRetry }) => {
  const isDev = process.env.NODE_ENV === "development"

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Error Icon */}
      <div className="mb-6 p-4 rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400" />
      </div>

      {/* Error Title */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {componentName ? `Error in ${componentName}` : "Something went wrong"}
      </h2>

      {/* Error Description */}
      <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
        We encountered an unexpected error. This section couldn't load properly.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
        >
          <Home className="w-4 h-4" />
          Go Home
        </a>
      </div>

      {/* Error Details (Development Only) */}
      {isDev && showDetails && error && (
        <details className="w-full max-w-2xl mt-4">
          <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Show error details (dev only)
          </summary>
          <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-auto">
            <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
              {error.message}
            </p>
            {errorInfo?.componentStack && (
              <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        </details>
      )}
    </div>
  )
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info for display
    this.setState({ errorInfo })

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorBoundary:", error, errorInfo)
    }

    // In production, you could send to error tracking service like Sentry
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            componentName={this.props.componentName}
            showDetails={this.props.showDetails ?? true}
            onRetry={this.handleRetry}
          />
        )
      )
    }

    return this.props.children
  }
}

export { ErrorFallback }
export default ErrorBoundary
