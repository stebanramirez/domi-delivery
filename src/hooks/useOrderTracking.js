import { useCallback, useEffect, useState } from 'react'
import {
  getMessages,
  getOrder,
  sendMessage,
  subscribeToOrder,
} from '../services/ordersService'

export function useOrderTracking(orderId) {
  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Agrega un mensaje sin duplicarlo puede llegar por Realtime y por el envío
  const agregar = useCallback((mensaje) => {
    setMessages((actuales) =>
      actuales.some((m) => m.id === mensaje.id) ? actuales : [...actuales, mensaje],
    )
  }, [])

  useEffect(() => {
    let cancelado = false

    Promise.all([getOrder(orderId), getMessages(orderId)])
      .then(([pedido, mensajes]) => {
        if (cancelado) return
        setOrder(pedido)
        setMessages(mensajes)
      })
      .catch(() => {
        if (!cancelado) setError('No encontramos este pedido.')
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    const salir = subscribeToOrder(orderId, {
      onOrder: (nuevo) => setOrder((anterior) => (anterior ? { ...anterior, ...nuevo } : anterior)),
      onMessage: agregar,
    })

    return () => {
      cancelado = true
      salir()
    }
  }, [orderId, agregar])

  const send = useCallback(
    async (texto) => {
      const mensaje = await sendMessage(orderId, texto)
      agregar(mensaje)
    },
    [orderId, agregar],
  )

  return { loading, error, order, messages, send }
}