import { formatearFecha, formatearPrecio } from '../../lib/formato.js'

/**
 * Tarjeta de un vuelo proveniente de GraphQL.
 */
export default function VueloCard({ vuelo }) {
  const { aerolinea, origen, destino, precio, fecha, disponible } = vuelo

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-slate-900">{aerolinea}</h3>
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

      <p className="mt-3 text-sm font-medium text-slate-700">
        {origen} <span className="text-slate-400">→</span> {destino}
      </p>
      <p className="mt-1 text-sm text-slate-500">📅 {formatearFecha(fecha)}</p>
      <p className="mt-3 text-lg font-extrabold text-brand-700">
        {formatearPrecio(precio)}
      </p>
    </article>
  )
}
