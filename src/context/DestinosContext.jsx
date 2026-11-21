import { createContext, useContext } from 'react'
import { useDestinos } from '../hooks/useDestinos.js'

// Una sola consulta REST compartida entre el Navbar y Home.
const DestinosContext = createContext(null)

export function DestinosProvider({ children }) {
  const value = useDestinos()
  return <DestinosContext.Provider value={value}>{children}</DestinosContext.Provider>
}

export function useDestinosContext() {
  const contexto = useContext(DestinosContext)
  if (!contexto) {
    throw new Error('useDestinosContext debe usarse dentro de <DestinosProvider>')
  }
  return contexto
}
