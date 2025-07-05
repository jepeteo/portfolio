
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const focusClasses = {
  ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  subtle:
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
  bold: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
} as const
export const containerQueries = {
  "cq-sm": "@container (min-width: 20rem)",
  "cq-md": "@container (min-width: 28rem)",
  "cq-lg": "@container (min-width: 32rem)",
  "cq-xl": "@container (min-width: 36rem)",
} as const
export const spacing = {
  section: "py-16 lg:py-24",
  container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  cardPadding: "p-6 md:p-8",
  buttonPadding: "px-4 py-2 md:px-6 md:py-3",
} as const
export const typography = {
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-bold tracking-tight",
    h4: "text-xl md:text-2xl font-semibold tracking-tight",
  },
  body: {
    large: "text-lg md:text-xl leading-relaxed",
    base: "text-base leading-relaxed",
    small: "text-sm leading-normal",
  },
  display: {
    hero: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
    section: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
  },
} as const
export const shadows = {
  card: "shadow-sm hover:shadow-lg transition-shadow duration-300",
  float: "shadow-lg hover:shadow-xl transition-shadow duration-300",
  glow: "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300",
} as const
export const interactions = {
  button: "transition-all duration-200 hover:scale-105 active:scale-95",
  card: "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
  link: "transition-colors duration-200 hover:text-primary",
  magnetic: "transition-transform duration-300 ease-out",
} as const
export const colors = {
  surface: {
    primary: "bg-background text-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    card: "bg-card text-card-foreground",
    elevated: "bg-white dark:bg-gray-800",
  },
  interactive: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },
} as const
export const forms = {
  input: cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
    "text-sm ring-offset-background file:border-0 file:bg-transparent",
    "file:text-sm file:font-medium placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  ),
  textarea: cn(
    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2",
    "text-sm ring-offset-background placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  ),
  label:
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
} as const
export const responsive = {
  grid: {
    auto: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    projects: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
    skills: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  },
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    column: "flex flex-col items-center",
  },
} as const
export const animations = {
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-4 duration-500",
  slideDown: "animate-in slide-in-from-top-4 duration-500",
  scaleIn: "animate-in zoom-in-95 duration-300",
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
} as const
export const loadingStates = {
  skeleton: "animate-pulse bg-muted rounded",
  shimmer:
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
  spinner: "animate-spin rounded-full border-2 border-muted border-t-primary",
} as const

export default {
  cn,
  focusClasses,
  containerQueries,
  spacing,
  typography,
  shadows,
  interactions,
  colors,
  forms,
  responsive,
  animations,
  loadingStates,
}
