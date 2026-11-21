import { useDestinosContext } from '../context/DestinosContext.jsx'
import DestinoCard from '../components/ui/DestinoCard.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

export default function Home() {
  const { destinos, loading, error, retry } = useDestinosContext()

  const subtitulo = loading
    ? 'Cargando destinos…'
    : `${destinos.length} destinos disponibles`

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Descubre tu próximo destino
        </h1>
        <p className="mt-2 text-slate-600">{subtitulo}</p>
      </header>

      {loading && <LoadingSpinner label="Cargando destinos…" />}

      {!loading && error && (
        <ErrorMessage message={error.message} onRetry={retry} />
      )}

      {!loading && !error && destinos.length === 0 && (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 ring-1 ring-slate-200">
          No hay destinos disponibles por el momento.
        </p>
      )}

      {!loading && !error && destinos.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinos.map((destino) => (
            <DestinoCard key={destino.slug} destino={destino} />
          ))}
        </div>
      )}
    </section>
  )
}
