import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-ts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["nanoid", "react-typed", "flowbite-react"],
        },
      },
    },
  },
})
