// Cliente HTTP minimo para la capa REST.
// API_BASE respeta la base de Vite para funcionar igual en dev y en GitHub Pages.

export const API_BASE = `${import.meta.env.BASE_URL}api`

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Realiza un GET/POST y devuelve el JSON. Lanza ApiError si la respuesta no es 2xx.
 *
 * @param {string} path   Ruta relativa a API_BASE, p. ej. '/destinos'
 * @param {RequestInit} options  Opciones de fetch (signal, method, etc.)
 */
export async function pedirJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)

  if (!res.ok) {
    let detalle
    try {
      detalle = await res.json()
    } catch {
      // La respuesta no era JSON; se usa el status como mensaje.
    }
    throw new ApiError(detalle?.error || `Error ${res.status}`, res.status)
  }

  return res.json()
}
