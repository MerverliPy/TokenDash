import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './styles.css'

function ensurePwaHeadTags() {
  if (typeof document === 'undefined') {
    return
  }

  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link')
    manifestLink.rel = 'manifest'
    manifestLink.href = '/manifest.webmanifest'
    document.head.appendChild(manifestLink)
  }

  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta')
    themeColor.name = 'theme-color'
    themeColor.content = '#4a73ff'
    document.head.appendChild(themeColor)
  }

  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const touchIconLink = document.createElement('link')
    touchIconLink.rel = 'apple-touch-icon'
    touchIconLink.href = '/app-icon-192.svg'
    document.head.appendChild(touchIconLink)
  }
}

ensurePwaHeadTags()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
