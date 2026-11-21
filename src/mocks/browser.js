import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

// Un solo worker atiende tanto el endpoint REST como el GraphQL.
export const worker = setupWorker(...handlers)
