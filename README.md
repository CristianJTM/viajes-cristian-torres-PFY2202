# ✈️ Agencia de Viajes — PFY2202

SPA de agencia de viajes para la actividad **sumativa de la Semana 5** de
**Desarrollo Frontend II (PFY2202)**.

La aplicación consume **dos APIs simuladas con MSW** al mismo tiempo:

- **REST** (`GET /api/destinos`) → lista de destinos con país y actividades.
- **GraphQL** (`query DetalleDestino`) → vuelos y hoteles de cada destino.

Al seleccionar un destino se muestran sus vuelos y hoteles, con estados de
carga, error y datos vacíos.

> **Demo:** https://cristianjtm.github.io/viajes-cristian-torres-PFY2202/

---

## 🧰 Stack

| Tecnología | Uso |
|---|---|
| React 18.3.1 | UI basada en componentes funcionales y hooks |
| Vite 5 | Dev server y build |
| React Router 7 | Ruteo (`react-router`, no `react-router-dom`) |
| MSW 2.x | Mock de REST y GraphQL en el mismo service worker |
| Apollo Client 3 | Consumo de la API GraphQL (`useQuery`) |
| Tailwind CSS 3 | Estilos (PostCSS) |

---

## ✨ Funcionalidades

- **Home**: grilla responsive de destinos cargada desde la API REST.
- **Detalle**: vuelos y hoteles del destino desde GraphQL.
- **Navbar persistente** con contador de destinos (consulta REST compartida
  vía Context).
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
│  ├─ handlers.js         # handlers REST y GraphQL (mismo worker)
│  └─ browser.js          # setupWorker(...handlers)
├─ lib/
│  ├─ api.js              # API_BASE, ApiError, pedirJson()
│  ├─ apolloClient.js     # ApolloClient -> <BASE_URL>graphql
│  └─ formato.js          # helpers de precio y fecha
├─ context/
│  └─ DestinosContext.jsx # consulta REST compartida (Navbar + Home)
├─ pages/
│  ├─ Home.jsx
│  ├─ DetalleDestino.jsx
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
│     └─ HotelCard.jsx
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

type Query {
  vuelos(slug: String!): [Vuelo!]!
  hoteles(slug: String!): [Hotel!]!
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

- `delay(1000)`.
- Slug inexistente → respuesta con `errors` (HTTP 200, **no** HTTP 404).

> `catalogo.js` es la **única fuente de datos**. El handler REST elimina
> `vuelos`/`hoteles`, y el handler GraphQL los lee del mismo destino, por lo que
> un slug nunca queda desincronizado.

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

1. Crear el repositorio `viajes-cristian-torres-PFY2202`.
2. Configurar el remoto y publicar:
   ```bash
   git init
   git add .
   git commit -m "Entrega Semana 5"
   git branch -M main
   git remote add origin https://github.com/cristianjtm/viajes-cristian-torres-PFY2202.git
   git push -u origin main
   ```
3. Desplegar:
   ```bash
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
- Sin errores en consola.
- Rutas con prefijo correcto en Pages (`/viajes-cristian-torres-PFY2202/destino/paris`).

Navegadores recomendados para la revisión manual: **Chrome, Edge y Firefox**
(últimas versiones), en escritorio y vista móvil.

---

## 👤 Autor

Cristian Torres — Desarrollo Frontend II (PFY2202), Semana 5.
