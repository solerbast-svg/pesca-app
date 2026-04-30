'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/crud'
import { supabase } from '../lib/supabase'

export default function ClientForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    type: '' as 'restaurant' | 'hotel' | 'particulier' | 'autre' | '',
    contact_name: '',
    phone: '',
    email: '',
    notes: '',
    preferred_species: '',
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
      await createClient(user.id, {
        name: form.name,
        type: form.type || null,
        contact_name: form.contact_name || null,
        phone: form.phone || null,
        email: form.email || null,
        notes: form.notes || null,
        preferred_species: form.preferred_species || null,
      })
      router.push('/clients')
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du client *</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required
          placeholder="Ex: Restaurant Le Lagon"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de client</label>
        <select name="type" value={form.type} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] bg-white">
          <option value="">Sélectionner un type</option>
          <option value="restaurant">Restaurant</option>
          <option value="hotel">Hôtel</option>
          <option value="particulier">Particulier</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact (nom)</label>
          <input type="text" name="contact_name" value={form.contact_name} onChange={handleChange}
            placeholder="Ex: Jean Martin"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="Ex: 0692 000 000"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange}
          placeholder="Ex: contact@restaurant.re"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Espèces préférées</label>
        <input type="text" name="preferred_species" value={form.preferred_species} onChange={handleChange}
          placeholder="Ex: Thon, Dorade, Langouste"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange}
          rows={3} placeholder="Informations complémentaires..."
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