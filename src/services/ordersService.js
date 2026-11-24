import { supabase } from './supabaseClient'

// Llama a la función create_order de la base de datos transacción
export async function createOrder({ zoneId, address, notes, items }) {
  const { data, error } = await supabase.rpc('create_order', {
    p_zone_id: zoneId,
    p_address: address,
    p_notes: notes,
    p_items: items,
  })
  if (error) throw error
  return data
}

export async function getMyOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), zones(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrder(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), zones(name)')
    .eq('id', orderId)
    .single()
  if (error) throw error
  return data
}

export async function getMessages(orderId) {
  const { data, error } = await supabase
    .from('order_messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(orderId, body) {
  const { data, error } = await supabase
    .from('order_messages')
    .insert({ order_id: orderId, body })
    .select()
    .single()
  if (error) throw error
  return data
}

// Realtime: escucha cambios del pedido y mensajes nuevos. Devuelve la función para dejar de escuchar
export function subscribeToOrder(orderId, { onOrder, onMessage }) {
  const channel = supabase
    .channel(`pedido-${orderId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      (payload) => onOrder(payload.new),
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_messages', filter: `order_id=eq.${orderId}` },
      (payload) => onMessage(payload.new),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}