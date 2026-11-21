import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` cambia según el modo:
//  - desarrollo / build normal -> '/'
//  - build:pages (GitHub Pages) -> '/viajes-cristian-torres-PFY2202/'
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'pages' ? '/viajes-cristian-torres-PFY2202/' : '/',
}))
