import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Monetag Service Worker (delayed to avoid blocking page render in WebView)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      try {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('SW registered:', registration.scope);
        }).catch((err) => {
          console.warn('SW registration failed:', err);
        });
      } catch (e) {
        console.warn('SW registration error:', e);
      }
    }, 3000);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
