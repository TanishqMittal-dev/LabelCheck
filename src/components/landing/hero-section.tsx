'use client'

import Link from 'next/link'
import { ArrowRight, ScanLine, CheckCircle2, AlertCircle, XCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DETECTED_FIELDS = [
  { label: 'Product Name', value: 'Fresh Harvest Basmati Rice', status: 'ok' },
  { label: 'MRP', value: '₹349 (Incl. all taxes)', status: 'ok' },
  { label: 'Net Quantity', value: '5 Kg', status: 'ok' },
  { label: 'Manufacturer', value: 'Fresh Harvest Foods Pvt. Ltd.', status: 'ok' },
  { label: 'Address', value: 'Ludhiana, Punjab – 141003', status: 'ok' },
  { label: 'Mfg. Date', value: 'Aug 2026', status: 'ok' },
  { label: 'Consumer Care', value: 'Not clearly detected', status: 'warn' },
  { label: 'Country of Origin', value: 'India', status: 'ok' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-medium">
              <ScanLine className="w-4 h-4" />
              Legal Metrology Compliance Tool
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Verify Every Label.{' '}
              <span className="text-blue-600">Before It Reaches</span>{' '}
              the Consumer.
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              AI-powered packaged commodity compliance checking based on Legal Metrology (Packaged Commodities) Rules, 2011. Identify missing declarations instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                <Link href="/scan">
                  <ScanLine className="w-5 h-5" />
                  Scan a Product
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-slate-300 hover:border-slate-400">
                <Link href="/#how-it-works">
                  <Play className="w-4 h-4" />
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                '10 compliance declarations checked',
                'Legal Metrology Rules 2011',
                'Instant analysis',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — product scan card */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-4 bg-blue-100/50 rounded-3xl blur-xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 bg-red-400 rounded-full" />
                  <span className="w-3 h-3 bg-amber-400 rounded-full" />
                  <span className="w-3 h-3 bg-emerald-400 rounded-full" />
                </div>
                <span className="text-xs text-slate-400 font-medium">netra.app/scan</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Product image placeholder */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl h-32 flex items-center justify-center border border-slate-200">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto">
                      <ScanLine className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Fresh Harvest Basmati Rice — 5 Kg</p>
                  </div>
                </div>

                {/* Label fields */}
                <div className="space-y-2">
                  {DETECTED_FIELDS.map((field) => (
                    <div key={field.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-xs text-slate-400">{field.label}</p>
                        <p className="text-sm text-slate-700 font-medium">{field.value}</p>
                      </div>
                      {field.status === 'ok' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Analysis result strip */}
                <div className="bg-slate-900 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Compliance Status</p>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">Needs Review</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xl font-bold text-emerald-400">8</p>
                      <p className="text-xs text-slate-400">Detected</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-amber-400">1</p>
                      <p className="text-xs text-slate-400">Review</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-400">0</p>
                      <p className="text-xs text-slate-400">Missing</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-800 rounded-lg p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Compliance Score</span>
                      <span className="text-amber-400 font-bold">84%</span>
                    </div>
                    <div className="mt-1.5 bg-slate-700 rounded-full h-1.5">
                      <div className="bg-amber-400 rounded-full h-1.5" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
