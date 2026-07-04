import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // long-cacheable vendor chunks: app edits no longer invalidate library code
        manualChunks: {
          react: ['react', 'react-dom'],
          gsap: ['gsap', '@gsap/react'],
          motion: ['motion'],
        },
      },
    },
  },
})
