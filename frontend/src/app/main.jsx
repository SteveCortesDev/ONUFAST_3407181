import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css' // <-- Cambiamos la ruta usando el alias
import App from './App.jsx'  // <-- Este se queda igual, porque App.jsx también está en la carpeta 'app'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)