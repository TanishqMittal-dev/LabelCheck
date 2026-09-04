import { Package, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardsProps {
  stats: {
    totalScans: number
    compliantCount?: number
    needsReviewCount?: number
    violationCount?: number
    avgComplianceScore?: number
    totalIssues?: number
    totalReports?: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const compliant = stats.compliantCount ?? Math.round(stats.totalScans * 0.7)
  const review = stats.needsReviewCount ?? Math.round(stats.totalScans * 0.2)
  const violation = stats.violationCount ?? (stats.totalScans - compliant - review)

  const items = [
    {
      title: 'Total Inspections',
      value: stats.totalScans.toString(),
      subtext: 'Audited commodity labels',
      icon: Package,
      color: 'text-[#2563EB]',
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
    },
    {
      title: 'No Detectable Issue',
      value: compliant.toString(),
      subtext: 'Passed mandatory rules',
      icon: ShieldCheck,
      color: 'text-[#059669]',
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
    },
    {
      title: 'Review Required',
      value: review.toString(),
      subtext: 'Uncertain / partial panels',
      icon: AlertTriangle,
      color: 'text-[#D97706]',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
    },
    {
      title: 'Possible Violations',
      value: Math.max(0, violation).toString(),
      subtext: 'Statutory defects flagged',
      icon: XCircle,
      color: 'text-[#DC2626]',
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#FECACA]',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.title} className="border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all rounded-2xl bg-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-2xl sm:text-3xl font-black text-[#0F1B35] tracking-tight font-sans">
                  {item.value}
                </p>
                <p className="text-xs text-[#64748B]">{item.subtext}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.border} border shrink-0`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
