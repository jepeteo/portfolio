import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["nanoid", "react-typed", "flowbite-react"],
        },
      },
      external: (id) => {
        // Don't externalize any local modules
        return false;
      }
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
