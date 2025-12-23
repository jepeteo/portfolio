import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../utils/styles"
import {
  Search,
  FolderOpen,
  FileX,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react"
import { Button } from "./Button"

// Preset icons for common empty states
const emptyStateIcons = {
  search: Search,
  folder: FolderOpen,
  file: FileX,
  alert: AlertCircle,
  refresh: RefreshCw,
  add: Plus,
}

type EmptyStatePreset = keyof typeof emptyStateIcons

interface EmptyStateProps {
  /** Title for the empty state */
  title: string
  /** Description text */
  description?: string
  /** Preset icon type or custom icon component */
  icon?: EmptyStatePreset | React.ComponentType<{ className?: string }>
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Primary action button */
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost"
  }
  /** Secondary action button */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Custom illustration component */
  illustration?: React.ReactNode
  /** Additional className */
  className?: string
  /** Whether to animate the entrance */
  animated?: boolean
}

/**
 * EmptyState - A reusable component for displaying empty states
 *
 * Use this when:
 * - A list or grid has no items to display
 * - Search/filter returns no results
 * - A section has no content yet
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = "folder",
  size = "md",
  action,
  secondaryAction,
  illustration,
  className,
  animated = true,
}) => {
  // Resolve icon component
  const IconComponent = typeof icon === "string" ? emptyStateIcons[icon] : icon

  // Size configurations
  const sizes = {
    sm: {
      container: "py-8",
      icon: "w-10 h-10",
      title: "text-lg",
      description: "text-sm",
      button: "sm" as const,
    },
    md: {
      container: "py-12",
      icon: "w-16 h-16",
      title: "text-xl",
      description: "text-base",
      button: "default" as const,
    },
    lg: {
      container: "py-16",
      icon: "w-20 h-20",
      title: "text-2xl",
      description: "text-lg",
      button: "lg" as const,
    },
  }

  const sizeConfig = sizes[size]

  const containerAnimation = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {}

  const iconAnimation = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { delay: 0.1, duration: 0.4, type: "spring" },
      }
    : {}

  const contentAnimation = animated
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2, duration: 0.4 },
      }
    : {}

  const Wrapper = animated ? motion.div : "div"
  const IconWrapper = animated ? motion.div : "div"
  const ContentWrapper = animated ? motion.div : "div"

  return (
    <Wrapper
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeConfig.container,
        className
      )}
      {...containerAnimation}
    >
      {/* Custom illustration or default icon */}
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : (
        <IconWrapper
          className={cn(
            "mb-6 p-4 rounded-2xl",
            "bg-gradient-to-br from-slate-100 to-slate-200",
            "dark:from-slate-800 dark:to-slate-700",
            "shadow-inner"
          )}
          {...iconAnimation}
        >
          <IconComponent
            className={cn(
              sizeConfig.icon,
              "text-slate-400 dark:text-slate-500"
            )}
          />
        </IconWrapper>
      )}

      {/* Text content */}
      <ContentWrapper {...contentAnimation}>
        <h3
          className={cn(
            sizeConfig.title,
            "font-semibold text-slate-800 dark:text-slate-200 mb-2"
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              sizeConfig.description,
              "text-muted-foreground max-w-md mx-auto mb-6"
            )}
          >
            {description}
          </p>
        )}
      </ContentWrapper>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={animated ? { delay: 0.3 } : undefined}
        >
          {action && (
            <Button
              variant={action.variant || "default"}
              size={sizeConfig.button}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              size={sizeConfig.button}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </Wrapper>
  )
}

// Preset empty states for common use cases
export const NoSearchResults: React.FC<{
  onClear?: () => void
  query?: string
}> = ({ onClear, query }) => (
  <EmptyState
    icon="search"
    title="No results found"
    description={
      query
        ? `We couldn't find anything matching "${query}". Try different keywords or filters.`
        : "Try adjusting your search or filter to find what you're looking for."
    }
    action={
      onClear
        ? {
            label: "Clear search",
            onClick: onClear,
            variant: "outline",
          }
        : undefined
    }
  />
)

export const NoProjectsFound: React.FC<{
  onResetFilter?: () => void
}> = ({ onResetFilter }) => (
  <EmptyState
    icon="folder"
    title="No projects found"
    description="There are no projects matching your current filter. Try selecting different technologies or reset the filter."
    action={
      onResetFilter
        ? {
            label: "Reset filters",
            onClick: onResetFilter,
            variant: "outline",
          }
        : undefined
    }
  />
)

export const NoDataAvailable: React.FC<{
  dataType?: string
  onRetry?: () => void
}> = ({ dataType = "data", onRetry }) => (
  <EmptyState
    icon="file"
    title={`No ${dataType} available`}
    description={`There is no ${dataType} to display at the moment. Please check back later.`}
    action={
      onRetry
        ? {
            label: "Retry",
            onClick: onRetry,
            variant: "outline",
          }
        : undefined
    }
  />
)

export default EmptyState
