import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [react()],
  server: {
    host: true, // Bind all interfaces (IPv4 + IPv6) so localhost always resolves
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});