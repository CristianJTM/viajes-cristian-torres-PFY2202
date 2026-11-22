import { Link, useParams } from 'react-router'
import { useQuery, gql } from '@apollo/client'
import { useDestinosContext } from '../context/DestinosContext.jsx'
import { useReserva } from '../context/ReservaContext.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import HotelCard from '../components/ui/HotelCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import VueloCard from '../components/ui/VueloCard.jsx'

// Query nombrada: MSW la matchea por su operationName "DetalleDestino".
export const DETALLE_DESTINO = gql`
  query DetalleDestino($slug: String!) {
    vuelos(slug: $slug) {
      id
      aerolinea
      origen
      destino
      precio
      fecha
      disponible
    }
    hoteles(slug: $slug) {
      id
      nombre
      categoria
      precioNoche
      disponible
    }
  }
`

function prettifySlug(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ')
}

function SinResultados({ mensaje }) {
  return (
    <p className="rounded-xl bg-white p-6 text-center text-slate-500 ring-1 ring-slate-200">
      {mensaje}
    </p>
  )
}

export default function DetalleDestino() {
  const { slug } = useParams()
  const { destinos } = useDestinosContext()
  const { agregar, quitar, estaEnReserva, cantidadItems } = useReserva()
  const { loading, error, data } = useQuery(DETALLE_DESTINO, {
    variables: { slug },
  })

  // El nombre/emoji viene del contexto REST; si aún no cargó, se usa el slug.
  const destino = destinos.find((d) => d.slug === slug)
  const titulo = destino ? `${destino.emoji} ${destino.nombre}` : prettifySlug(slug)
  const destinoNombre = destino?.nombre ?? prettifySlug(slug)

  function alternarVuelo(vuelo) {
    if (estaEnReserva(vuelo.id)) {
      quitar(vuelo.id)
      return
    }

    agregar({
      id: vuelo.id,
      tipo: 'vuelo',
      destinoSlug: slug,
      destinoNombre,
      titulo: vuelo.aerolinea,
      subtitulo: `${vuelo.origen} → ${vuelo.destino}`,
      precio: vuelo.precio,
      unidad: 'pasajero',
    })
  }

  function alternarHotel(hotel) {
    if (estaEnReserva(hotel.id)) {
      quitar(hotel.id)
      return
    }

    agregar({
      id: hotel.id,
      tipo: 'hotel',
      destinoSlug: slug,
      destinoNombre,
      titulo: hotel.nombre,
      subtitulo: hotel.categoria,
      precio: hotel.precioNoche,
      unidad: 'noche',
    })
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
      >
        <span aria-hidden="true">←</span> Volver a destinos
      </Link>

      <header className="mb-6 mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {titulo}
        </h1>
        {destino && (
          <p className="mt-1 text-slate-600">
            {destino.pais} · {destino.descripcion}
          </p>
        )}
      </header>

      {cantidadItems > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm ring-1 ring-brand-100">
          <p className="font-semibold text-brand-800">
            🛒 {cantidadItems} {cantidadItems === 1 ? 'ítem' : 'ítems'} en tu
            reserva
          </p>
          <Link
            to="/carrito"
            className="font-semibold text-brand-700 hover:underline"
          >
            Ver reserva →
          </Link>
        </div>
      )}

      {loading && <LoadingSpinner label="Buscando vuelos y hoteles…" />}

      {!loading && error && <ErrorMessage message={error.message} />}

      {!loading && !error && data && (
        <div className="space-y-10">
          <section aria-labelledby="titulo-vuelos">
            <h2
              id="titulo-vuelos"
              className="mb-4 text-2xl font-bold text-slate-900"
            >
              ✈️ Vuelos
            </h2>
            {data.vuelos.length === 0 ? (
              <SinResultados mensaje="No hay vuelos disponibles para este destino." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.vuelos.map((vuelo) => (
                  <VueloCard
                    key={vuelo.id}
                    vuelo={vuelo}
                    enReserva={estaEnReserva(vuelo.id)}
                    onAgregar={() => alternarVuelo(vuelo)}
                  />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="titulo-hoteles">
            <h2
              id="titulo-hoteles"
              className="mb-4 text-2xl font-bold text-slate-900"
            >
              🏨 Hoteles
            </h2>
            {data.hoteles.length === 0 ? (
              <SinResultados mensaje="No hay hoteles disponibles para este destino." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.hoteles.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    enReserva={estaEnReserva(hotel.id)}
                    onAgregar={() => alternarHotel(hotel)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
