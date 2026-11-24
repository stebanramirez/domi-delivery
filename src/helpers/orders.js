export const ESTADOS = {
  recibido: 'Recibido',
  preparando: 'Preparando',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

// Orden en que avanza un pedido
export const FLUJO = ['recibido', 'preparando', 'en_camino', 'entregado']

export function formatearFecha(iso) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}