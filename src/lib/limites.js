// Límites compartidos por el carrito (ReservaContext), el control de cantidad
// y el mock de la mutación CrearReserva. Una sola fuente evita que se desincronicen.

export const CANTIDAD_MIN = 1
export const CANTIDAD_MAX = 30
