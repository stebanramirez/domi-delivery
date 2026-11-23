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