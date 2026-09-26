import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { ThemeProvider } from 'next-themes'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
    <App />
  </ThemeProvider>
)
