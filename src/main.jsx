import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

async function enableMocking() {
  // Vite: en dev (DEV) o en el build de GitHub Pages (MODE === 'pages').
  // NUNCA usar process.env.NODE_ENV en el navegador.
  const debeMockear = import.meta.env.DEV || import.meta.env.MODE === 'pages'
  if (!debeMockear) return

  const { worker } = await import('./mocks/browser.js')

  return worker.start({
    serviceWorker: {
      // Respeta la base de Vite para que Pages encuentre el worker.
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    onUnhandledRequest: 'bypass',
  })
}

function render() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

enableMocking()
  .then(render)
  .catch((error) => {
    console.error('[MSW] No se pudo iniciar el mocking:', error)
    render()
  })
