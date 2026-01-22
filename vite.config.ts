import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-sentry': ['@sentry/react', '@sentry/node'],
          'vendor-analytics': ['@vercel/analytics', '@vercel/speed-insights'],
          'vendor-helmet': ['react-helmet-async'],
          'vendor-resend': ['resend'],
        },
      },
    },
  },
})
