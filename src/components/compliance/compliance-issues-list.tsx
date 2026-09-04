import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ComplianceIssue } from '@/types'
import { getSeverityLabel } from '@/lib/utils'

interface ComplianceIssuesListProps {
  issues: ComplianceIssue[]
}

export function ComplianceIssuesList({ issues }: ComplianceIssuesListProps) {
  const getSeverityBadge = (severity: ComplianceIssue['severity']) => {
    switch (severity) {
      case 'high':
        return <span className="font-extrabold text-[10px] uppercase bg-red-100 text-red-900 border border-red-300 px-2.5 py-0.5 rounded-full">High Severity</span>
      case 'medium':
        return <span className="font-extrabold text-[10px] uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">Medium Severity</span>
      case 'low':
        return <span className="font-extrabold text-[10px] uppercase bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full">Low Severity</span>
    }
  }

  if (issues.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40 shadow-2xs">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">No Compliance Issues Detected</h3>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              Based on the scanned package declarations, all mandatory requirements under Legal Metrology (Packaged Commodities) Rules, 2011 appear to be present and legible.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-base font-bold text-slate-900">
            Compliance Findings &amp; Observations
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Potential non-compliances and items requiring physical package verification
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {issues.map((issue, idx) => (
          <div
            key={issue.id || idx}
            className="p-4 sm:p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/30 space-y-3"
          >
            {/* Header: Title + Severity */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Potential Issue: {issue.affectedField ? issue.affectedField.replace(/_/g, ' ').toUpperCase() : 'Declaration Verification'}
                </span>
              </div>
              {getSeverityBadge(issue.severity)}
            </div>

            {/* Description */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Observation
              </p>
              <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5 leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Why it matters */}
            <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
              <p className="text-xs font-bold text-slate-900">Statutory Requirement &amp; Impact</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011, this declaration is mandatory on the principal display panel or package exterior to prevent consumer deception and guarantee fair trade measurement.
              </p>
            </div>

            {/* Recommended Action */}
            <div className="bg-blue-50/90 p-3 rounded-xl border border-blue-200 shadow-2xs">
              <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                Recommended Corrective Action
              </p>
              <p className="text-xs text-blue-950 font-medium mt-0.5 leading-relaxed">
                {issue.recommendation}
              </p>
            </div>
          </div>
        ))}

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Statutory Notice:</strong> Findings are generated automatically from optical image inspection and do not constitute formal legal certification. Final enforcement actions require physical inspection by an authorized Legal Metrology Inspector.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
