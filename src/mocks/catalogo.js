// ============================================================================
// catalogo.js — FUENTE UNICA DE DATOS
// ----------------------------------------------------------------------------
// Cada destino contiene sus vuelos y hoteles embebidos. De este modo el slug
// es unico y no puede desincronizarse entre las dos capas (REST y GraphQL):
//   - REST  -> destinosParaREST()  (sin vuelos/hoteles)
//   - GraphQL -> getDestino(slug)  (lee vuelos y hoteles del mismo destino)
// ============================================================================

export const destinos = [
  {
    slug: 'paris',
    nombre: 'París',
    pais: 'Francia',
    emoji: '🗼',
    descripcion: 'La ciudad de la luz: arte, historia y gastronomía inolvidable.',
    actividades: ['Torre Eiffel', 'Museo del Louvre', 'Crucero por el Sena', 'Barrio de Montmartre'],
    vuelos: [
      {
        id: 'v-paris-1',
        aerolinea: 'Air France',
        origen: 'Buenos Aires',
        destino: 'París',
        precio: 920000,
        fecha: '2026-12-15',
        disponible: true,
      },
      {
        id: 'v-paris-2',
        aerolinea: 'LATAM',
        origen: 'Santiago',
        destino: 'París',
        precio: 850000,
        fecha: '2026-12-20',
        disponible: true,
      },
      {
        id: 'v-paris-3',
        aerolinea: 'Iberia',
        origen: 'Madrid',
        destino: 'París',
        precio: 180000,
        fecha: '2026-12-10',
        disponible: false,
      },
    ],
    hoteles: [
      {
        id: 'h-paris-1',
        nombre: 'Hôtel Le Meurice',
        categoria: '5 estrellas',
        precioNoche: 320000,
        disponible: true,
      },
      {
        id: 'h-paris-2',
        nombre: 'Ibis Paris Montmartre',
        categoria: '3 estrellas',
        precioNoche: 95000,
        disponible: true,
      },
      {
        id: 'h-paris-3',
        nombre: 'Le Petit Château',
        categoria: '4 estrellas',
        precioNoche: 160000,
        disponible: false,
      },
    ],
  },
  {
    slug: 'tokyo',
    nombre: 'Tokio',
    pais: 'Japón',
    emoji: '🏯',
    descripcion: 'Tradición milenaria y tecnología punta en una sola metrópolis.',
    actividades: ['Cruce de Shibuya', 'Templo Senso-ji', 'Akihabara', 'Parque Ueno'],
    vuelos: [
      {
        id: 'v-tokyo-1',
        aerolinea: 'Japan Airlines',
        origen: 'Los Ángeles',
        destino: 'Tokio',
        precio: 1100000,
        fecha: '2026-12-18',
        disponible: true,
      },
      {
        id: 'v-tokyo-2',
        aerolinea: 'ANA',
        origen: 'Nueva York',
        destino: 'Tokio',
        precio: 1250000,
        fecha: '2026-12-22',
        disponible: true,
      },
      {
        id: 'v-tokyo-3',
        aerolinea: 'LATAM',
        origen: 'Santiago',
        destino: 'Tokio',
        precio: 980000,
        fecha: '2026-12-12',
        disponible: false,
      },
    ],
    hoteles: [
      {
        id: 'h-tokyo-1',
        nombre: 'Park Hyatt Tokyo',
        categoria: '5 estrellas',
        precioNoche: 400000,
        disponible: true,
      },
      {
        id: 'h-tokyo-2',
        nombre: 'APA Hotel Shinjuku',
        categoria: '3 estrellas',
        precioNoche: 80000,
        disponible: true,
      },
      {
        id: 'h-tokyo-3',
        nombre: 'Hotel Gracery Ginza',
        categoria: '4 estrellas',
        precioNoche: 150000,
        disponible: false,
      },
    ],
  },
  {
    slug: 'nueva-york',
    nombre: 'Nueva York',
    pais: 'Estados Unidos',
    emoji: '🗽',
    descripcion: 'La gran manzana: rascacielos, museos y los mejores espectáculos.',
    actividades: ['Times Square', 'Central Park', 'Estatua de la Libertad', 'Broadway'],
    vuelos: [
      {
        id: 'v-ny-1',
        aerolinea: 'American Airlines',
        origen: 'Miami',
        destino: 'Nueva York',
        precio: 240000,
        fecha: '2026-12-14',
        disponible: true,
      },
      {
        id: 'v-ny-2',
        aerolinea: 'Delta',
        origen: 'Los Ángeles',
        destino: 'Nueva York',
        precio: 310000,
        fecha: '2026-12-19',
        disponible: true,
      },
      {
        id: 'v-ny-3',
        aerolinea: 'JetBlue',
        origen: 'Boston',
        destino: 'Nueva York',
        precio: 120000,
        fecha: '2026-12-11',
        disponible: false,
      },
    ],
    hoteles: [
      {
        id: 'h-ny-1',
        nombre: 'The Plaza',
        categoria: '5 estrellas',
        precioNoche: 380000,
        disponible: true,
      },
      {
        id: 'h-ny-2',
        nombre: 'Holiday Inn Midtown',
        categoria: '3 estrellas',
        precioNoche: 140000,
        disponible: true,
      },
      {
        id: 'h-ny-3',
        nombre: 'Moxy Times Square',
        categoria: '4 estrellas',
        precioNoche: 210000,
        disponible: false,
      },
    ],
  },
  {
    slug: 'cancun',
    nombre: 'Cancún',
    pais: 'México',
    emoji: '🏖️',
    descripcion: 'Playas de arena blanca, mar turquesa y cultura maya.',
    actividades: ['Playa Delfines', 'Chichén Itzá', 'Isla Mujeres', 'Cenotes de Xcaret'],
    vuelos: [
      {
        id: 'v-cancun-1',
        aerolinea: 'Aeroméxico',
        origen: 'CDMX',
        destino: 'Cancún',
        precio: 90000,
        fecha: '2026-12-16',
        disponible: true,
      },
      {
        id: 'v-cancun-2',
        aerolinea: 'Volaris',
        origen: 'Guadalajara',
        destino: 'Cancún',
        precio: 70000,
        fecha: '2026-12-21',
        disponible: true,
      },
      {
        id: 'v-cancun-3',
        aerolinea: 'Copa Airlines',
        origen: 'Panamá',
        destino: 'Cancún',
        precio: 210000,
        fecha: '2026-12-13',
        disponible: false,
      },
    ],
    hoteles: [
      {
        id: 'h-cancun-1',
        nombre: 'Nizuc Resort & Spa',
        categoria: '5 estrellas',
        precioNoche: 280000,
        disponible: true,
      },
      {
        id: 'h-cancun-2',
        nombre: 'Selina Cancún',
        categoria: '3 estrellas',
        precioNoche: 60000,
        disponible: true,
      },
      {
        id: 'h-cancun-3',
        nombre: 'Hyatt Ziva Cancún',
        categoria: '4 estrellas',
        precioNoche: 190000,
        disponible: false,
      },
    ],
  },
]

// Índice id -> datos canónicos. Permite que el mock de CrearReserva tome el
// precio/título reales del catálogo y no confíe en lo que envía el cliente.
const itemsPorId = new Map(
  destinos.flatMap((destino) => [
    ...destino.vuelos.map((vuelo) => [
      vuelo.id,
      { tipo: 'vuelo', titulo: vuelo.aerolinea, precio: vuelo.precio },
    ]),
    ...destino.hoteles.map((hotel) => [
      hotel.id,
      { tipo: 'hotel', titulo: hotel.nombre, precio: hotel.precioNoche },
    ]),
  ]),
)

/** Devuelve el destino completo (con vuelos y hoteles) o undefined. */
export function getDestino(slug) {
  return destinos.find((destino) => destino.slug === slug)
}

/** Devuelve { tipo, titulo, precio } de un vuelo/hotel por id, o undefined. */
export function getItemCatalogo(id) {
  return itemsPorId.get(id)
}

/** Devuelve los destinos SIN vuelos ni hoteles, listos para el endpoint REST. */
export function destinosParaREST() {
  return destinos.map(({ vuelos, hoteles, ...destino }) => destino)
}
