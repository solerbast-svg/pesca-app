import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PESCA – Gestion pêche professionnelle',
  description: 'Application de gestion pour pêcheurs professionnels',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}