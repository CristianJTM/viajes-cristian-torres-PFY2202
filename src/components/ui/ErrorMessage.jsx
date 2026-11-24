/**
 * Mensaje de error reutilizable con reintento opcional.
 */
export default function ErrorMessage({
  title = 'No pudimos cargar la información',
  message = 'Ocurrió un error inesperado.',
  onRetry,
}) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
    >
      <p className="text-lg font-semibold text-red-700">{title}</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
