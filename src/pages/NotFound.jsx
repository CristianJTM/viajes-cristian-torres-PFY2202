import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-black text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Página no encontrada
      </h1>
      <p className="mt-2 text-slate-600">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
      >
        <span aria-hidden="true">←</span> Volver al inicio
      </Link>
    </section>
  )
}
