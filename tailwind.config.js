/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/assets/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Modern 2025 Design Token Integration
      colors: {
        // Legacy colors (maintained for backward compatibility)
        color: {
          1: "#081624",
          2: "#162432",
          3: "#243248",
        },
        stroke: {
          1: "#242832",
        },
        n: {
          1: "#FFFFFF",
          2: "#CAC6DD",
          3: "#ADA8C3",
          4: "#757185",
          5: "#3F3A52",
          6: "#252134",
          7: "#15131D",
          8: "#0E0C15",
          9: "#474060",
          10: "#43435C",
          11: "#1B1B2E",
          12: "#2E2A41",
          13: "#6C7275",
        },
        // Modern semantic color system
        primary: {
          50: "rgb(from var(--color-primary) r g b / 0.05)",
          100: "rgb(from var(--color-primary) r g b / 0.1)",
          200: "rgb(from var(--color-primary) r g b / 0.2)",
          300: "rgb(from var(--color-primary) r g b / 0.3)",
          400: "rgb(from var(--color-primary) r g b / 0.4)",
          500: "var(--color-primary)",
          600: "rgb(from var(--color-primary) r g b / 0.8)",
          700: "rgb(from var(--color-primary) r g b / 0.7)",
          800: "rgb(from var(--color-primary) r g b / 0.6)",
          900: "rgb(from var(--color-primary) r g b / 0.5)",
          DEFAULT: "var(--color-primary)",
        },
        secondary: {
          50: "rgb(from var(--color-secondary) r g b / 0.05)",
          100: "rgb(from var(--color-secondary) r g b / 0.1)",
          200: "rgb(from var(--color-secondary) r g b / 0.2)",
          300: "rgb(from var(--color-secondary) r g b / 0.3)",
          400: "rgb(from var(--color-secondary) r g b / 0.4)",
          500: "var(--color-secondary)",
          600: "rgb(from var(--color-secondary) r g b / 0.8)",
          700: "rgb(from var(--color-secondary) r g b / 0.7)",
          800: "rgb(from var(--color-secondary) r g b / 0.6)",
          900: "rgb(from var(--color-secondary) r g b / 0.5)",
          DEFAULT: "var(--color-secondary)",
        },
        accent: {
          50: "rgb(from var(--color-accent) r g b / 0.05)",
          100: "rgb(from var(--color-accent) r g b / 0.1)",
          200: "rgb(from var(--color-accent) r g b / 0.2)",
          300: "rgb(from var(--color-accent) r g b / 0.3)",
          400: "rgb(from var(--color-accent) r g b / 0.4)",
          500: "var(--color-accent)",
          600: "rgb(from var(--color-accent) r g b / 0.8)",
          700: "rgb(from var(--color-accent) r g b / 0.7)",
          800: "rgb(from var(--color-accent) r g b / 0.6)",
          900: "rgb(from var(--color-accent) r g b / 0.5)",
          DEFAULT: "var(--color-accent)",
        },
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
          elevated: "var(--surface-elevated)",
          overlay: "var(--surface-overlay)",
          glass: "var(--surface-glass)",
        },
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          focus: "var(--border-focus)",
          DEFAULT: "var(--border-primary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
          DEFAULT: "var(--text-primary)",
        },
      },
      fontFamily: {
        default: ["system-ui", "sans-serif"],
        sora: ["Sora", "sans-serif"],
        code: ["Source Code Pro", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", "monospace"],
      },
      fontSize: {
        "xs": ["var(--text-xs)", { lineHeight: "var(--leading-xs)" }],
        "sm": ["var(--text-sm)", { lineHeight: "var(--leading-sm)" }],
        "base": ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
        "lg": ["var(--text-lg)", { lineHeight: "var(--leading-lg)" }],
        "xl": ["var(--text-xl)", { lineHeight: "var(--leading-xl)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-2xl)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-3xl)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-4xl)" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "var(--leading-5xl)" }],
        "6xl": ["var(--text-6xl)", { lineHeight: "var(--leading-6xl)" }],
      },
      letterSpacing: {
        tagline: ".15em",
        tight: "var(--tracking-tight)",
        normal: "var(--tracking-normal)",
        wide: "var(--tracking-wide)",
      },
      spacing: {
        0.25: "0.0625rem",
        7.5: "1.875rem",
        15: "3.75rem",
        // Modern semantic spacing
        "xs": "var(--space-xs)",
        "sm": "var(--space-sm)",
        "md": "var(--space-md)",
        "lg": "var(--space-lg)",
        "xl": "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
      },
      opacity: {
        15: ".15",
      },
      transitionDuration: {
        DEFAULT: "250ms",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
        spring: "var(--ease-spring)",
        bounce: "var(--ease-bounce)",
        smooth: "var(--ease-smooth)",
      },
      // Modern animation utilities
      animation: {
        "fade-in": "fadeIn var(--duration-normal) var(--ease-smooth)",
        "slide-up": "slideUp var(--duration-normal) var(--ease-spring)",
        "slide-down": "slideDown var(--duration-normal) var(--ease-spring)",
        "scale-in": "scaleIn var(--duration-fast) var(--ease-bounce)",
        "float": "float 6s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      // Modern backdrop blur
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      // Container queries support
      containers: {
        "2xs": "16rem",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        navbar: "50",
        dropdown: "100",
        modal: "200",
        popover: "300",
        tooltip: "400",
        toast: "500",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      // Modern gradient utilities
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "linear-gradient(45deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    plugin(function ({ addBase, addComponents, addUtilities, matchUtilities, theme }) {
      addBase({
        // Modern CSS reset and base styles
        "*": {
          "@apply border-border": {},
        },
        body: {
          "@apply bg-surface-primary text-text-primary antialiased": {},
          "font-feature-settings": '"cv11", "ss01"',
          "font-variation-settings": '"opsz" 32',
        },
      })

      addComponents({
        ".container": {
          "@apply max-w-[77.5rem] mx-auto p-6 md:p-10 lg:p-15 xl:max-w-[87.5rem]": {},
        },
        ".section-title": {
          "@apply text-5xl font-bold": {},
        },
        ".tagline": {
          "@apply text-xs tracking-tagline uppercase": {},
        },
        ".quote": {
          "@apply font-code text-lg leading-normal": {},
        },
        ".button": {
          "@apply font-code text-xs font-bold uppercase tracking-wider": {},
        },
        // Modern 2025 component utilities
        ".glass": {
          "@apply backdrop-blur-md bg-surface-glass border border-white/20": {},
        },
        ".surface-elevated": {
          "@apply bg-surface-elevated shadow-lg shadow-black/5": {},
        },
        ".text-gradient": {
          "@apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent": {},
        },
        ".mesh-gradient": {
          "@apply bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20": {},
        },
        // Modern interaction states
        ".interactive": {
          "@apply transition-all duration-normal ease-smooth hover:scale-[1.02] active:scale-[0.98]": {},
        },
        ".magnetic": {
          "@apply transition-transform duration-fast ease-smooth will-change-transform": {},
        },
        // Container query utilities
        ".container-query": {
          "@apply @container": {},
        },
      })

      addUtilities({
        ".tap-highlight-color": {
          "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        },
        // Modern performance utilities
        ".gpu-accelerated": {
          "transform": "translateZ(0)",
          "will-change": "transform",
        },
        ".optimize-text": {
          "text-rendering": "optimizeLegibility",
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
        },
        // View transition utilities
        ".view-transition": {
          "view-transition-name": "var(--transition-name)",
        },
        // Container query responsive utilities
        ".@xs\\:block": {
          "@container (min-width: 20rem)": {
            display: "block",
          },
        },
        ".@sm\\:block": {
          "@container (min-width: 24rem)": {
            display: "block",
          },
        },
        ".@md\\:block": {
          "@container (min-width: 28rem)": {
            display: "block",
          },
        },
        ".@lg\\:block": {
          "@container (min-width: 32rem)": {
            display: "block",
          },
        },
      })

      // Dynamic utilities for modern spacing
      matchUtilities(
        {
          "space-fluid": (value) => ({
            gap: `clamp(var(--space-xs), ${value}, var(--space-xl))`,
          }),
        },
        { values: theme("spacing") }
      )

      // Dynamic utilities for modern typography
      matchUtilities(
        {
          "text-fluid": (value) => ({
            "font-size": `clamp(var(--text-sm), ${value}, var(--text-2xl))`,
          }),
        },
        { values: theme("fontSize") }
      )
    }),
  ],
}
