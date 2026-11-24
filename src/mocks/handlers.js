import { http, graphql, HttpResponse, delay } from 'msw'
import { destinosParaREST, getDestino, getItemCatalogo } from './catalogo.js'
import { CANTIDAD_MAX, CANTIDAD_MIN } from '../lib/limites.js'

// Path que respeta la base de Vite: '/' en dev y '/viajes-.../' en Pages.
const API_DESTINOS = `${import.meta.env.BASE_URL}api/destinos`

// Error GraphQL: HTTP 200 con `errors[]` (nunca HTTP 404).
const errorGraphQL = (message) => HttpResponse.json({ errors: [{ message }] })

export const handlers = [
  // -------------------------------------------------------------------------
  // REST — GET /api/destinos
  // -------------------------------------------------------------------------
  http.get(API_DESTINOS, async ({ request }) => {
    await delay(1000)

    const url = new URL(request.url)
    if (url.searchParams.get('fail') === '500') {
      return HttpResponse.json({ error: 'Error del servidor' }, { status: 500 })
    }

    return HttpResponse.json(destinosParaREST())
  }),

  // -------------------------------------------------------------------------
  // GraphQL — query DetalleDestino($slug: String!)
  // Se matchea por nombre de operación, no por path.
  // -------------------------------------------------------------------------
  graphql.query('DetalleDestino', async ({ variables }) => {
    await delay(1000)

    const slug = variables?.slug
    const destino = getDestino(slug)

    if (!destino) return errorGraphQL(`Destino no encontrado: ${slug}`)

    return HttpResponse.json({
      data: {
        vuelos: destino.vuelos,
        hoteles: destino.hoteles,
      },
    })
  }),

  // -------------------------------------------------------------------------
  // GraphQL — mutation CrearReserva(input)
  // Precio, título y tipo se toman del catálogo: no se confía en el cliente.
  // -------------------------------------------------------------------------
  graphql.mutation('CrearReserva', async ({ variables }) => {
    await delay(1000)

    const input = variables?.input

    if (!input) return errorGraphQL('La reserva no tiene datos.')

    if (!Array.isArray(input.items) || input.items.length === 0) {
      return errorGraphQL('La reserva no tiene ítems.')
    }

    const itemsValidos = input.items.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        Number.isInteger(item.cantidad) &&
        item.cantidad >= CANTIDAD_MIN &&
        item.cantidad <= CANTIDAD_MAX,
    )
    if (!itemsValidos) {
      return errorGraphQL('Los ítems de la reserva no son válidos.')
    }

    // typeof antes de .trim()/.includes(): un valor no-string lanzaría un
    // TypeError dentro del handler y Apollo quedaría sin respuesta útil.
    if (typeof input.cliente !== 'string' || input.cliente.trim().length < 3) {
      return errorGraphQL('El nombre del cliente es obligatorio.')
    }

    if (typeof input.email !== 'string' || !input.email.includes('@')) {
      return errorGraphQL('El email del cliente no es válido.')
    }

    // Trigger determinista para probar el estado de error en la UI.
    if (input.email.trim().toLowerCase() === 'error@test.com') {
      return errorGraphQL('No se pudo procesar la reserva. Intenta nuevamente.')
    }

    const itemsReserva = []
    for (const item of input.items) {
      const real = getItemCatalogo(item.id)
      if (!real) {
        return errorGraphQL(`El ítem ${item.id} no existe en el catálogo.`)
      }

      itemsReserva.push({
        id: item.id,
        tipo: real.tipo,
        titulo: real.titulo,
        cantidad: item.cantidad,
        precio: real.precio,
      })
    }

    const total = itemsReserva.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0,
    )
    const codigo = `RSV-${Date.now().toString(36).toUpperCase()}`
    const fechaViaje =
      typeof input.fechaViaje === 'string' && input.fechaViaje
        ? input.fechaViaje
        : null

    return HttpResponse.json({
      data: {
        crearReserva: {
          codigo,
          estado: 'CONFIRMADA',
          total,
          cliente: input.cliente.trim(),
          email: input.email.trim(),
          fechaViaje,
          creadaEn: new Date().toISOString(),
          items: itemsReserva,
        },
      },
    })
  }),
]
