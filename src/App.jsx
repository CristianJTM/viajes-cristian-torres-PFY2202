import { ApolloProvider } from '@apollo/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import { apolloClient } from './lib/apolloClient.js'
import DetalleDestino from './pages/DetalleDestino.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* basename respeta la subruta de GitHub Pages: '/' en dev, '/viajes-.../' en Pages */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="destino/:slug" element={<DetalleDestino />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}
