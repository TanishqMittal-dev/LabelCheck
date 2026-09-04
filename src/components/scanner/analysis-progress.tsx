'use client'

import { CheckCircle2, Loader2, ScanLine } from 'lucide-react'
import { AnalysisStep } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface AnalysisProgressProps {
  steps: AnalysisStep[]
  currentStep: number
}

export function AnalysisProgress({ steps, currentStep }: AnalysisProgressProps) {
  const progressPercent = Math.min(
    100,
    Math.round(((currentStep + 1) / steps.length) * 100)
  )

  return (
    <Card className="border-slate-200 shadow-lg overflow-hidden max-w-xl mx-auto">
      {/* Header bar */}
      <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl mx-auto flex items-center justify-center mb-3 shadow-md">
          <ScanLine className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">AI Compliance Analysis</h3>
        <p className="text-xs text-slate-400 mt-1">
          Evaluating label against Legal Metrology (Packaged Commodities) Rules, 2011
        </p>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
            <span>Overall Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <CardContent className="p-6 space-y-4 bg-white">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep
          const isPending = idx > currentStep

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-50/70 border border-blue-200/80 shadow-xs'
                  : isDone
                  ? 'bg-slate-50/50'
                  : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-semibold text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-blue-900'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-medium text-emerald-600">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
