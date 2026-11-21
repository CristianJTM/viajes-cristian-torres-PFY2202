import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'
import { DestinosProvider } from '../../context/DestinosContext.jsx'

export default function AppLayout() {
  return (
    <DestinosProvider>
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
    </DestinosProvider>
  )
}
