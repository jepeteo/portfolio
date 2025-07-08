import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  build: {
    // Enhanced build optimization for 2025
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Enhanced chunk splitting strategy
        manualChunks: {
          // Core React chunks
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],

          // UI library chunks
          'ui-vendor': ['lucide-react', 'flowbite-react'],

          // Utils and smaller dependencies
          'utils': ['nanoid', 'react-typed'],

          // EmailJS (only loaded when contact form is used)
          'emailjs': ['@emailjs/browser'],
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            if (facadeModuleId.includes('components/')) {
              return 'assets/components/[name]-[hash].js'
            }
            if (facadeModuleId.includes('utils/')) {
              return 'assets/utils/[name]-[hash].js'
            }
          }
          return 'assets/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash].css'
          }
          if (assetInfo.name?.match(/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (assetInfo.name?.match(/\.(woff2?|eot|ttf|otf)$/i)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
      // Don't externalize anything - keep everything bundled
      external: [],
    },
    // Performance optimizations
    chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1MB
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
  // Enhanced development server
  server: {
    host: true,
    port: 5173,
    // Enable HTTP/2 for development
    https: false,
    // Add headers for development
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.emailjs.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://eu-assets.i.posthog.com https://app.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://app.posthog.com; base-uri 'self'; form-action 'self'; object-src 'none';"
    },
    // Preload important modules
    warmup: {
      clientFiles: [
        './src/components/Hero.tsx',
        './src/components/ModernSkills.tsx',
        './src/components/Contact.tsx',
      ],
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
    ],
    // Force optimization of specific dependencies
    force: true,
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      // Enable CSS optimization
    },
  },
  // Experimental features for 2025
  experimental: {
    // Enable build-time optimizations
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `"${filename}"` }
      }
      return { relative: true }
    },
  },
})
