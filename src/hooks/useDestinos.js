import { useState, useEffect, useCallback } from 'react'
import { pedirJson } from '../lib/api.js'

/**
 * Carga la lista de destinos desde la API REST.
 *
 * @returns {{
 *   destinos: Array,
 *   loading: boolean,
 *   error: Error|null,
 *   retry: () => void
 * }}
 */
export function useDestinos() {
  const [destinos, setDestinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Al incrementar `intento` se relanza el efecto (boton "Reintentar").
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    pedirJson('/destinos', { signal: controller.signal })
      .then((data) => setDestinos(data))
      .catch((err) => {
        // AbortError se produce al desmontar: no es un fallo real.
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setLoading(false))

    // Cleanup: cancela la peticion si el componente se desmonta o cambia `intento`.
    return () => controller.abort()
  }, [intento])

  const retry = useCallback(() => setIntento((n) => n + 1), [])

  return { destinos, loading, error, retry }
}
