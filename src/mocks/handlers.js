import { http, graphql, HttpResponse, delay } from 'msw'
import { destinosParaREST, getDestino } from './catalogo.js'

// Path que respeta la base de Vite: '/' en dev y '/viajes-.../' en Pages.
const API_DESTINOS = `${import.meta.env.BASE_URL}api/destinos`

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

    if (!destino) {
      // Error GraphQL (HTTP 200 con `errors`), NO un HTTP 404.
      return HttpResponse.json({
        errors: [{ message: `Destino no encontrado: ${slug}` }],
      })
    }

    return HttpResponse.json({
      data: {
        vuelos: destino.vuelos,
        hoteles: destino.hoteles,
      },
    })
  }),

  // -------------------------------------------------------------------------
  // GraphQL — mutation CrearReserva(input)
  // El total se recalcula en el "servidor": no se confía en el cliente.
  // -------------------------------------------------------------------------
  graphql.mutation('CrearReserva', async ({ variables }) => {
    await delay(1000)

    const input = variables?.input

    if (!input || !Array.isArray(input.items) || input.items.length === 0) {
      return HttpResponse.json({
        errors: [{ message: 'La reserva no tiene ítems.' }],
      })
    }

    const itemsValidos = input.items.every(
      (item) =>
        item &&
        typeof item.precio === 'number' &&
        Number.isFinite(item.precio) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0,
    )
    if (!itemsValidos) {
      return HttpResponse.json({
        errors: [{ message: 'Los ítems de la reserva no son válidos.' }],
      })
    }

    if (!input.cliente || input.cliente.trim().length < 3) {
      return HttpResponse.json({
        errors: [{ message: 'El nombre del cliente es obligatorio.' }],
      })
    }

    if (!input.email || !input.email.includes('@')) {
      return HttpResponse.json({
        errors: [{ message: 'El email del cliente no es válido.' }],
      })
    }

    // Trigger determinista para probar el estado de error en la UI.
    if (input.email.trim().toLowerCase() === 'error@test.com') {
      return HttpResponse.json({
        errors: [
          { message: 'No se pudo procesar la reserva. Intenta nuevamente.' },
        ],
      })
    }

    const total = input.items.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0,
    )
    const codigo = `RSV-${Date.now().toString(36).toUpperCase()}`

    return HttpResponse.json({
      data: {
        crearReserva: {
          codigo,
          estado: 'CONFIRMADA',
          total,
          cliente: input.cliente.trim(),
          email: input.email.trim(),
          fechaViaje: input.fechaViaje ?? null,
          creadaEn: new Date().toISOString(),
          items: input.items.map((item) => ({
            id: item.id,
            tipo: item.tipo,
            titulo: item.titulo,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
        },
      },
    })
  }),
]
