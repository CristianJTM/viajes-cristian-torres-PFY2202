import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
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

// Sin .nojekyll, Pages procesa el sitio con Jekyll y puede ignorar archivos
// o rutas que empiezan con "_", rompiendo los deep links del SPA.
writeFileSync(resolve('dist/.nojekyll'), '')
console.log('dist/.nojekyll generado para desactivar Jekyll en GitHub Pages')
