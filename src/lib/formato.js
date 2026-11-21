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

export function formatearPrecio(valor) {
  if (typeof valor !== 'number' || Number.isNaN(valor)) return '—'
  return formatoCLP.format(valor)
}

export function formatearFecha(valor) {
  if (!valor) return '—'
  const [anio, mes, dia] = valor.split('-').map(Number)
  if (!anio || !mes || !dia) return valor
  // Se construye en UTC para evitar corrimientos de zona horaria.
  return formatoFecha.format(new Date(Date.UTC(anio, mes - 1, dia)))
}
