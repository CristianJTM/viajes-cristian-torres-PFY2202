import { useState, useEffect, useCallback } from 'react'
import { pedirJson } from '../lib/api.js'

/**
 * Permite disparar el error del mock REST desde la URL: /?fail=500
 * (equivalente a `error@test.com` en la mutación GraphQL).
 */
function rutaDestinos() {
  const fail = new URLSearchParams(window.location.search).get('fail')
  return fail === '500' ? '/destinos?fail=500' : '/destinos'
}

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

    pedirJson(rutaDestinos(), { signal: controller.signal })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('La respuesta de destinos no tiene el formato esperado.')
        }
        if (!controller.signal.aborted) setDestinos(data)
      })
      .catch((err) => {
        // AbortError se produce al desmontar o al reintentar: no es un fallo real.
        if (err.name !== 'AbortError' && !controller.signal.aborted) setError(err)
      })
      .finally(() => {
        // Guard por señal: al abortar (StrictMode/retry) el finally de la
        // petición vieja apagaría el spinner de la petición nueva.
        if (!controller.signal.aborted) setLoading(false)
      })

    // Cleanup: cancela la peticion si el componente se desmonta o cambia `intento`.
    return () => controller.abort()
  }, [intento])

  const retry = useCallback(() => setIntento((n) => n + 1), [])

  return { destinos, loading, error, retry }
}
