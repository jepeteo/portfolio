/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/assets/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],

  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        default: ["system-ui", "sans-serif"],
        sora: ["Sora", "sans-serif"],
        code: ["Source Code Pro", "monospace"],
      },
      letterSpacing: {
        tagline: ".15em",
      },
      spacing: {
        0.25: "0.0625rem",
        7.5: "1.875rem",
        15: "3.75rem",
      },
      opacity: {
        15: ".15",
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({})
      addComponents({
        ".container": {
          "@apply max-w-[77.5rem] mx-auto p-6 md:p-10 lg:p-15 xl:max-w-[87.5rem]":
            {},
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
      })
      addUtilities({
        ".tap-highlight-color": {
          "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        },
      })
    }),
  ],
}
