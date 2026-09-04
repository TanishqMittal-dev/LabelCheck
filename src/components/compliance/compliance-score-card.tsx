import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScanStatus } from '@/types'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

interface ComplianceScoreCardProps {
  score: number
  status: ScanStatus
  totalDeclarations: number
  passedCount: number
  needsReviewCount: number
  missingCount: number
  productName: string
  analyzedAt: string
}

export function ComplianceScoreCard({
  score,
  status,
  totalDeclarations,
  passedCount,
  needsReviewCount,
  missingCount,
  productName,
  analyzedAt,
}: ComplianceScoreCardProps) {
  const getStatusIcon = (st: ScanStatus) => {
    switch (st) {
      case 'compliant':
        return <ShieldCheck className="w-8 h-8 text-emerald-600" />
      case 'needs_review':
        return <AlertTriangle className="w-8 h-8 text-amber-600" />
      case 'non_compliant':
        return <XCircle className="w-8 h-8 text-red-600" />
    }
  }

  const getStatusBadge = (st: ScanStatus) => {
    switch (st) {
      case 'compliant':
        return <Badge variant="success" className="text-xs px-3 py-1 font-bold">COMPLIANT</Badge>
      case 'needs_review':
        return <Badge variant="warning" className="text-xs px-3 py-1 font-bold">NEEDS REVIEW</Badge>
      case 'non_compliant':
        return <Badge variant="destructive" className="text-xs px-3 py-1 font-bold">NON-COMPLIANT</Badge>
    }
  }

  return (
    <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-white">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Product & Status Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {getStatusBadge(status)}
              <span className="text-xs text-slate-400">
                Rule 6, Legal Metrology (PC) Rules 2011
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {productName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Analyzed on{' '}
              {new Date(analyzedAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>

          {/* Big Score Dial / Badge */}
          <div className="flex items-center gap-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/60 shrink-0">
            <div className="shrink-0">{getStatusIcon(status)}</div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {score}%
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Compliance Score
              </p>
            </div>
          </div>
        </div>

        {/* Declaration Breakdown Pills */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-base font-bold text-emerald-900">{passedCount} detected</p>
              <p className="text-xs text-emerald-700/80">Complies with mandatory rules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-50/60 border border-amber-100 p-3.5 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-base font-bold text-amber-900">{needsReviewCount} needs review</p>
              <p className="text-xs text-amber-700/80">Unclear or partial text</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-red-50/60 border border-red-100 p-3.5 rounded-xl">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-base font-bold text-red-900">{missingCount} missing</p>
              <p className="text-xs text-red-700/80">Declaration absent from label</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
