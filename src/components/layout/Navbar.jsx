import { Link, NavLink } from 'react-router'
import { useDestinosContext } from '../../context/DestinosContext.jsx'

const claseNav = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const { destinos } = useDestinosContext()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-2xl" aria-hidden="true">
            ✈️
          </span>
          <span className="text-slate-900">
            Viajes <span className="text-brand-600">PFY2202</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline">
            {destinos.length} destinos
          </span>
          <NavLink to="/" end className={claseNav}>
            Inicio
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
