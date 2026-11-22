# ✈️ Agencia de Viajes — PFY2202

SPA de agencia de viajes para la actividad **sumativa de la Semana 5** de
**Desarrollo Frontend II (PFY2202)**.

La aplicación consume **dos APIs simuladas con MSW** al mismo tiempo:

- **REST** (`GET /api/destinos`) → lista de destinos con país y actividades.
- **GraphQL** (`query DetalleDestino` + `mutation CrearReserva`) → vuelos,
  hoteles y confirmación de la reserva.

Al seleccionar un destino se muestran sus vuelos y hoteles, con estados de
carga, error y datos vacíos. El usuario puede **agregarlos a una reserva**
(carrito), ajustar pasajeros/noches y confirmar el checkout contra el mock
GraphQL.

> **Demo:** https://cristianjtm.github.io/viajes-cristian-torres-PFY2202/

---

## 🧰 Stack

| Tecnología | Uso |
|---|---|
| React 18.3.1 | UI basada en componentes funcionales y hooks |
| Vite 5 | Dev server y build |
| React Router 7 | Ruteo (`react-router`, no `react-router-dom`) |
| MSW 2.x | Mock de REST y GraphQL en el mismo service worker |
| Apollo Client 3 | GraphQL (`useQuery` y `useMutation`) |
| Tailwind CSS 3 | Estilos (PostCSS) |

---

## ✨ Funcionalidades

- **Home**: grilla responsive de destinos cargada desde la API REST.
- **Detalle**: vuelos y hoteles del destino desde GraphQL.
- **Reserva/carrito**: agrega vuelos y hoteles disponibles, ajusta la cantidad
  (pasajeros/noches), ve subtotales y total, y quita ítems.
- **Checkout validado**: nombre, email y fecha de viaje; estado de carga y
  manejo de error.
- **Confirmación**: mutación GraphQL `CrearReserva` que devuelve un código
  (`RSV-…`) y el total recalculado en el mock.
- **Persistencia**: el carrito sobrevive al refresh vía `localStorage`.
- **Navbar persistente** con contador de destinos y badge de la reserva
  (contextos compartidos).
- **Estados de UI**: `LoadingSpinner` mientras carga, `ErrorMessage` con botón
  de reintento (REST) y mensaje amigable si no hay vuelos/hoteles.
- **Ruteo SPA** con `Link`/`NavLink` (sin recargas de página).
- **404** para rutas inexistentes.
- **Listo para GitHub Pages** (base dinámica, `basename` del router y
  `404.html` para deep links).

---

## 📁 Estructura

```text
src/
├─ mocks/
│  ├─ catalogo.js         # FUENTE ÚNICA: destinos + vuelos + hoteles
│  ├─ handlers.js         # handlers REST, query y mutation GraphQL
│  └─ browser.js          # setupWorker(...handlers)
├─ lib/
│  ├─ api.js              # API_BASE, ApiError, pedirJson()
│  ├─ apolloClient.js     # ApolloClient -> <BASE_URL>graphql
│  └─ formato.js          # helpers de precio y fecha
├─ context/
│  ├─ DestinosContext.jsx # consulta REST compartida (Navbar + Home)
│  └─ ReservaContext.jsx  # carrito global (useReducer + localStorage)
├─ pages/
│  ├─ Home.jsx
│  ├─ DetalleDestino.jsx
│  ├─ Carrito.jsx
│  └─ NotFound.jsx
├─ components/
│  ├─ layout/
│  │  ├─ AppLayout.jsx
│  │  └─ Navbar.jsx
│  └─ ui/
│     ├─ LoadingSpinner.jsx
│     ├─ ErrorMessage.jsx
│     ├─ DestinoCard.jsx
│     ├─ VueloCard.jsx
│     ├─ HotelCard.jsx
│     ├─ CantidadControl.jsx
│     ├─ ResumenReserva.jsx
│     └─ ReservaExitosa.jsx
├─ hooks/
│  └─ useDestinos.js       # fetch REST + loading/error/retry + AbortController
├─ App.jsx                # ApolloProvider + BrowserRouter + Routes
└─ main.jsx               # enableMocking() antes del render
```

---

## 🗺️ Rutas

| Ruta | Componente | Datos |
|---|---|---|
| `/` | `Home` | REST (`GET /api/destinos`) |
| `/destino/:slug` | `DetalleDestino` | GraphQL (`DetalleDestino`) |
| `/carrito` | `Carrito` | Estado global + GraphQL (`CrearReserva`) |
| `*` | `NotFound` | — |

---

## 🔌 Contrato de los mocks

### REST — `GET /api/destinos`

- `delay(1000)`.
- **200** → array de destinos: `{ slug, nombre, pais, emoji, descripcion, actividades[] }`.
- **500** → `{ error: 'Error del servidor' }` si se agrega `?fail=500`.

### GraphQL — `POST /graphql`

```graphql
type Vuelo {
  id: ID!
  aerolinea: String!
  origen: String!
  destino: String!
  precio: Float!
  fecha: String!
  disponible: Boolean!
}

type Hotel {
  id: ID!
  nombre: String!
  categoria: String!
  precioNoche: Float!
  disponible: Boolean!
}

type ReservaItem {
  id: ID!
  tipo: String!
  titulo: String!
  cantidad: Int!
  precio: Float!
}

type Reserva {
  codigo: String!
  estado: String!
  total: Float!
  cliente: String!
  email: String!
  fechaViaje: String
  creadaEn: String!
  items: [ReservaItem!]!
}

input ReservaItemInput {
  id: ID!
  tipo: String!
  titulo: String!
  cantidad: Int!
  precio: Float!
}

input CrearReservaInput {
  cliente: String!
  email: String!
  fechaViaje: String
  items: [ReservaItemInput!]!
}

type Query {
  vuelos(slug: String!): [Vuelo!]!
  hoteles(slug: String!): [Hotel!]!
}

type Mutation {
  crearReserva(input: CrearReservaInput!): Reserva!
}
```

