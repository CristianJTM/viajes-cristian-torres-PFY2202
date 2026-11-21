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
]
