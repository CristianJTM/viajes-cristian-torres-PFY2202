import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'viajes:reserva:v1'
const CANTIDAD_MIN = 1
const CANTIDAD_MAX = 30

function normalizarCantidad(valor) {
  const numero = Number(valor)
  if (!Number.isFinite(numero)) return CANTIDAD_MIN
  return Math.min(CANTIDAD_MAX, Math.max(CANTIDAD_MIN, Math.floor(numero)))
}

function esItemValido(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    (item.tipo === 'vuelo' || item.tipo === 'hotel') &&
    typeof item.precio === 'number' &&
    Number.isFinite(item.precio)
  )
}

function cargarInicial() {
  try {
    const crudo = localStorage.getItem(STORAGE_KEY)
    if (!crudo) return { items: [] }

    const parseado = JSON.parse(crudo)
    if (!parseado || !Array.isArray(parseado.items)) return { items: [] }

    return {
      items: parseado.items
        .filter(esItemValido)
        .map((item) => ({ ...item, cantidad: normalizarCantidad(item.cantidad) })),
    }
  } catch {
    // Carrito corrupto o localStorage no disponible: se arranca vacío.
    return { items: [] }
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'AGREGAR': {
      // Un mismo id no se duplica: el botón alterna agregar/quitar.
      if (state.items.some((item) => item.id === action.item.id)) return state
      return { items: [...state.items, { ...action.item, cantidad: CANTIDAD_MIN }] }
    }
    case 'QUITAR':
      return { items: state.items.filter((item) => item.id !== action.id) }
    case 'CAMBIAR_CANTIDAD':
      return {
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, cantidad: normalizarCantidad(action.cantidad) }
            : item,
        ),
      }
    case 'VACIAR':
      return { items: [] }
    default:
      return state
  }
}

const ReservaContext = createContext(null)

export function ReservaProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, cargarInicial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Sin persistencia (modo privado/cuota): la app sigue funcionando.
    }
  }, [state])

  const value = useMemo(() => {
    const total = state.items.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0,
    )

    return {
      items: state.items,
      total,
      cantidadItems: state.items.length,
      agregar: (item) => dispatch({ type: 'AGREGAR', item }),
      quitar: (id) => dispatch({ type: 'QUITAR', id }),
      cambiarCantidad: (id, cantidad) =>
        dispatch({ type: 'CAMBIAR_CANTIDAD', id, cantidad }),
      vaciar: () => dispatch({ type: 'VACIAR' }),
      estaEnReserva: (id) => state.items.some((item) => item.id === id),
    }
  }, [state.items])

  return <ReservaContext.Provider value={value}>{children}</ReservaContext.Provider>
}

export function useReserva() {
  const contexto = useContext(ReservaContext)
  if (!contexto) {
    throw new Error('useReserva debe usarse dentro de <ReservaProvider>')
  }
  return contexto
}
