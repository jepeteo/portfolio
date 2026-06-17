import React from "react"
import { motion } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ")
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <motion.div
      className={cn(
        "inline-block border-2 border-current border-t-transparent rounded-full",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-label="Loading"
      role="status"
    />
  )
}

export const LoadingDots: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export const LoadingPulse: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <motion.div
      className={cn("w-4 h-4 bg-blue-500 rounded-full", className)}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-label="Loading"
      role="status"
    />
  )
}

interface SkeletonProps {
  className?: string
  variant?: "text" | "rect" | "circle"
  width?: string | number
  height?: string | number
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  width,
  height,
  lines = 1,
}) => {
  const { isDark } = useTheme()

  const baseClass = cn(
    "animate-pulse",
    isDark ? "bg-slate-700" : "bg-slate-200",
    variant === "circle" && "rounded-full",
    variant === "rect" && "rounded-md",
    variant === "text" && "rounded h-4",
    className
  )

  const style = {
    width: width,
    height: height,
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(baseClass, index === lines - 1 && "w-3/4")}
            style={index === lines - 1 ? { ...style, width: "75%" } : style}
          />
        ))}
      </div>
    )
  }

  return <div className={baseClass} style={style} />
}

export const ProjectCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      className={cn(
        "border rounded-xl p-0 overflow-hidden shadow-sm",
        isDark
          ? "border-slate-700 bg-slate-800/50"
          : "border-slate-200 bg-white/50",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton with shimmer effect */}
      <div className="relative h-48 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            isDark ? "bg-slate-700" : "bg-slate-200"
          )}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton variant="text" width="70%" height="1.25rem" />
          <Skeleton variant="text" width="90%" height="0.875rem" />
          <Skeleton variant="text" width="60%" height="0.875rem" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Skeleton
            variant="rect"
            width="3.5rem"
            height="1.5rem"
            className="rounded-full"
          />
          <Skeleton
            variant="rect"
            width="4rem"
            height="1.5rem"
            className="rounded-full"
          />
          <Skeleton
            variant="rect"
            width="3rem"
            height="1.5rem"
            className="rounded-full"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="rect" width="4rem" height="1rem" />
          <Skeleton
            variant="rect"
            width="2rem"
            height="2rem"
            className="rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}

export const ProjectGridSkeleton: React.FC<{
  count?: number
  className?: string
}> = ({ count = 6, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ProjectCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

export const CertificateCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      className={cn(
        "border rounded-xl p-5 space-y-4",
        isDark
          ? "border-slate-700 bg-slate-800/50"
          : "border-slate-200 bg-white/50",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header with icon */}
      <div className="flex items-start gap-4">
        <Skeleton
          variant="rect"
          width="3rem"
          height="3rem"
          className="rounded-lg flex-shrink-0"
        />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="80%" height="1.125rem" />
          <Skeleton variant="text" width="60%" height="0.875rem" />
        </div>
      </div>

      {/* Date and issuer */}
      <div className="flex items-center gap-4">
        <Skeleton variant="text" width="5rem" height="0.75rem" />
        <Skeleton variant="text" width="6rem" height="0.75rem" />
      </div>

      {/* Skills tags */}
      <div className="flex flex-wrap gap-2">
        <Skeleton
          variant="rect"
          width="4rem"
          height="1.25rem"
          className="rounded-full"
        />
        <Skeleton
          variant="rect"
          width="3rem"
          height="1.25rem"
          className="rounded-full"
        />
      </div>
    </motion.div>
  )
}

export const ExperienceCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      className={cn(
        "border rounded-xl p-6 space-y-4",
        isDark
          ? "border-slate-700 bg-slate-800/50"
          : "border-slate-200 bg-white/50",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Company and position */}
      <div className="flex items-start gap-4">
        <Skeleton
          variant="rect"
          width="3.5rem"
          height="3.5rem"
          className="rounded-xl flex-shrink-0"
        />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height="1.25rem" />
          <Skeleton variant="text" width="40%" height="1rem" />
          <Skeleton variant="text" width="30%" height="0.75rem" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 pt-2">
        <Skeleton variant="text" width="100%" height="0.875rem" />
        <Skeleton variant="text" width="90%" height="0.875rem" />
        <Skeleton variant="text" width="70%" height="0.875rem" />
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton
          variant="rect"
          width="4.5rem"
          height="1.5rem"
          className="rounded-full"
        />
        <Skeleton
          variant="rect"
          width="3.5rem"
          height="1.5rem"
          className="rounded-full"
        />
        <Skeleton
          variant="rect"
          width="5rem"
          height="1.5rem"
          className="rounded-full"
        />
        <Skeleton
          variant="rect"
          width="4rem"
          height="1.5rem"
          className="rounded-full"
        />
      </div>
    </motion.div>
  )
}

