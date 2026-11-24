import { supabase } from './supabaseClient'

// Todos los pedidos, con su zona, platos y el nombre del cliente
export async function getAllOrders() {
  const { data: pedidos, error } = await supabase
    .from('orders')
    .select('*, order_items(*), zones(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  if (pedidos.length === 0) return []

  const ids = [...new Set(pedidos.map((p) => p.user_id))]
  const { data: perfiles, error: errorPerfiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', ids)
  if (errorPerfiles) throw errorPerfiles

  const nombres = new Map(perfiles.map((p) => [p.id, p.full_name]))
  return pedidos.map((p) => ({ ...p, cliente: nombres.get(p.user_id) || 'Cliente' }))
}

export async function updateOrderStatus(orderId, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw error
}

// Realtime: avisa cuando entra o cambia cualquier pedido
export function subscribeToOrders(onChange) {
  const channel = supabase
    .channel('admin-pedidos')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => onChange())
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Todos los platos, incluidos los ocultos
export async function getAllDishes() {
  const { data, error } = await supabase.from('dishes').select('*').order('name')
  if (error) throw error
  return data
}

export async function createDish(campos) {
  const { error } = await supabase.from('dishes').insert({ ...campos, times_ordered: 0 })
  if (error) throw error
}

export async function updateDish(id, campos) {
  const { error } = await supabase.from('dishes').update(campos).eq('id', id)
  if (error) throw error
}

// Sube la foto al Storage y devuelve su dirección pública
export async function uploadDishImage(archivo) {
  const extension = archivo.name.split('.').pop().toLowerCase()
  const ruta = `${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from('dishes')
    .upload(ruta, archivo, { contentType: archivo.type, cacheControl: '3600' })
  if (error) throw error

  return supabase.storage.from('dishes').getPublicUrl(ruta).data.publicUrl
}