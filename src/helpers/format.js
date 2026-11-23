const formatoPeso = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatearPrecio(valor) {
  return formatoPeso.format(valor)
}