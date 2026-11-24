// Helpers de formato reutilizables por las tarjetas de vuelos y hoteles.

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const formatoFecha = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const formatoFechaHora = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatearPrecio(valor) {
  if (typeof valor !== 'number' || Number.isNaN(valor)) return '—'
  return formatoCLP.format(valor)
}

/** Formatea un timestamp ISO (p. ej. `creadaEn` de la reserva). */
export function formatearFechaHora(valor) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return valor
  return formatoFechaHora.format(fecha)
}

export function formatearFecha(valor) {
  // Misma guarda de tipo que formatearPrecio: `valor.split` solo existe en strings.
  if (typeof valor !== 'string' || valor === '') return '—'
  const [anio, mes, dia] = valor.split('-').map(Number)
  if (!anio || !mes || !dia) return valor
  // Se construye en UTC para evitar corrimientos de zona horaria.
  return formatoFecha.format(new Date(Date.UTC(anio, mes - 1, dia)))
}
