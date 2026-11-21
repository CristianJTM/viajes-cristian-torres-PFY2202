import { formatearPrecio } from '../../lib/formato.js'

/**
 * Tarjeta de un hotel proveniente de GraphQL.
 */
export default function HotelCard({ hotel }) {
  const { nombre, categoria, precioNoche, disponible } = hotel

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-slate-900">{nombre}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            disponible
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {disponible ? 'Disponible' : 'Agotado'}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-700">⭐ {categoria}</p>
      <p className="mt-3 text-lg font-extrabold text-brand-700">
        {formatearPrecio(precioNoche)}
        <span className="ml-1 text-sm font-medium text-slate-500">/ noche</span>
      </p>
    </article>
  )
}
