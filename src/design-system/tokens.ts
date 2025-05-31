// Modern Design System Tokens
export const designTokens = {
  // Semantic color system instead of numbered variables
  colors: {
    // Brand colors
    brand: {
      primary: "hsl(210, 100%, 50%)",
      secondary: "hsl(280, 80%, 60%)",
      accent: "hsl(45, 100%, 60%)",
    },
    // Semantic colors
    semantic: {
      success: "hsl(120, 60%, 50%)",
      warning: "hsl(40, 100%, 50%)",
      error: "hsl(0, 80%, 60%)",
      info: "hsl(200, 80%, 60%)",
    },
    // Neutral scale with better contrast ratios
    neutral: {
      50: "hsl(210, 40%, 98%)",
      100: "hsl(210, 40%, 96%)",
      200: "hsl(214, 32%, 91%)",
      300: "hsl(213, 27%, 84%)",
      400: "hsl(215, 20%, 65%)",
      500: "hsl(215, 16%, 47%)",
      600: "hsl(215, 19%, 35%)",
      700: "hsl(215, 25%, 27%)",
      800: "hsl(217, 33%, 17%)",
      900: "hsl(222, 47%, 11%)",
      950: "hsl(229, 84%, 5%)",
    },
    // Context-aware colors
    surface: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))",
      cardForeground: "hsl(var(--card-foreground))",
      popover: "hsl(var(--popover))",
      popoverForeground: "hsl(var(--popover-foreground))",
    },
  },
  // Modern spacing scale
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
    "5xl": "6rem", // 96px
  },
  // Typography scale
  typography: {
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
  // Animation system
  animations: {
    durations: {
      fast: "150ms",
      normal: "250ms",
      slow: "350ms",
    },
    easings: {
      linear: "linear",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
  // Modern shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  // Border radius scale
  radii: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
} as const

// CSS Custom Properties for runtime theme switching
export const cssVariables = {
  light: {
    "--background": "0 0% 100%",
    "--foreground": "222.2 84% 4.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "222.2 84% 4.9%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "222.2 84% 4.9%",
    "--primary": "210 100% 50%",
    "--primary-foreground": "210 40% 98%",
    "--secondary": "210 40% 96%",
    "--secondary-foreground": "222.2 84% 4.9%",
  },
  dark: {
    "--background": "222.2 84% 4.9%",
    "--foreground": "210 40% 98%",
    "--card": "222.2 84% 4.9%",
    "--card-foreground": "210 40% 98%",
    "--popover": "222.2 84% 4.9%",
    "--popover-foreground": "210 40% 98%",
    "--primary": "210 100% 50%",
    "--primary-foreground": "222.2 84% 4.9%",
    "--secondary": "217.2 32.6% 17.5%",
    "--secondary-foreground": "210 40% 98%",
  },
} as const
