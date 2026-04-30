'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { getGpsPoints, createGpsPoint, deleteGpsPoint } from '../../lib/crud'
import type { GpsPoint } from '../../types/database'
import { Plus, Trash2, MapPin, Navigation } from 'lucide-react'

const CATEGORY_CONFIG: Record<string, { label: string; icon: string }> = {
  spot:   { label: 'Spot', icon: '🎣' },
  port:   { label: 'Port', icon: '⚓' },
  danger: { label: 'Danger', icon: '⚠️' },
  autre:  { label: 'Autre', icon: '📍' },
}

export default function GpsPage() {
  const router = useRouter()
  const [points, setPoints] = useState<GpsPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', lat: '', lng: '', category: 'spot' as const, notes: '' })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const data = await getGpsPoints(user.id)
      setPoints(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleGetLocation = () => {
    if (!navigator.geolocation) { alert('GPS non disponible'); return }
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(f => ({
        ...f,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6),
      }))
    }, () => alert('Impossible d\'obtenir votre position'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    try {
      const point = await createGpsPoint(userId, {
        name: form.name,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        category: form.category,
        notes: form.notes || null,
      })
      setPoints([point, ...points])
      setShowForm(false)
      setForm({ name: '', lat: '', lng: '', category: 'spot', notes: '' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce point GPS ?')) return
    await deleteGpsPoint(id)
    setPoints(points.filter(p => p.id !== id))
  }

  const openInMaps = (p: GpsPoint) => {
    window.open(`https://maps.google.com/?q=${p.lat},${p.lng}`, '_blank')
  }

  return (
    <Layout title="Points GPS">
      <button onClick={() => setShowForm(!showForm)}
        className="flex items-center justify-center gap-2 w-full bg-[#0f2942] text-white rounded-2xl py-4 px-6 text-base font-bold mb-5 hover:bg-[#1a3d5c] transition">
        <Plus size={22} />
        {showForm ? 'Annuler' : 'Ajouter un point'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Nom du point *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required placeholder="Ex: Spot du large..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00b4d8]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
              <button key={key} type="button"
                onClick={() => setForm(f => ({ ...f, category: key as any }))}
                className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                  form.category === key ? 'bg-[#0f2942] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                {val.icon} {val.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Latitude *</label>
              <input type="number" step="any" value={form.lat}
                onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} required
                placeholder="-20.900000"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#00b4d8]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Longitude *</label>
              <input type="number" step="any" value={form.lng}
                onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} required
                placeholder="55.500000"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#00b4d8]" />
            </div>
          </div>

          <button type="button" onClick={handleGetLocation}
            className="w-full border-2 border-[#00b4d8] text-[#00b4d8] rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#f0fcff] transition">
            <Navigation size={18} />
            Utiliser ma position GPS
          </button>

          <button type="submit" disabled={saving}
            className="w-full bg-[#00b4d8] text-white rounded-xl py-3 text-sm font-bold hover:bg-[#0090ae] transition disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer le point'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12">Chargement...</div>
      ) : points.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Aucun point GPS enregistré</p>
        </div>
      ) : (
        <div className="space-y-3">
          {points.map(p => {
            const cat = CATEGORY_CONFIG[p.category] || CATEGORY_CONFIG.autre
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="font-bold text-[#0f2942]">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</p>
                      {p.notes && <p className="text-xs text-gray-400 mt-0.5">{p.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openInMaps(p)}
                      className="bg-[#e0f7fa] text-[#00b4d8] rounded-xl p-2.5 hover:bg-[#b2ebf2] transition">
                      <MapPin size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="text-gray-300 hover:text-red-400 transition p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}