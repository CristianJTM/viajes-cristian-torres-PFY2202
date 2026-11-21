import { Link } from 'react-router'

/**
 * Tarjeta de destino. Toda la tarjeta navega a /destino/:slug.
 */
export default function DestinoCard({ destino }) {
  const { slug, nombre, pais, emoji, descripcion, actividades } = destino

  return (
    <Link
      to={`/destino/${slug}`}
      className="card group flex flex-col p-5 focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>

      <h2 className="mt-3 text-xl font-bold text-slate-900 transition group-hover:text-brand-600">
        {nombre}
      </h2>
      <p className="text-sm font-medium text-slate-500">{pais}</p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{descripcion}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {actividades.slice(0, 3).map((actividad) => (
          <li
            key={actividad}
            className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
          >
            {actividad}
          </li>
        ))}
      </ul>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        Ver vuelos y hoteles <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}
