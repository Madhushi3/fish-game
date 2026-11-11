import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/marcconrad': {
        target: 'https://marcconrad.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/marcconrad/, ''),
        secure: false,
      },
    },
  },
})