interface LoadingStateProps {
  loading: boolean
  error?: string | null
  children: React.ReactNode
  skeleton?: React.ReactNode
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  skeleton,
  className,
}) => {
  const { isDark } = useTheme()

  if (error) {
    return (
      <div
        className={cn(
          "text-center py-12 px-6 border rounded-lg",
          isDark
            ? "border-slate-700 bg-slate-800/50"
            : "border-slate-200 bg-slate-50/50",
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto text-red-500">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-500">
            Something went wrong
          </h3>
          <p
            className={cn(
              "text-base",
              isDark ? "text-slate-400" : "text-slate-600"
            )}
          >
            {error}
          </p>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      skeleton || (
        <div className={cn("text-center py-12", className)}>
          <LoadingSpinner size="lg" className="text-blue-500 mx-auto mb-4" />
          <p
            className={cn(
              "text-base",
              isDark ? "text-slate-400" : "text-slate-600"
            )}
          >
            Loading...
          </p>
        </div>
      )
    )
  }

  return <>{children}</>
}

interface ProgressiveImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  width?: number
  height?: number
  loading?: "eager" | "lazy"
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  width,
  height,
  loading = "lazy",
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0">
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-105"
            />
          ) : (
            <Skeleton variant="rect" className="w-full h-full" />
          )}
        </div>
      )}

      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  )
}

/**
 * Enhanced blur-up image component with smooth transition
 * Creates a beautiful loading experience with:
 * - Dominant color placeholder or gradient
 * - Blur effect that smoothly resolves
 * - Scale animation for added depth
 */
interface BlurImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  placeholderColor?: string
  aspectRatio?: "video" | "square" | "portrait" | "auto"
  objectFit?: "cover" | "contain" | "fill"
  objectPosition?: string
  loading?: "eager" | "lazy"
  onLoad?: () => void
  onError?: () => void
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  placeholderColor = "rgb(148 163 184)", // slate-400
  aspectRatio = "video",
  objectFit = "cover",
  objectPosition = "center",
  loading = "lazy",
  onLoad,
  onError,
}) => {
  const { isDark } = useTheme()
  const [loadState, setLoadState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading")
  const imgRef = React.useRef<HTMLImageElement>(null)

  // Check if image is already cached (instant load)
  React.useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight > 0) {
      setLoadState("loaded")
      onLoad?.()
    }
  }, [onLoad])

  const aspectRatioClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "",
  }

  const handleLoad = () => {
    setLoadState("loaded")
    onLoad?.()
  }

  const handleError = () => {
    setLoadState("error")
    onError?.()
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        aspectRatioClass[aspectRatio],
        containerClassName
      )}
    >
      {/* Placeholder layer with gradient and shimmer */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: loadState === "loaded" ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: `linear-gradient(135deg, ${placeholderColor} 0%, ${
            isDark ? "rgb(51 65 85)" : "rgb(226 232 240)"
          } 100%)`,
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 -translate-x-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${
                isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.3)"
              } 50%, transparent 100%)`,
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5,
            }}
          />
        </div>

        {/* Centered loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={cn(
              "w-8 h-8 rounded-full border-2",
              isDark
                ? "border-slate-600 border-t-blue-400"
                : "border-slate-300 border-t-blue-500"
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Error state */}
      {loadState === "error" && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2",
            isDark ? "bg-slate-800" : "bg-slate-100"
          )}
        >
          <svg
            className={cn(
              "w-10 h-10",
              isDark ? "text-slate-600" : "text-slate-400"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span
            className={cn(
              "text-xs font-medium",
              isDark ? "text-slate-500" : "text-slate-400"
            )}
          >
            Failed to load
          </span>
        </div>
      )}

      {/* Main image with blur-up animation */}
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn("w-full h-full", className)}
        style={{
          objectFit,
          objectPosition,
        }}
        initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        animate={{
          opacity: loadState === "loaded" ? 1 : 0,
          scale: loadState === "loaded" ? 1 : 1.1,
          filter: loadState === "loaded" ? "blur(0px)" : "blur(20px)",
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  )
}

// Skills section skeleton
export const SkillsSkeleton: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <div
          className={cn(
            "h-10 w-48 rounded-lg mx-auto mb-4 animate-pulse",
            isDark ? "bg-slate-700" : "bg-slate-200"
          )}
        />
        <div
          className={cn(
            "h-4 w-72 max-w-full rounded mx-auto animate-pulse",
            isDark ? "bg-slate-700" : "bg-slate-200"
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl p-6 animate-pulse",
              isDark ? "bg-slate-800" : "bg-slate-100"
            )}
          >
            <div
              className={cn(
                "h-6 w-32 rounded mb-4",
                isDark ? "bg-slate-700" : "bg-slate-200"
              )}
            />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full",
                      isDark ? "bg-slate-700" : "bg-slate-200"
                    )}
                  />
                  <div
                    className={cn(
                      "h-4 flex-1 rounded",
                      isDark ? "bg-slate-700" : "bg-slate-200"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
