
import React, { createContext, useContext } from "react"
import { cn } from "../../utils/styles"
import { designTokens } from "../design-system/tokens"
interface CardContextValue {
  variant: "default" | "outlined" | "elevated" | "ghost"
  size: "sm" | "md" | "lg"
}

const CardContext = createContext<CardContextValue>({
  variant: "default",
  size: "md",
})
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardContextValue["variant"]
  size?: CardContextValue["size"]
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    const contextValue = { variant, size }

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

    const Comp = asChild ? React.Fragment : "div"

    return (
      <CardContext.Provider value={contextValue}>
        <Comp
          ref={ref}
          className={cn(
            "transition-all duration-200 ease-out",
            cardVariants[variant],
            cardSizes[size],
            className
          )}
          {...props}
        />
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
