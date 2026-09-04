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
        <div className="flex items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-red-50/80 border-2 border-red-300 text-red-950 shadow-2xs">
          <XCircle className="w-7 h-7 text-red-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black tracking-wider uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-md">
                POSSIBLE VIOLATION DETECTED
              </span>
              <span className="text-xs font-semibold text-red-900">
                Non-compliance under Legal Metrology Rules, 2011
              </span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              One or more statutory declarations required under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011 were not detected on mandatory display panels. Physical verification or packaging amendment required.
            </p>
          </div>
        </div>
      )
    }

    if (counts.unable_to_verify > 0 || overallStatus === 'needs_review') {
      return (
        <div className="flex items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-amber-950 shadow-2xs">
          <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black tracking-wider uppercase bg-amber-600 text-white px-2.5 py-0.5 rounded-md">
                UNABLE TO FULLY VERIFY
              </span>
              <span className="text-xs font-semibold text-amber-900">
                Additional package panels required
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Certain mandatory declarations (e.g. consumer care, complete manufacturer address, or date formatting) could not be conclusively verified because only a single panel was provided or text was partially obscured.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 text-emerald-950 shadow-2xs">
        <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black tracking-wider uppercase bg-emerald-600 text-white px-2.5 py-0.5 rounded-md">
              NO DETECTABLE ISSUE
            </span>
            <span className="text-xs font-semibold text-emerald-900">
              Statutory verification passed
            </span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            All applicable mandatory declarations under Legal Metrology (Packaged Commodities) Rules, 2011 have been successfully detected with high optical confidence on the scanned package panels.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-slate-200 shadow-2xs overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/80 border-b border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                Rule Engine
              </span>
              <span className="text-xs font-medium text-slate-600">
                Category: <strong className="text-slate-900 font-bold">{productCategory}</strong>
              </span>
            </div>
            <CardTitle className="text-xl font-black text-slate-950 tracking-tight">
              MANDATORY DECLARATION CHECK
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Automated statutory audit against Legal Metrology (Packaged Commodities) Rules, 2011
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              {imageCoverage?.isMultiView ? 'Multi-Panel Inspection' : 'Single-Panel View'}
            </span>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div>
          {getOverallBanner()}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Applicable ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('detected')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === 'detected'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            🟢 Detected ({counts.detected})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unable_to_verify')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === 'unable_to_verify'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            🟡 Unable to Verify ({counts.unable_to_verify})
          </button>
          <button
            type="button"
            onClick={() => setFilter('possible_violation')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === 'possible_violation'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-red-50 hover:text-red-800'
            }`}
          >
            🔴 Possible Violation ({counts.possible_violation})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4 bg-white">
        {filteredChecks.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
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
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                  isDetected
                    ? 'bg-emerald-50/20 border-emerald-200/90'
                    : isUnable
                    ? 'bg-amber-50/20 border-amber-200/90'
                    : 'bg-red-50/20 border-red-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0">
                      {isDetected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isUnable && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {isViolation && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-slate-950">
                          {check.declarationName}
                        </h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          check.regulatoryFramework === 'FSSAI'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {check.regulatoryFramework}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          {check.legalReference}
                        </span>
                      </div>

                      {/* Extracted Value if detected */}
                      {isDetected && check.detectedValue && (
                        <div className="text-xs text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Extracted Package Text</p>
                          <p className="font-semibold text-slate-800">{check.detectedValue}</p>
                        </div>
                      )}

                      {/* Reason / Status explanation */}
                      <p className={`text-xs leading-relaxed ${
                        isDetected ? 'text-emerald-800' : isUnable ? 'text-amber-900' : 'text-red-900 font-medium'
                      }`}>
                        <strong>{isDetected ? 'Verification:' : isUnable ? 'Review Note — ' : 'Violation Finding — '}</strong>
                        {check.reason}
                      </p>

                      {check.applicability && (
                        <p className="text-[11px] text-slate-500">
                          <strong className="text-slate-600">Applicability:</strong> {check.applicability}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge & Confidence */}
                  <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                    {isDetected && (
                      <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full">
                        🟢 DETECTED
                      </span>
                    )}
                    {isUnable && (
                      <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
                        🟡 UNABLE TO VERIFY
                      </span>
                    )}
                    {isViolation && (
                      <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-900 border border-red-300 px-3 py-1 rounded-full">
                        🔴 POSSIBLE VIOLATION
                      </span>
                    )}

                    {check.confidence > 0 && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        Confidence: {(check.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Footer */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">Rule ID: {check.ruleId}</span>
                    <span>&bull;</span>
                    <span>Framework: {check.regulatoryFramework}</span>
                    <span>&bull;</span>
                    <span>Version: {check.ruleVersion}</span>
                  </div>
                  {check.panelNote && (
                    <span className="text-slate-600 font-medium italic">
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
