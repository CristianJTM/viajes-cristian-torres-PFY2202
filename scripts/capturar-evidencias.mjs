// Genera la evidencia visual del proyecto: capturas reales del build de Pages
// en Chrome, Edge y Firefox, en escritorio y móvil.
//
// Uso: npm run evidencias
// Requisitos: `npm run build:pages` (el script lo verifica) y
// `npx playwright install firefox` la primera vez.
//
// Las imágenes quedan en docs/evidencias/ y se referencian desde el README.

import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { chromium, firefox } from 'playwright'
import { preview } from 'vite'

const SALIDA = 'docs/evidencias'
const PUERTO = 4173

const NAVEGADORES = [
  { nombre: 'chrome', motor: chromium, opciones: { channel: 'chrome' } },
  { nombre: 'edge', motor: chromium, opciones: { channel: 'msedge' } },
  { nombre: 'firefox', motor: firefox, opciones: {} },
]

const VIEWPORTS = [
  { nombre: 'desktop', width: 1366, height: 900 },
  { nombre: 'movil', width: 375, height: 812 },
]

async function capturar(page, archivo) {
  await page.screenshot({ path: `${SALIDA}/${archivo}`, fullPage: true })
  console.log(`  OK ${archivo}`)
}

/** Escenarios de escritorio: cubren las 4 rutas y los dos estados de error. */
async function escenariosDesktop(page, base, navegador) {
  const prefijo = `${navegador}-desktop`

  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await page.getByText('París').first().waitFor()
  await capturar(page, `${prefijo}-home-rest.png`)

  await page.goto(`${base}/destino/paris`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Hôtel Le Meurice').first().waitFor()
  await capturar(page, `${prefijo}-detalle-graphql.png`)

  // Error GraphQL: slug inexistente responde con errors[] (HTTP 200).
  await page.goto(`${base}/destino/no-existe`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Destino no encontrado').first().waitFor()
  await capturar(page, `${prefijo}-error-graphql.png`)

  // Carrito con ítems reales: Air France (vuelo) + Le Meurice (hotel).
  await page.goto(`${base}/destino/paris`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Hôtel Le Meurice').first().waitFor()
  await page
    .locator('article', { hasText: 'Air France' })
    .first()
    .getByRole('button', { name: '+ Agregar a la reserva' })
    .click()
  await page
    .locator('article', { hasText: 'Hôtel Le Meurice' })
    .first()
    .getByRole('button', { name: '+ Agregar a la reserva' })
    .click()
  await page.goto(`${base}/carrito`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Datos del cliente').waitFor()
  await capturar(page, `${prefijo}-carrito.png`)

  // Error REST: el parámetro ?fail=500 dispara el 500 del mock.
  await page.goto(`${base}/?fail=500`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Error del servidor').first().waitFor()
  await capturar(page, `${prefijo}-error-rest.png`)

  // 404 para rutas inexistentes.
  await page.goto(`${base}/ruta-inexistente`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Página no encontrada').first().waitFor()
  await capturar(page, `${prefijo}-404.png`)
}

/** Escenarios móviles: layout responsive de Home y del detalle. */
async function escenariosMovil(page, base, navegador) {
  const prefijo = `${navegador}-movil`

  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await page.getByText('París').first().waitFor()
  await capturar(page, `${prefijo}-home-rest.png`)

  await page.goto(`${base}/destino/paris`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Hôtel Le Meurice').first().waitFor()
  await capturar(page, `${prefijo}-detalle-graphql.png`)
}

async function principal() {
  if (!existsSync('dist/index.html')) {
    console.error('Falta dist/index.html. Ejecuta "npm run build:pages" primero.')
    process.exit(1)
  }

  await mkdir(SALIDA, { recursive: true })

  const servidor = await preview({
    mode: 'pages',
    preview: { port: PUERTO, strictPort: true, open: false },
  })

  const base = `http://localhost:${PUERTO}${servidor.config.base.replace(/\/$/, '')}`
  console.log(`Preview en ${base}`)

  const fallos = []

  try {
    for (const { nombre, motor, opciones } of NAVEGADORES) {
      let browser
      try {
        browser = await motor.launch(opciones)
      } catch (error) {
        console.warn(`No se pudo abrir ${nombre}: ${error.message}`)
        fallos.push(nombre)
        continue
      }

      console.log(`\n${nombre} (${await browser.version()})`)

      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        })
        const page = await context.newPage()
        page.setDefaultTimeout(20000)

        try {
          if (viewport.nombre === 'desktop') {
            await escenariosDesktop(page, base, nombre)
          } else {
            await escenariosMovil(page, base, nombre)
          }
        } finally {
          await context.close()
        }
      }

      await browser.close()
    }
  } finally {
    await servidor.close()
  }

  if (fallos.length > 0) {
    console.warn(`\nNavegadores no disponibles: ${fallos.join(', ')}`)
    process.exitCode = 1
  } else {
    console.log('\nEvidencias generadas en', SALIDA)
  }
}

principal().catch((error) => {
  console.error(error)
  process.exit(1)
})
