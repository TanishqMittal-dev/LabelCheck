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
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-24 pb-20 overflow-hidden bg-[#F8FAFC]">
      {/* Background subtle radial ambient gradients & grid */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] rounded-full px-3.5 py-1 text-xs font-semibold shadow-2xs">
              <ScanLine className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>SIH 2026 &bull; Legal Metrology Inspection Platform</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F1B35] leading-[1.12] tracking-tight">
                Scan. Verify.{' '}
                <span className="bg-gradient-to-r from-[#2563EB] to-[#059669] bg-clip-text text-transparent">
                  Comply.
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-[#475569] leading-snug">
                AI-powered packaged commodity compliance audit for Legal Metrology (PC) Rules, 2011.
              </p>
            </div>

            <p className="text-base text-[#475569] leading-relaxed max-w-xl">
              Inspect multi-panel product packaging in seconds. Instant OCR extraction checks all 10 statutory declarations, Unit Sale Price (USP), MRP, Net Quantity, and manufacturer details with authoritative legal references.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md font-semibold h-12 px-7 text-base rounded-xl btn-lift border-0">
                <Link href="/scan" className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5" />
                  Scan Product Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-[#E2E8F0] hover:border-slate-300 bg-white hover:bg-slate-50 font-semibold h-12 px-7 text-base text-[#0F1B35] rounded-xl btn-lift shadow-2xs">
                <Link href="/#how-it-works" className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-slate-500" />
                  How It Works
                </Link>
              </Button>
            </div>

            {/* Feature Highlights with subtle circular backgrounds */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F1B35]">10 Mandatory</p>
                  <p className="text-[11px] text-[#64748B]">Rules Checked</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F1B35]">Unit Sale Price &amp; MRP</p>
                  <p className="text-[11px] text-[#64748B]">Compliant Verification</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F1B35]">Multi-Panel Packaging</p>
                  <p className="text-[11px] text-[#64748B]">Complete Analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — live inspection preview card */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white rounded-3xl shadow-xl border border-[#E2E8F0] overflow-hidden">
              {/* Dark Navy Inspection Header */}
              <div className="bg-[#0F1B35] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-100">
                    LIVE INSPECTION PREVIEW
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold bg-slate-800/90 text-blue-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                  LMR-2011 Verified
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Product simulated header */}
                <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md">
                      FOOD &amp; GROCERY
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] mt-1">Basmati Rice (5 Kg Bag)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full shadow-2xs">
                      🟢 84% Score
                    </span>
                  </div>
                </div>

                {/* Declarations list preview */}
                <div className="space-y-2 text-xs">
                  {DETECTED_FIELDS.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-[11px] text-[#64748B] font-medium">{field.label}</p>
                        <p className="text-xs text-[#0F172A] font-semibold truncate">{field.value}</p>
                      </div>
                      <div className="shrink-0">
                        {field.status === 'ok' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md border border-[#A7F3D0]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            Detected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] bg-[#FFFBEB] px-2.5 py-0.5 rounded-md border border-[#FDE68A]">
                            <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                            Review
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Statutory summary strip */}
                <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                  <span className="font-semibold text-[#0F172A]">Statutory Audit:</span>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-[#059669]">7 Detected</span>
                    <span>&bull;</span>
                    <span className="text-[#D97706]">1 Review</span>
                    <span>&bull;</span>
                    <span className="text-slate-400">0 Missing</span>
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
