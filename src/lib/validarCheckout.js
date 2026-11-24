// Validación del formulario de checkout (pura, sin React).
// Vive en lib/ para que la página quede enfocada en la UI y la regla
// sea reutilizable y testeable por separado.

/** Fecha de hoy en formato `YYYY-MM-DD`, el que espera <input type="date">. */
export function fechaHoyISO() {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}

/**
 * Devuelve un objeto { campo: mensaje } con los errores del formulario.
 * Un objeto vacío significa que el formulario es válido.
 */
export function validarCheckout(formulario) {
  const errores = {}

  if (formulario.nombre.trim().length < 3) {
    errores.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
    errores.email = 'Ingresa un email válido.'
  }

  if (!formulario.fechaViaje) {
    errores.fechaViaje = 'Selecciona la fecha de viaje.'
  } else if (formulario.fechaViaje < fechaHoyISO()) {
    errores.fechaViaje = 'La fecha debe ser hoy o posterior.'
  }

  return errores
}
