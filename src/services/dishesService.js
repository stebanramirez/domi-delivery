import { supabase } from './supabaseClient'

export async function getDishes() {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('available', true)
    .order('name')
  if (error) throw error
  return data
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}