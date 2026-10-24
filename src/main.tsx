import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/geist-pixel'
import '@fontsource/silkscreen'
import '@fontsource-variable/martian-mono'
import '@fontsource-variable/doto'
import '@fontsource-variable/bitcount-grid-single'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
