import React, { createContext, useContext } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "../../utils/styles"

interface CardContextValue {
  variant: "default" | "outlined" | "elevated" | "ghost"
  size: "sm" | "md" | "lg"
  interactive: boolean
}

const CardContext = createContext<CardContextValue>({
  variant: "default",
  size: "md",
  interactive: false,
})

// Micro-interaction hover effects
const hoverEffects = {
  lift: {
    rest: { y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
    hover: {
      y: -6,
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
    tap: { y: -2, scale: 0.98 },
  },
  glow: {
    rest: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
    hover: { boxShadow: "0 0 25px 0 rgba(59, 130, 246, 0.25)" },
    tap: { boxShadow: "0 0 15px 0 rgba(59, 130, 246, 0.15)" },
  },
  scale: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  subtle: {
    rest: { y: 0 },
    hover: { y: -2 },
    tap: { y: 0, scale: 0.99 },
  },
}

type HoverEffect = keyof typeof hoverEffects | "none"

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  variant?: CardContextValue["variant"]
  size?: CardContextValue["size"]
  hover?: HoverEffect
  interactive?: boolean
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      hover = "none",
      interactive = false,
      // asChild reserved for future Radix slot pattern (unused)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild: _asChild,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = { variant, size, interactive }

    const cardVariants = {
      default:
        "bg-surface-card text-surface-cardForeground border border-border",
      outlined: "border-2 border-border bg-transparent",
      elevated:
        "bg-surface-card text-surface-cardForeground shadow-lg border border-border/50",
      ghost: "bg-transparent border-none shadow-none",
    }

    const cardSizes = {
      sm: "p-3 rounded-lg",
      md: "p-6 rounded-xl",
      lg: "p-8 rounded-2xl",
    }

    const baseClasses = cn(
      "transition-colors duration-200 ease-out",
      cardVariants[variant],
      cardSizes[size],
      interactive && "cursor-pointer",
      className
    )

    // Non-interactive card
    if (!interactive || hover === "none") {
      return (
        <CardContext.Provider value={contextValue}>
          <motion.div ref={ref} className={baseClasses} {...props}>
            {children}
          </motion.div>
        </CardContext.Provider>
      )
    }

    // Interactive card with micro-interactions
    return (
      <CardContext.Provider value={contextValue}>
        <motion.div
          ref={ref}
          className={baseClasses}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={hoverEffects[hover]}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          {...props}
        >
          {children}
        </motion.div>
      </CardContext.Provider>
    )
  }
)

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { size } = useContext(CardContext)

  const titleSizes = {
    sm: "text-lg font-semibold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold",
  }

  return (
    <h3
      ref={ref}
      className={cn("leading-none tracking-tight", titleSizes[size], className)}
      {...props}
    />
  )
})

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { size } = useContext(CardContext)

  const contentSpacing = {
    sm: "pt-3",
    md: "pt-6",
    lg: "pt-8",
  }

  return (
    <div ref={ref} className={cn(contentSpacing[size], className)} {...props} />
  )
})

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { size } = useContext(CardContext)

  const footerSpacing = {
    sm: "pt-3",
    md: "pt-6",
    lg: "pt-8",
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center", footerSpacing[size], className)}
      {...props}
    />
  )
})

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
