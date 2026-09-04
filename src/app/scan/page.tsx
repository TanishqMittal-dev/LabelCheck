import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductScanner } from '@/components/scanner/product-scanner'
import { ShieldCheck, Info, CheckCircle, FileText } from 'lucide-react'

export const metadata = {
  title: 'Scan Product Compliance',
  description: 'Upload or capture a product label to check Legal Metrology compliance.',
}

export default function ScanPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Legal Metrology Compliance Engine
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Check Product Compliance
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl">
              Upload a clear photo or label scan of the packaged commodity. Our system extracts mandatory declarations and verifies compliance with Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </div>

          {/* Scanner Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
            <ProductScanner />
          </div>

          {/* Quick Guide / Best Practices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Clear Lighting</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ensure the text, batch code, and dates are well lit and readable without severe glare.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">All Panels</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Front, back, and side panels usually contain the MRP, net quantity, and manufacturer details.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Indicative AI</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Results serve as a fast compliance screening tool. Always inspect original packaging for final audits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
