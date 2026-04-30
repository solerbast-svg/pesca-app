'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCatch } from '../lib/crud'
import { supabase } from '../lib/supabase'

const SPECIES_LIST = [
  'Thon', 'Espadon', 'Marlin', 'Dorade', 'Bar', 'Rouget',
  'Langouste', 'Homard', 'Crevette', 'Poulpe', 'Calmar', 'Autre'
]

export default function CatchForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    species: '',
    weight_kg: '',
    price_per_kg: '',
    quantity_available: '',
    status: 'available' as const,
    catch_date: new Date().toISOString().slice(0, 10),
    gps_lat: '',
    gps_lng: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non connecté')
      await createCatch(user.id, {
        species: form.species,
        weight_kg: parseFloat(form.weight_kg),
        price_per_kg: form.price_per_kg ? parseFloat(form.price_per_kg) : null,
        quantity_available: form.quantity_available ? parseFloat(form.quantity_available) : null,
        status: form.status,
        catch_date: form.catch_date,
        gps_lat: form.gps_lat ? parseFloat(form.gps_lat) : null,
        gps_lng: form.gps_lng ? parseFloat(form.gps_lng) : null,
        notes: form.notes || null,
        photo_url: null,
      })
      router.push('/catches')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Espèce *</label>
        <select name="species" value={form.species} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] bg-white">
          <option value="">Sélectionner une espèce</option>
          {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Poids (kg) *</label>
          <input type="number" name="weight_kg" value={form.weight_kg} onChange={handleChange}
            step="0.1" min="0" required placeholder="Ex: 12.5"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix/kg (€)</label>
          <input type="number" name="price_per_kg" value={form.price_per_kg} onChange={handleChange}
            step="0.01" min="0" placeholder="Ex: 8.50"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantité dispo (kg)</label>
          <input type="number" name="quantity_available" value={form.quantity_available} onChange={handleChange}
            step="0.1" min="0" placeholder="Ex: 12.5"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] bg-white">
            <option value="available">Disponible</option>
            <option value="partial">Partiel</option>
            <option value="sold">Vendu</option>
            <option value="expired">Expiré</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de prise *</label>
        <input type="date" name="catch_date" value={form.catch_date} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude GPS</label>
          <input type="number" name="gps_lat" value={form.gps_lat} onChange={handleChange}
            step="any" placeholder="Ex: -20.9"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude GPS</label>
          <input type="number" name="gps_lng" value={form.gps_lng} onChange={handleChange}
            step="any" placeholder="Ex: 55.5"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange}
          rows={3} placeholder="Observations, conditions météo..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] resize-none" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition">
          Annuler
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-[#0f2942] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#1a3d5c] transition disabled:opacity-50">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}