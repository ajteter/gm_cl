import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initWebViewEnvironment } from './utils/webviewUtils.js'

// 初始化WebView环境（仅在开发环境中输出详细信息）
if (process.env.NODE_ENV === 'development') {
  initWebViewEnvironment()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
