import { supabase } from './supabaseClient'

export async function getZones() {
  const { data, error } = await supabase.from('zones').select('*').order('name')
  if (error) throw error
  return data
}

export async function getZoneEdges() {
  const { data, error } = await supabase.from('zone_edges').select('*')
  if (error) throw error
  return data
}