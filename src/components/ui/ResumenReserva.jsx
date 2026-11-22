import { formatearPrecio } from '../../lib/formato.js'

/**
 * Tarjeta de resumen con cantidad de ítems y total de la reserva.
 */
export default function ResumenReserva({ cantidadItems, total, onVaciar }) {
  return (
    <aside className="card p-6">
      <h2 className="text-lg font-bold text-slate-900">Resumen de la reserva</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Ítems seleccionados</dt>
          <dd className="font-semibold text-slate-900">{cantidadItems}</dd>
        </div>
        <div className="flex items-end justify-between border-t border-slate-200 pt-3">
          <dt className="text-base font-semibold text-slate-900">Total</dt>
          <dd className="text-2xl font-extrabold text-brand-700">
            {formatearPrecio(total)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onVaciar}
        className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
      >
        Vaciar reserva
      </button>
    </aside>
  )
}
