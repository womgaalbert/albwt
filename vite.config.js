import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// Injects the Google Search Console verification tag only when
// VITE_GOOGLE_SITE_VERIFICATION is set (keeps index.html free of placeholders).
/** @param {string} token */
function googleSiteVerification(token) {
  return {
    name: 'google-site-verification',
    transformIndexHtml() {
      return token
        ? [{ tag: 'meta', attrs: { name: 'google-site-verification', content: token }, injectTo: 'head' }]
        : [];
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), googleSiteVerification(loadEnv(mode, process.cwd(), '').VITE_GOOGLE_SITE_VERIFICATION || '')],
  server: {
    host: true, // Bind all interfaces (IPv4 + IPv6) so localhost always resolves
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
}));
