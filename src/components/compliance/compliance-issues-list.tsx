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
        return <Badge variant="destructive" className="font-bold text-[10px] uppercase">High Severity</Badge>
      case 'medium':
        return <Badge variant="warning" className="font-bold text-[10px] uppercase">Medium Severity</Badge>
      case 'low':
        return <Badge variant="default" className="font-bold text-[10px] uppercase bg-blue-600">Low Severity</Badge>
    }
  }

  if (issues.length === 0) {
    return (
      <Card className="border-emerald-200/80 bg-emerald-50/30 shadow-2xs">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">No Major Compliance Issues Flagged</h3>
            <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
              Based on the visible declarations in the uploaded image, all mandatory declarations under Legal Metrology (Packaged Commodities) Rules, 2011 appear to be present and legible.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200/80 shadow-2xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-base font-bold text-slate-900">
            Identified Compliance Findings &amp; Issues
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Potential non-compliances and items requiring physical package verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.map((issue, idx) => (
          <div
            key={issue.id || idx}
            className="p-4 rounded-xl border border-amber-200/70 bg-amber-50/40 space-y-3"
          >
            {/* Header: Title + Severity */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-amber-950">
                  Potential Issue: {issue.affectedField ? issue.affectedField.replace(/_/g, ' ').toUpperCase() : 'Declaration Verification'}
                </span>
              </div>
              {getSeverityBadge(issue.severity)}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Observation
              </p>
              <p className="text-xs sm:text-sm text-slate-800 mt-0.5 leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Why it matters */}
            <div className="bg-white/80 p-3 rounded-lg border border-amber-200/50">
              <p className="text-xs font-bold text-slate-900">Why It Matters</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Under the Legal Metrology (Packaged Commodities) Rules, 2011, this declaration is required to protect consumer rights and ensure full commercial transparency.
              </p>
            </div>

            {/* Recommended Action */}
            <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-100">
              <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                Recommended Action
              </p>
              <p className="text-xs text-blue-950/80 mt-0.5 leading-relaxed">
                {issue.recommendation}
              </p>
            </div>
          </div>
        ))}

        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> Findings are generated algorithmically from optical image inspection and do not constitute formal legal judgment. Final enforcement actions require physical inspection by an authorized Legal Metrology officer.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
