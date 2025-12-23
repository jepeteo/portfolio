
import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/styles"

const buttonVariants = cva(

  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "text-sm font-medium transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-95 hover:scale-105",
    "will-change-transform",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow",
          "hover:bg-primary/90 hover:shadow-lg",
          "active:bg-primary/95",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground shadow-sm",
          "hover:bg-destructive/90",
        ],
        outline: [
          "border border-input bg-background shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:border-primary/50",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground shadow-sm",
          "hover:bg-secondary/80",
        ],
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground",
        ],
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:decoration-2",
          "focus-visible:underline focus-visible:decoration-2",
        ],
        gradient: [
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg",
          "hover:from-primary/90 hover:to-primary/70 hover:shadow-xl",
          "hover:shadow-primary/25",
        ],
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        spin: "hover:animate-spin",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-4 w-4 animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  tooltip?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      // asChild reserved for future Radix slot pattern
      asChild: _asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      tooltip,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const buttonContent = (
      <>
        {loading ? (
          <LoadingSpinner />
        ) : leftIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {children && <span>{children}</span>}
        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    )

    const buttonElement = (
      <button
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {buttonContent}
      </button>
    )

    if (tooltip) {
      return (
        <div className="group relative">
          {buttonElement}
          <div
            className={cn(
              "absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md",
              "bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md",
              "opacity-0 transition-opacity group-hover:opacity-100",
              "pointer-events-none z-50"
            )}
            role="tooltip"
          >
            {tooltip}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover"
              aria-hidden="true"
            />
          </div>
        </div>
      )
    }

    return buttonElement
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
