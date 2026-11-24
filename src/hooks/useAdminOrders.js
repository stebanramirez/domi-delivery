import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllOrders, subscribeToOrders, updateOrderStatus } from '../services/adminService'
import Queue from '../dataStructures/Queue'

// Orden en que avanza un pedido
const SIGUIENTE = { recibido: 'preparando', preparando: 'en_camino', en_camino: 'entregado' }

export function useAdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    try {
      setOrders(await getAllOrders())
      setError('')
    } catch {
      setError('No se pudieron cargar los pedidos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
    return subscribeToOrders(cargar)
  }, [cargar])

  // Cola de espera: los pedidos recibidos, del más antiguo al más nuevo
  const cola = useMemo(() => {
    const fila = new Queue()
    orders
      .filter((o) => o.status === 'recibido')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .forEach((o) => fila.enqueue(o))
    return fila
  }, [orders])

  const enCola = useMemo(() => cola.toArray(), [cola])
  const preparando = orders.filter((o) => o.status === 'preparando')
  const enCamino = orders.filter((o) => o.status === 'en_camino')
  const finalizados = orders.filter((o) => o.status === 'entregado' || o.status === 'cancelado')

  const cambiarEstado = useCallback(
    async (orderId, status) => {
      try {
        await updateOrderStatus(orderId, status)
      } catch {
        setError('No se pudo actualizar el pedido.')
      } finally {
        cargar()
      }
    },
    [cargar],
  )

  // Saca el primer pedido de la cola y empieza a prepararlo
  const atenderSiguiente = useCallback(() => {
    const siguiente = cola.dequeue()
    if (siguiente) cambiarEstado(siguiente.id, 'preparando')
  }, [cola, cambiarEstado])

  const avanzar = useCallback(
    (order) => {
      const nuevo = SIGUIENTE[order.status]
      if (nuevo) cambiarEstado(order.id, nuevo)
    },
    [cambiarEstado],
  )

  const cancelar = useCallback((order) => cambiarEstado(order.id, 'cancelado'), [cambiarEstado])

  return {
    loading,
    error,
    enCola,
    preparando,
    enCamino,
    finalizados,
    atenderSiguiente,
    avanzar,
    cancelar,
  }
}