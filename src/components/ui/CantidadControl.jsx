const claseBoton =
  'flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold leading-none text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Control de cantidad reutilizable (− / n / +).
 */
export default function CantidadControl({
  cantidad,
  onChange,
  etiqueta = 'unidades',
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(cantidad - 1)}
        disabled={cantidad <= 1}
        aria-label={`Disminuir ${etiqueta}`}
        className={claseBoton}
      >
        −
      </button>

      <span className="w-8 text-center text-sm font-bold text-slate-900">
        {cantidad}
      </span>

      <button
        type="button"
        onClick={() => onChange(cantidad + 1)}
        disabled={cantidad >= 30}
        aria-label={`Aumentar ${etiqueta}`}
        className={claseBoton}
      >
        +
      </button>

      <span className="text-xs text-slate-500">{etiqueta}</span>
    </div>
  )
}
