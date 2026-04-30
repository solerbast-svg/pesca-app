export interface Profile {
  id: string
  full_name: string | null
  boat_name: string | null
  phone: string | null
  role: 'fisherman' | 'admin'
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  type: 'restaurant' | 'hotel' | 'particulier' | 'autre' | null
  contact_name: string | null
  phone: string | null
  email: string | null
  notes: string | null
  preferred_species: string | null
  created_at: string
  updated_at: string
}

export interface Catch {
  id: string
  user_id: string
  species: string
  weight_kg: number
  price_per_kg: number | null
  quantity_available: number | null
  status: 'available' | 'sold' | 'partial' | 'expired'
  gps_lat: number | null
  gps_lng: number | null
  photo_url: string | null
  catch_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  user_id: string
  client_id: string | null
  catch_id: string | null
  quantity_kg: number
  price_per_kg: number
  total_amount: number
  sale_date: string
  notes: string | null
  created_at: string
  updated_at: string
  client?: Client
  catch?: Catch
}

export interface GpsPoint {
  id: string
  user_id: string
  name: string
  lat: number
  lng: number
  notes: string | null
  category: 'spot' | 'port' | 'danger' | 'autre'
  created_at: string
  updated_at: string
}

export interface Export {
  id: string
  user_id: string
  type: 'comptable' | 'recfishing' | 'ventes' | 'prises' | null
  period_start: string | null
  period_end: string | null
  file_url: string | null
  status: 'pending' | 'ready' | 'error'
  created_at: string
}