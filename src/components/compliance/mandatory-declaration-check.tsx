'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Info, Layers } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MandatoryDeclarationCheckResult, MandatoryCheckStatus, ImageCoverageInfo, ScanStatus } from '@/types'

interface MandatoryDeclarationCheckProps {
  checks?: MandatoryDeclarationCheckResult[]
  productCategory?: string
  imageCoverage?: ImageCoverageInfo
  overallStatus?: ScanStatus
}

export function MandatoryDeclarationCheck({
  checks = [],
  productCategory = 'General Packaged Commodities',
  imageCoverage,
  overallStatus = 'compliant',
}: MandatoryDeclarationCheckProps) {
  const [filter, setFilter] = useState<'all' | MandatoryCheckStatus>('all')

  const filteredChecks = checks.filter(c => {
    if (filter === 'all') return true
    return c.status === filter
  })

  const counts = {
    all: checks.length,
    detected: checks.filter(c => c.status === 'detected').length,
    unable_to_verify: checks.filter(c => c.status === 'unable_to_verify').length,
    possible_violation: checks.filter(c => c.status === 'possible_violation').length,
  }

  const getOverallBanner = () => {
    if (counts.possible_violation > 0 || overallStatus === 'non_compliant') {
      return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900">
          <XCircle className="w-6 h-6 text-red-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold tracking-tight text-red-900">
              🔴 POSSIBLE VIOLATION
            </p>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              One or more statutory declarations required under Legal Metrology (Packaged Commodities) Rules, 2011 were not detected on mandatory display panels.
            </p>
          </div>
        </div>
      )
    }

    if (counts.unable_to_verify > 0 || overallStatus === 'needs_review') {
      return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold tracking-tight text-amber-900">
              🟡 UNABLE TO VERIFY
            </p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Certain mandatory declarations (e.g. consumer care or manufacturer details) could not be verified because additional package panels (like the back or side panel) were not provided or text was partially obscured.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold tracking-tight text-emerald-900">
            🟢 NO DETECTABLE ISSUE
          </p>
          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
            All applicable mandatory declarations under Legal Metrology Rules, 2011 have been detected with high confidence on the provided package panels.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-slate-200/80 shadow-2xs overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/70 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                Rule Engine
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Product Category: <strong className="text-slate-900">{productCategory}</strong>
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">
              MANDATORY DECLARATION CHECK
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Statutory verification against Legal Metrology (Packaged Commodities) Rules, 2011
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {imageCoverage?.isMultiView ? 'Multi-Panel Coverage' : 'Single-Panel View'}
            </span>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div className="mt-4">
          {getOverallBanner()}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-200/70">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Applicable ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('detected')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'detected'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            🟢 Detected ({counts.detected})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unable_to_verify')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'unable_to_verify'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            🟡 Unable to Verify ({counts.unable_to_verify})
          </button>
          <button
            type="button"
            onClick={() => setFilter('possible_violation')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'possible_violation'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            🔴 Possible Violation ({counts.possible_violation})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-3.5 bg-white">
        {filteredChecks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No declarations match the selected filter.
          </div>
        ) : (
          filteredChecks.map(check => {
            const isDetected = check.status === 'detected'
            const isUnable = check.status === 'unable_to_verify'
            const isViolation = check.status === 'possible_violation'

            return (
              <div
                key={check.ruleId}
                className={`p-4 rounded-xl border transition-all ${
                  isDetected
                    ? 'bg-emerald-50/25 border-emerald-200/80'
                    : isUnable
                    ? 'bg-amber-50/30 border-amber-200/80'
                    : 'bg-red-50/30 border-red-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isDetected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isUnable && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {isViolation && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">
                          {check.declarationName}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          check.regulatoryFramework === 'FSSAI'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {check.regulatoryFramework}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {check.legalReference}
                        </span>
                      </div>

                      {/* Extracted Value if detected */}
                      {isDetected && check.detectedValue && (
                        <p className="text-xs text-slate-800 font-medium bg-white/80 p-2 rounded-md border border-slate-200/70">
                          <strong className="text-slate-600">Detected:</strong> {check.detectedValue}
                        </p>
                      )}

                      {/* Reason / Status explanation */}
                      <p className={`text-xs ${
                        isDetected ? 'text-emerald-700' : isUnable ? 'text-amber-800' : 'text-red-800 font-medium'
                      }`}>
                        <strong>{isDetected ? 'Verification:' : isUnable ? 'Unable to verify — ' : 'Violation Reason — '}</strong>
                        {check.reason}
                      </p>

                      {check.applicability && (
                        <p className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-500">Applicability:</span> {check.applicability}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge & Confidence */}
                  <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                    {isDetected && (
                      <Badge variant="success" className="text-[11px] px-2.5 py-0.5 font-bold uppercase tracking-wider">
                        🟢 DETECTED
                      </Badge>
                    )}
                    {isUnable && (
                      <Badge variant="warning" className="text-[11px] px-2.5 py-0.5 font-bold uppercase tracking-wider">
                        🟡 UNABLE TO VERIFY
                      </Badge>
                    )}
                    {isViolation && (
                      <Badge variant="destructive" className="text-[11px] px-2.5 py-0.5 font-bold uppercase tracking-wider">
                        🔴 POSSIBLE VIOLATION
                      </Badge>
                    )}

                    {check.confidence > 0 && (
                      <span className="text-[11px] font-medium text-slate-500">
                        Confidence: {(check.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Footer: Rule ID, Version, Requirement */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">Rule ID: {check.ruleId}</span>
                    <span>&bull;</span>
                    <span>Framework: {check.regulatoryFramework}</span>
                    <span>&bull;</span>
                    <span>Version: {check.ruleVersion}</span>
                  </div>
                  {check.panelNote && (
                    <span className="text-slate-500 italic">
                      Panel: {check.panelNote}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
