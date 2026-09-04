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
          <Badge variant="success" className="gap-1 font-semibold text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Detected
          </Badge>
        )
      case 'needs_review':
        return (
          <Badge variant="warning" className="gap-1 font-semibold text-[11px]">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Needs Review
          </Badge>
        )
      case 'missing':
        return (
          <Badge variant="destructive" className="gap-1 font-semibold text-[11px]">
            <XCircle className="w-3 h-3 text-red-600" />
            Missing
          </Badge>
        )
    }
  }

  return (
    <Card className="border-slate-200/80 shadow-2xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Extracted Declarations &amp; Label Information
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Verifications based on Rule 6, Legal Metrology (Packaged Commodities) Rules, 2011
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
            {results.length} Fields Checked
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Declaration Field</th>
                <th className="pb-3 font-semibold">Detected Text / Value</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 align-top">
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm block">
                      {result.displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {result.fieldName}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 align-top">
                    {result.detectedValue ? (
                      <span className="text-slate-700 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200/60 rounded-md px-2.5 py-1 inline-block">
                        {result.detectedValue}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Not identified on label
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 align-top">
                    <span className="text-xs font-semibold text-slate-600">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5 text-right align-top">
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
