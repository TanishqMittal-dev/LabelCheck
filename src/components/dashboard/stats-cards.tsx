import { Package, ShieldCheck, AlertTriangle, FileCheck2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardsProps {
  stats: {
    totalScans: number
    avgComplianceScore: number
    totalIssues: number
    totalReports: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      title: 'Products Checked',
      value: stats.totalScans.toString(),
      subtext: 'Scanned product labels',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Average Compliance',
      value: `${stats.avgComplianceScore}%`,
      subtext: 'Across all scanned batches',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Potential Issues',
      value: stats.totalIssues.toString(),
      subtext: 'Flagged for verification',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Reports Generated',
      value: stats.totalReports.toString(),
      subtext: 'Ready for export & print',
      icon: FileCheck2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.title} className="border-slate-200/80 shadow-2xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {item.value}
                </p>
                <p className="text-[11px] text-slate-400">{item.subtext}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.border} border shrink-0`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
