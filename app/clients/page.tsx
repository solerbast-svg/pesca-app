'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { getClients, deleteClient } from '../../lib/crud'

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const data = await getClients(user.id)
      setClients(data)
      setLoading(false)
    }
    load()
  }, [])
  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <Layout title='Clients'>
      <Link href='/clients/new' className='flex items-center justify-center gap-2 bg-[#0f2942] text-white rounded-2xl py-4 px-6 text-base font-bold mb-4'>+ Nouveau client</Link>
      <input type='text' placeholder='Rechercher...' value={search} onChange={e => setSearch(e.target.value)} className='w-full border-2 border-gray-200 rounded-2xl px-5 py-3 text-sm mb-5'/>
      {loading ? <p>Chargement...</p> : filtered.length === 0 ? <p className='text-center text-gray-400 py-12'>Aucun client</p> : filtered.map(c => <div key={c.id} className='bg-white rounded-2xl border border-gray-100 p-4 mb-3'><p className='font-bold text-[#0f2942]'>{c.name}</p>{c.phone && <p className='text-sm text-[#00b4d8]'>{c.phone}</p>}</div>)}
    </Layout>
  )
}
