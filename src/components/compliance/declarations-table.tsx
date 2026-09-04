import { CheckCircle2, AlertTriangle, XCircle, Shield } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScanResult } from '@/types'

interface DeclarationsTableProps {
  results: ScanResult[]
}

export function DeclarationsTable({ results }: DeclarationsTableProps) {
  const getStatusBadge = (status: ScanResult['status']) => {
    switch (status) {
      case 'detected':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Detected
          </span>
        )
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Needs Review
          </span>
        )
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-red-50 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Missing
          </span>
        )
    }
  }

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Extracted Declarations &amp; Optical Recognition (OCR)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Field-level extraction audit against Rule 6, Legal Metrology (PC) Rules, 2011
            </CardDescription>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg w-fit shadow-2xs">
            {results.length} Fields Audited
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 font-bold">Declaration Field</th>
                <th className="py-3 px-4 font-bold">Detected Value</th>
                <th className="py-3 px-4 font-bold">OCR Confidence</th>
                <th className="py-3 px-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                      {result.displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {result.fieldName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 align-top max-w-xs sm:max-w-md">
                    {result.detectedValue ? (
                      <span className="text-slate-800 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 inline-block leading-relaxed">
                        {result.detectedValue}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Not identified on label
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right align-top">
                    {getStatusBadge(result.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
