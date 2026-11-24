import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { gql, useMutation } from '@apollo/client'
import CantidadControl from '../components/ui/CantidadControl.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import ReservaExitosa from '../components/ui/ReservaExitosa.jsx'
import ResumenReserva from '../components/ui/ResumenReserva.jsx'
import { useReserva } from '../context/ReservaContext.jsx'
import { formatearPrecio } from '../lib/formato.js'
import { fechaHoyISO, validarCheckout } from '../lib/validarCheckout.js'

// Mutación nombrada: MSW la matchea por su operationName "CrearReserva".
export const CREAR_RESERVA = gql`
  mutation CrearReserva($input: CrearReservaInput!) {
    crearReserva(input: $input) {
      codigo
      estado
      total
      cliente
      email
      fechaViaje
      creadaEn
      items {
        id
        tipo
        titulo
        cantidad
        precio
      }
    }
  }
`

const FORMULARIO_INICIAL = { nombre: '', email: '', fechaViaje: '' }

function claseInput(tieneError) {
  return `mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 ${
    tieneError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'
  }`
}

function FilaReserva({ item, onQuitar, onCambiarCantidad }) {
  const etiqueta = item.unidad === 'noche' ? 'noches' : 'pasajeros'

  return (
    <li className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-bold text-slate-900">{item.titulo}</p>
        <p className="text-sm text-slate-600">{item.subtitulo}</p>
        <p className="mt-1 text-xs text-slate-500">
          {item.destinoNombre} · {formatearPrecio(item.precio)} por{' '}
          {item.unidad === 'noche' ? 'noche' : 'pasajero'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:justify-end">
        <CantidadControl
          cantidad={item.cantidad}
          onChange={(cantidad) => onCambiarCantidad(item.id, cantidad)}
          etiqueta={etiqueta}
        />
        <p className="w-24 text-right text-sm font-bold text-slate-900">
          {formatearPrecio(item.precio * item.cantidad)}
        </p>
        <button
          type="button"
          onClick={() => onQuitar(item.id)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        >
          Quitar
        </button>
      </div>
    </li>
  )
}

export default function Carrito() {
  const { items, total, cantidadItems, quitar, cambiarCantidad, vaciar } =
    useReserva()

  const navigate = useNavigate()

  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [errores, setErrores] = useState({})
  const [reservaConfirmada, setReservaConfirmada] = useState(null)

  const [crearReserva, { loading, error, reset }] = useMutation(CREAR_RESERVA)

  const vuelos = useMemo(
    () => items.filter((item) => item.tipo === 'vuelo'),
    [items],
  )
  const hoteles = useMemo(
    () => items.filter((item) => item.tipo === 'hotel'),
    [items],
  )

  function actualizarCampo(campo, valor) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: undefined }))
    // El error de la mutación deja de aplicar en cuanto el usuario corrige.
    if (error) reset()
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()

    const erroresValidacion = validarCheckout(formulario)
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    try {
      const { data } = await crearReserva({
        variables: {
          input: {
            cliente: formulario.nombre.trim(),
            email: formulario.email.trim(),
            fechaViaje: formulario.fechaViaje,
            items: items.map(({ id, tipo, titulo, cantidad, precio }) => ({
              id,
              tipo,
              titulo,
              cantidad,
              precio,
            })),
          },
        },
      })

      setReservaConfirmada(data.crearReserva)
      // El carrito se vacía SOLO cuando la mutación responde con éxito.
      vaciar()
      setFormulario(FORMULARIO_INICIAL)
      setErrores({})
    } catch {
      // Apollo expone el error en `error`; los ítems se conservan.
    }
  }

  if (reservaConfirmada) {
    return (
      <ReservaExitosa
        reserva={reservaConfirmada}
        onNuevaReserva={() => {
          setReservaConfirmada(null)
          navigate('/')
        }}
      />
    )
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-5xl" aria-hidden="true">
          🛒
        </p>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          Tu reserva está vacía
        </h1>
        <p className="mt-2 text-slate-600">
          Explora un destino y agrega vuelos u hoteles a tu reserva.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Ver destinos
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Tu reserva
        </h1>
        <p className="mt-2 text-slate-600">
          {cantidadItems}{' '}
          {cantidadItems === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          {vuelos.length > 0 && (
            <section className="card p-6">
              <h2 className="text-xl font-bold text-slate-900">✈️ Vuelos</h2>
              <ul className="mt-2 divide-y divide-slate-100">
                {vuelos.map((item) => (
                  <FilaReserva
                    key={item.id}
                    item={item}
                    onQuitar={quitar}
                    onCambiarCantidad={cambiarCantidad}
                  />
                ))}
              </ul>
            </section>
          )}

          {hoteles.length > 0 && (
            <section className="card p-6">
              <h2 className="text-xl font-bold text-slate-900">🏨 Hoteles</h2>
              <ul className="mt-2 divide-y divide-slate-100">
                {hoteles.map((item) => (
                  <FilaReserva
                    key={item.id}
                    item={item}
                    onQuitar={quitar}
                    onCambiarCantidad={cambiarCantidad}
                  />
                ))}
              </ul>
            </section>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            <span aria-hidden="true">←</span> Seguir explorando destinos
          </Link>
        </div>

        <div className="space-y-6">
          <ResumenReserva
            cantidadItems={cantidadItems}
            total={total}
            onVaciar={vaciar}
          />

          <form onSubmit={manejarEnvio} className="card space-y-4 p-6" noValidate>
            <h2 className="text-lg font-bold text-slate-900">
              Datos del cliente
            </h2>

            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-slate-700"
              >
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                value={formulario.nombre}
                onChange={(evento) =>
                  actualizarCampo('nombre', evento.target.value)
                }
                placeholder="Cristian Torres"
                aria-invalid={Boolean(errores.nombre)}
                aria-describedby={errores.nombre ? 'nombre-error' : undefined}
                className={claseInput(Boolean(errores.nombre))}
              />
              {errores.nombre && (
                <p
                  id="nombre-error"
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-600"
                >
                  {errores.nombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formulario.email}
                onChange={(evento) =>
                  actualizarCampo('email', evento.target.value)
                }
                placeholder="tucorreo@ejemplo.com"
                aria-invalid={Boolean(errores.email)}
                aria-describedby={errores.email ? 'email-error' : undefined}
                className={claseInput(Boolean(errores.email))}
              />
              {errores.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-600"
                >
                  {errores.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="fechaViaje"
                className="block text-sm font-semibold text-slate-700"
              >
                Fecha de viaje
              </label>
              <input
                id="fechaViaje"
                type="date"
                min={fechaHoyISO()}
                value={formulario.fechaViaje}
                onChange={(evento) =>
                  actualizarCampo('fechaViaje', evento.target.value)
                }
                aria-invalid={Boolean(errores.fechaViaje)}
                aria-describedby={
                  errores.fechaViaje ? 'fechaViaje-error' : undefined
                }
                className={claseInput(Boolean(errores.fechaViaje))}
              />
              {errores.fechaViaje && (
                <p
                  id="fechaViaje-error"
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-600"
                >
                  {errores.fechaViaje}
                </p>
              )}
            </div>

            {error && (
              <ErrorMessage
                title="No pudimos confirmar tu reserva"
                message={error.message}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Reservando…'
                : `Confirmar reserva · ${formatearPrecio(total)}`}
            </button>

            <p className="text-center text-xs text-slate-500">
              Los datos se envían al mock GraphQL (sin backend real).
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
