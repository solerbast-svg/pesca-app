interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'blue' | 'teal' | 'green' | 'orange'
}

const colorMap = {
  blue: 'bg-[#e8f4fd] text-[#0f2942]',
  teal: 'bg-[#e0f7fa] text-[#006d77]',
  green: 'bg-[#e8f5e9] text-[#2e7d32]',
  orange: 'bg-[#fff3e0] text-[#e65100]',
}

const iconColorMap = {
  blue: 'bg-[#0f2942] text-white',
  teal: 'bg-[#00b4d8] text-white',
  green: 'bg-[#2e7d32] text-white',
  orange: 'bg-[#e65100] text-white',
}

export default function StatCard({ title, value, subtitle, icon, color = 'blue' }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-5 ${colorMap[color]} flex items-center gap-4`}>
      <div className={`rounded-xl p-3 ${iconColorMap[color]} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium opacity-70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}