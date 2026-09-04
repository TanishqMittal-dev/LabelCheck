'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScanResult, ComplianceStatus } from '@/types'

interface ComplianceChecklistProps {
  results: ScanResult[]
}

export function ComplianceChecklist({ results }: ComplianceChecklistProps) {
  const [filter, setFilter] = useState<'all' | ComplianceStatus>('all')

  const filteredResults = results.filter((r) => {
    if (filter === 'all') return true
    return r.status === filter
  })

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'detected':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case 'needs_review':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  const counts = {
    all: results.length,
    detected: results.filter((r) => r.status === 'detected').length,
    needs_review: results.filter((r) => r.status === 'needs_review').length,
    missing: results.filter((r) => r.status === 'missing').length,
  }

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Legal Metrology Compliance Checklist
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Item-by-item verification status under Legal Metrology Rules, 2011
            </CardDescription>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilter('detected')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'detected'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-emerald-800'
              }`}
            >
              Passed ({counts.detected})
            </button>
            <button
              onClick={() => setFilter('needs_review')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'needs_review'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-amber-800'
              }`}
            >
              Needs Review ({counts.needs_review})
            </button>
            <button
              onClick={() => setFilter('missing')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'missing'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-red-800'
              }`}
            >
              Missing ({counts.missing})
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {filteredResults.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No declarations match the selected filter.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filteredResults.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">{getStatusIcon(item.status)}</div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.displayName}
                    </span>
                    {item.detectedValue && (
                      <p className="text-xs text-slate-600 font-mono mt-0.5">
                        {item.detectedValue}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'detected'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : item.status === 'needs_review'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                    }`}
                  >
                    {item.status === 'detected'
                      ? '✓ Passed'
                      : item.status === 'needs_review'
                      ? '⚠ Needs Review'
                      : '✕ Missing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