Query consumida por Apollo:

```graphql
query DetalleDestino($slug: String!) {
  vuelos(slug: $slug) {
    id aerolinea origen destino precio fecha disponible
  }
  hoteles(slug: $slug) {
    id nombre categoria precioNoche disponible
  }
}
```

Mutation consumida por Apollo:

```graphql
mutation CrearReserva($input: CrearReservaInput!) {
  crearReserva(input: $input) {
    codigo
    estado
    total
    cliente
    email
    fechaViaje
    creadaEn
    items { id tipo titulo cantidad precio }
  }
}
```

- `delay(1000)` en ambos handlers.
- Slug inexistente → respuesta con `errors` (HTTP 200, **no** HTTP 404).
- La mutación **recalcula el total en el mock** a partir de los ítems; no confía
  en el total del cliente.
- Trigger de error determinista: usar `error@test.com` como email devuelve
  `errors` para probar el estado de error de la UI.

> `catalogo.js` es la **única fuente de datos**. El handler REST elimina
> `vuelos`/`hoteles`, y el handler GraphQL los lee del mismo destino, por lo que
> un slug nunca queda desincronizado.

---

## 🛒 Reserva / carrito

1. En `/destino/:slug`, cada vuelo/hotel **disponible** muestra
   **“+ Agregar a la reserva”**; si ya está, el botón indica **“✓ En la reserva”**
   y vuelve a quitarlo. Los ítems **agotados** quedan deshabilitados.
2. El **Navbar** muestra `🛒 Reserva` con un badge que refleja la cantidad de
   ítems distintos.
3. En `/carrito`:
   - se listan los ítems agrupados en vuelos y hoteles;
   - `CantidadControl` ajusta **pasajeros** (vuelo) o **noches** (hotel), entre
     1 y 30;
   - se muestran subtotales por línea y el **total**;
   - se pueden quitar ítems individuales o vaciar la reserva.
4. El **checkout** valida nombre (mín. 3), email y fecha de viaje (hoy o
   posterior) antes de enviar.
5. Al confirmar se ejecuta la mutación `CrearReserva`. Si responde bien:
   - se muestra el **código de reserva** y el total;
   - el carrito se vacía **solo en ese caso**.
   Si falla, se muestra `ErrorMessage` y **los ítems se conservan**.
6. El carrito se persiste en `localStorage` (clave `viajes:reserva:v1`), por lo
   que sobrevive a un refresh. La lectura usa `try/catch` y valida la forma de
   los ítems.

**Estado:** `ReservaContext.jsx` usa `useReducer` con las acciones `AGREGAR`,
`QUITAR`, `CAMBIAR_CANTIDAD` y `VACIAR`, y expone `items`, `total`,
`cantidadItems`, `agregar`, `quitar`, `cambiarCantidad`, `vaciar` y
`estaEnReserva`.

---

## 🚀 Ejecutar en local

```bash
npm install
npx msw init ./public --save   # genera public/mockServiceWorker.js
npm run dev
```

Abrir http://localhost:5173/ (el mock se activa automáticamente en desarrollo).

### Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Dev server con mock activo |
| `npm run build` | Build normal (mock desactivado) |
| `npm run build:pages` | Build para GitHub Pages (base del repo + mock activo + `404.html`) |
| `npm run preview` | Previsualiza el build normal |
| `npm run preview:pages` | Previsualiza el build de Pages en su subruta |
| `npm run deploy` | Publica `dist/` en la rama `gh-pages` |

---

## 🌐 Despliegue en GitHub Pages

El repositorio ya está configurado (`origin` → `CristianJTM/viajes-cristian-torres-PFY2202`)
y GitHub Pages sirve la rama `gh-pages`.

Para publicar cambios:

```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin main
npm run deploy
```

`predeploy` ejecuta `build:pages`, que:

- aplica `base = '/viajes-cristian-torres-PFY2202/'`,
- activa MSW también en producción (`MODE === 'pages'`),
- genera `dist/404.html` para que los deep links (`/destino/paris`) funcionen.

---

## ✅ Pruebas realizadas

Verificado de extremo a extremo con **Chrome** (headless) tanto en `npm run dev`
como en el build de Pages (`npm run preview:pages`):

- Home muestra los **4 destinos** desde REST.
- Navegación a `/destino/paris` y render de **3 vuelos + 3 hoteles** desde GraphQL.
- Slug inexistente → mensaje de error (`Destino no encontrado`).
- Ruta inválida → página **404**.
- Vuelo agotado → botón **“No disponible”** deshabilitado.
- Agregar vuelo y hotel → badge del Navbar **1 → 2**.
- Carrito: 2 ítems, total **$1.240.000**; al subir pasajeros a 2 → **$2.160.000**.
- Refresh del carrito → ítems y total **persisten**.
- Submit vacío → errores de **validación** inline.
- Checkout válido → código **`RSV-…`**, total correcto y carrito vaciado.
- Email `error@test.com` → mensaje de error y **carrito conservado**.
- Sin errores en consola.
- Rutas con prefijo correcto en Pages (`/viajes-cristian-torres-PFY2202/carrito`).

Navegadores recomendados para la revisión manual: **Chrome, Edge y Firefox**
(últimas versiones), en escritorio y vista móvil.

---

## 👤 Autor

Cristian Torres — Desarrollo Frontend II (PFY2202), Semana 5.
