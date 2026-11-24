import { Link, NavLink } from 'react-router'
import { useDestinosContext } from '../../context/DestinosContext.jsx'
import { useReserva } from '../../context/ReservaContext.jsx'

const claseNav = ({ isActive }) =>
  `inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const { destinos } = useDestinosContext()
  const { cantidadItems } = useReserva()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-2xl" aria-hidden="true">
            ✈️
          </span>
          <span className="whitespace-nowrap text-slate-900">
            Viajes <span className="text-brand-600">PFY2202</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline">
            {destinos.length} destinos
          </span>
          <NavLink to="/" end className={claseNav}>
            Inicio
          </NavLink>
          <NavLink
            to="/carrito"
            className={claseNav}
            aria-label={`Reserva, ${cantidadItems} ${
              cantidadItems === 1 ? 'ítem' : 'ítems'
            }`}
          >
            <span aria-hidden="true">🛒</span>
            <span className="hidden sm:inline" aria-hidden="true">
              Reserva
            </span>
            {cantidadItems > 0 && (
              <span
                aria-hidden="true"
                className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-brand-700 ring-1 ring-brand-200"
              >
                {cantidadItems}
              </span>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
