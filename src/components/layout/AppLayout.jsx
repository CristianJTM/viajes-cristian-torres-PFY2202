import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from './Navbar.jsx'
import { DestinosProvider } from '../../context/DestinosContext.jsx'
import { ReservaProvider } from '../../context/ReservaContext.jsx'

export default function AppLayout() {
  const { pathname } = useLocation()

  // En una SPA el scroll se conserva al cambiar de ruta; lo reiniciamos.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <DestinosProvider>
      <ReservaProvider>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <Navbar />

          <main className="flex-1">
            <Outlet />
          </main>

          <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Agencia de Viajes — Desarrollo Frontend II
            (PFY2202)
          </footer>
        </div>
      </ReservaProvider>
    </DestinosProvider>
  )
}
