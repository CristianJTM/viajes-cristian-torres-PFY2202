import { Link } from 'react-router'
import {
  formatearFecha,
  formatearFechaHora,
  formatearPrecio,
} from '../../lib/formato.js'

/**
 * Panel de confirmación tras una reserva exitosa.
 */
export default function ReservaExitosa({ reserva, onNuevaReserva }) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        <span aria-hidden="true">✅</span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        ¡Reserva confirmada!
      </h1>
      <p className="mt-2 text-slate-600">Guarda tu código de reserva:</p>
      <p className="mt-3 inline-block rounded-xl bg-brand-50 px-5 py-2 text-2xl font-black tracking-widest text-brand-700">
        {reserva.codigo}
      </p>

      <dl className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-600">Cliente</dt>
          <dd className="font-semibold text-slate-900">{reserva.cliente}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-600">Email</dt>
          <dd className="font-semibold text-slate-900">{reserva.email}</dd>
        </div>
        {reserva.estado && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Estado</dt>
            <dd className="font-semibold text-emerald-700">
              {reserva.estado === 'CONFIRMADA' ? 'Confirmada' : reserva.estado}
            </dd>
          </div>
        )}
        {reserva.fechaViaje && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Fecha de viaje</dt>
            <dd className="font-semibold text-slate-900">
              {formatearFecha(reserva.fechaViaje)}
            </dd>
          </div>
        )}
        {reserva.creadaEn && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Creada</dt>
            <dd className="font-semibold text-slate-900">
              {formatearFechaHora(reserva.creadaEn)}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base">
          <dt className="font-semibold text-slate-900">Total</dt>
          <dd className="font-extrabold text-brand-700">
            {formatearPrecio(reserva.total)}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onNuevaReserva}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Nueva reserva
        </button>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
