import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Copia dist/index.html -> dist/404.html para que GitHub Pages
// resuelva los deep links (p. ej. /destino/paris) con el router del SPA.
const origen = resolve('dist/index.html')
const destino = resolve('dist/404.html')

if (!existsSync(origen)) {
  console.error('No se encontro dist/index.html. Ejecuta el build primero.')
  process.exit(1)
}

copyFileSync(origen, destino)
console.log('dist/404.html generado para deep links en GitHub Pages')
