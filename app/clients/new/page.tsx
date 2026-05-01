'use client'
import Layout from '../../../components/Layout'
import ClientForm from '../../../components/ClientForm'

export default function NewClientPage() {
  return (
    <Layout title="Nouveau client">
      <div className="bg-white rounded-3xl border border-gray-100 p-5">
        <p className="text-gray-400 text-sm mb-5">Remplissez les informations de votre client</p>
        <ClientForm />
      </div>
    </Layout>
  )
}