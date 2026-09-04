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
        return <ShieldCheck className="w-9 h-9 text-emerald-600" />
      case 'needs_review':
        return <AlertTriangle className="w-9 h-9 text-amber-600" />
      case 'non_compliant':
        return <XCircle className="w-9 h-9 text-red-600" />
    }
  }

  const getStatusBadge = (st: ScanStatus) => {
    switch (st) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
            🟢 NO DETECTABLE ISSUE (COMPLIANT)
          </span>
        )
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300">
            🟡 UNABLE TO VERIFY (NEEDS REVIEW)
          </span>
        )
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 font-bold rounded-full bg-red-50 text-red-800 border border-red-300">
            🔴 POSSIBLE VIOLATION (NON-COMPLIANT)
          </span>
        )
    }
  }

  return (
    <Card className="border-slate-200 shadow-2xs overflow-hidden bg-white">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Product & Status Info */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(status)}
              <span className="text-xs text-slate-500 font-mono">
                Legal Metrology (PC) Rules, 2011
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {productName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <span>Analyzed on {new Date(analyzedAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}</span>
            </p>
          </div>

          {/* Score Dial / Badge */}
          <div className="flex items-center gap-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shrink-0">
            <div className="shrink-0">{getStatusIcon(status)}</div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-sans">
                  {score}%
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Statutory Compliance
              </p>
            </div>
          </div>
        </div>

        {/* Declaration Breakdown Cards */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-3 bg-emerald-50/50 border border-emerald-200/80 p-4 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-emerald-950">{passedCount} Detected</p>
              <p className="text-xs text-emerald-700 mt-0.5">Complies with mandatory declarations</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-200/80 p-4 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-amber-950">{needsReviewCount} Unable to Verify</p>
              <p className="text-xs text-amber-700 mt-0.5">Partial text / additional panel needed</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-red-50/50 border border-red-200/80 p-4 rounded-xl">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-red-950">{missingCount} Possible Violation</p>
              <p className="text-xs text-red-700 mt-0.5">Mandatory statutory declaration absent</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
