import { supabase } from './supabase'
import type { Catch, Client, Sale, GpsPoint, Profile } from '../types/database'

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

export async function getCatches(userId: string) {
  const { data, error } = await supabase
    .from('catches')
    .select('*')
    .eq('user_id', userId)
    .order('catch_date', { ascending: false })
  if (error) throw error
  return data as Catch[]
}

export async function createCatch(userId: string, catchData: Omit<Catch, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('catches')
    .insert({ ...catchData, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data as Catch
}

export async function updateCatch(id: string, updates: Partial<Catch>) {
  const { data, error } = await supabase
    .from('catches')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Catch
}

export async function deleteCatch(id: string) {
  const { error } = await supabase
    .from('catches')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getClients(userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('name')
  if (error) throw error
  return data as Client[]
}

export async function createClient(userId: string, clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('clients')
    .insert({ ...clientData, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data as Client
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Client
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getSales(userId: string) {
  const { data, error } = await supabase
    .from('sales')
    .select('*, client:clients(*), catch:catches(*)')
    .eq('user_id', userId)
    .order('sale_date', { ascending: false })
  if (error) throw error
  return data as Sale[]
}

export async function createSale(userId: string, saleData: Omit<Sale, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'client' | 'catch'>) {
  const total_amount = saleData.quantity_kg * saleData.price_per_kg
  const { data, error } = await supabase
    .from('sales')
    .insert({ ...saleData, user_id: userId, total_amount })
    .select()
    .single()
  if (error) throw error
  return data as Sale
}

export async function deleteSale(id: string) {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getGpsPoints(userId: string) {
  const { data, error } = await supabase
    .from('gps_points')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as GpsPoint[]
}

export async function createGpsPoint(userId: string, pointData: Omit<GpsPoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('gps_points')
    .insert({ ...pointData, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data as GpsPoint
}

export async function updateGpsPoint(id: string, updates: Partial<GpsPoint>) {
  const { data, error } = await supabase
    .from('gps_points')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as GpsPoint
}

export async function deleteGpsPoint(id: string) {
  const { error } = await supabase
    .from('gps_points')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getDashboardStats(userId: string) {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

  const [catchesRes, salesRes, clientsRes] = await Promise.all([
    supabase.from('catches').select('*').eq('user_id', userId).gte('catch_date', monthStart),
    supabase.from('sales').select('*').eq('user_id', userId).gte('sale_date', monthStart),
    supabase.from('clients').select('id').eq('user_id', userId),
  ])

  const catches = catchesRes.data ?? []
  const sales = salesRes.data ?? []
  const clients = clientsRes.data ?? []

  const totalWeightMonth = catches.reduce((sum, c) => sum + (c.weight_kg || 0), 0)
  const totalRevenueMonth = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0)
  const availableCatches = catches.filter(c => c.status === 'available').length

  return {
    totalWeightMonth,
    totalRevenueMonth,
    availableCatches,
    totalClients: clients.length,
    recentCatches: catches.slice(0, 5),
    recentSales: sales.slice(0, 5),
  }
}