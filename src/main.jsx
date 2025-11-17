import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const mount = () => {
  try {
    const rootEl = document.getElementById('root')
    if (!rootEl) throw new Error('Root element not found')
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (e) {
    console.error('App mount error:', e)
    const rootEl = document.getElementById('root') || document.body
    const div = document.createElement('div')
    div.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#fde2e4;color:#333;z-index:9999;font-family:system-ui;padding:24px;text-align:center;'
    div.innerText = '页面初始化失败，请刷新重试。' + (e && e.message ? ('\n' + e.message) : '')
    rootEl.appendChild(div)
  }
}

window.addEventListener('error', (evt) => {
  console.error('Global error:', evt.error || evt.message)
})

mount()