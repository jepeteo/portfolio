import React, { createContext, useContext, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "../../utils/styles"
import { useTheme } from "../../context/ThemeContext"

/**
 * Toast Notification System
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismiss with progress indicator
 * - Manual dismiss
 * - Stacking support
 * - Accessible announcements
 */

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Convenience hooks for different toast types
export const useToastActions = () => {
  const { addToast } = useToast()

  return {
    success: (title: string, message?: string) =>
      addToast({ type: "success", title, message, duration: 4000 }),
    error: (title: string, message?: string) =>
      addToast({ type: "error", title, message, duration: 6000 }),
    warning: (title: string, message?: string) =>
      addToast({ type: "warning", title, message, duration: 5000 }),
    info: (title: string, message?: string) =>
      addToast({ type: "info", title, message, duration: 4000 }),
  }
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: {
    light: "bg-green-50 border-green-200 text-green-800",
    dark: "bg-green-900/20 border-green-800 text-green-200",
    icon: "text-green-500",
    progress: "bg-green-500",
  },
  error: {
    light: "bg-red-50 border-red-200 text-red-800",
    dark: "bg-red-900/20 border-red-800 text-red-200",
    icon: "text-red-500",
    progress: "bg-red-500",
  },
  warning: {
    light: "bg-amber-50 border-amber-200 text-amber-800",
    dark: "bg-amber-900/20 border-amber-800 text-amber-200",
    icon: "text-amber-500",
    progress: "bg-amber-500",
  },
  info: {
    light: "bg-blue-50 border-blue-200 text-blue-800",
    dark: "bg-blue-900/20 border-blue-800 text-blue-200",
    icon: "text-blue-500",
    progress: "bg-blue-500",
  },
}

interface ToastItemProps {
  toast: Toast
  onDismiss: () => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { isDark } = useTheme()
  const [progress, setProgress] = useState(100)
  const Icon = toastIcons[toast.type]
  const styles = toastStyles[toast.type]
  const duration = toast.duration || 4000

  React.useEffect(() => {
    if (duration <= 0) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        onDismiss()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl border shadow-lg overflow-hidden min-w-[300px] max-w-[400px]",
        isDark ? styles.dark : styles.light
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", styles.icon)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm opacity-80">{toast.message}</p>
        )}
      </div>

      {/* Dismiss button */}
      {toast.dismissible !== false && (
        <button
          onClick={onDismiss}
          className={cn(
            "flex-shrink-0 p-1 rounded-lg transition-colors",
            "hover:bg-black/10 dark:hover:bg-white/10",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            isDark ? "focus:ring-white/20" : "focus:ring-black/20"
          )}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className={cn("absolute bottom-0 left-0 h-1", styles.progress)}
          style={{ width: `${progress}%` }}
          initial={{ width: "100%" }}
        />
      )}
    </motion.div>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center"
  maxToasts?: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`
      setToasts((prev) => {
        const newToasts = [{ ...toast, id }, ...prev]
        return newToasts.slice(0, maxToasts)
      })
    },
    [maxToasts]
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  }

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}

      {/* Toast container */}
      <div
        className={cn(
          "fixed z-[10000] flex flex-col gap-2",
          positionClasses[position]
        )}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
