export const ESTADOS = {
  recibido: 'Recibido',
  preparando: 'Preparando',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export function formatearFecha(iso) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}