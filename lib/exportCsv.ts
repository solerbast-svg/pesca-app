export function exportToCSV(filename: string, rows: any[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(header => JSON.stringify(row[header] ?? '')).join(',')
    )
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatDateForExport(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR')
}

export function exportCatchesToCSV(catches: any[]) {
  const rows = catches.map(c => ({
    Date: formatDateForExport(c.catch_date),
    Espèce: c.species,
    'Poids (kg)': c.weight_kg,
    'Prix/kg (€)': c.price_per_kg ?? '',
    'Quantité disponible': c.quantity_available ?? '',
    Statut: c.status,
    Notes: c.notes ?? '',
    Latitude: c.gps_lat ?? '',
    Longitude: c.gps_lng ?? '',
  }))
  exportToCSV(`pesca_prises_${new Date().toISOString().slice(0, 10)}.csv`, rows)
}

export function exportSalesToCSV(sales: any[]) {
  const rows = sales.map(s => ({
    Date: formatDateForExport(s.sale_date),
    Client: s.client?.name ?? '',
    Espèce: s.catch?.species ?? '',
    'Quantité (kg)': s.quantity_kg,
    'Prix/kg (€)': s.price_per_kg,
    'Total (€)': s.total_amount,
    Notes: s.notes ?? '',
  }))
  exportToCSV(`pesca_ventes_${new Date().toISOString().slice(0, 10)}.csv`, rows)
}