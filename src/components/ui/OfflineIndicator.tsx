import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WifiOff, Wifi } from "lucide-react"
import { cn } from "../../utils/styles"

interface OfflineIndicatorProps {
  /** Position of the indicator */
  position?: "top" | "bottom"
  /** Whether to show reconnected message */
  showReconnected?: boolean
  /** Duration to show reconnected message (ms) */
  reconnectedDuration?: number
  /** Additional className */
  className?: string
}

/**
 * useOnlineStatus - Hook to track network connectivity
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== "undefined") {
      return navigator.onLine
    }
    return true
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * OfflineIndicator - Shows a banner when user loses network connectivity
 * 
 * Automatically appears when offline and optionally shows a
 * "back online" message when connectivity is restored.
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = "bottom",
  showReconnected = true,
  reconnectedDuration = 3000,
  className,
}) => {
  const isOnline = useOnlineStatus()
  const [wasOffline, setWasOffline] = useState(false)
  const [showReconnectedBanner, setShowReconnectedBanner] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      setShowReconnectedBanner(false)
    } else if (wasOffline && showReconnected) {
      setShowReconnectedBanner(true)
      const timer = setTimeout(() => {
        setShowReconnectedBanner(false)
        setWasOffline(false)
      }, reconnectedDuration)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline, showReconnected, reconnectedDuration])

  const positionClasses = {
    top: "top-0",
    bottom: "bottom-0",
  }

  return (
    <AnimatePresence>
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed left-0 right-0 z-[100] px-4 py-3",
            "bg-amber-500 text-amber-950",
            "shadow-lg",
            positionClasses[position],
            className
          )}
          role="alert"
          aria-live="assertive"
        >
          <div className="container flex items-center justify-center gap-3">
            <WifiOff className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-sm">
              You're offline. Some features may not be available.
            </span>
          </div>
        </motion.div>
      )}

      {/* Reconnected Banner */}
      {showReconnectedBanner && (
        <motion.div
          initial={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed left-0 right-0 z-[100] px-4 py-3",
            "bg-green-500 text-green-950",
            "shadow-lg",
            positionClasses[position],
            className
          )}
          role="status"
          aria-live="polite"
        >
          <div className="container flex items-center justify-center gap-3">
            <Wifi className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-sm">
              You're back online!
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineIndicator
