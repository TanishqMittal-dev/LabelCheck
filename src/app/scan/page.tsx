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
      <main className="min-h-screen pt-24 pb-16 bg-[#F8FAFC]">
        {/* Subtle Ambient Radial Highlight */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-semibold border border-[#BFDBFE]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Legal Metrology Compliance Inspection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1B35] tracking-tight">
              Package Label Compliance Scanner
            </h1>
            <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed">
              Upload or capture clear photos of the packaged commodity. To ensure 100% statutory verification, provide images of all visible packaging panels.
            </p>

            {/* Panel Guidance Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-[#0F1B35] mr-1">Recommended Panels:</span>
              <span className="text-xs font-semibold bg-white text-[#2563EB] border border-[#BFDBFE] px-2.5 py-0.5 rounded-lg shadow-2xs">
                1. Front (PDP / Name &amp; Net Qty)
              </span>
              <span className="text-xs font-semibold bg-white text-[#059669] border border-[#A7F3D0] px-2.5 py-0.5 rounded-lg shadow-2xs">
                2. Back (MRP, USP &amp; Dates)
              </span>
              <span className="text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                3. Side (Mfg &amp; Consumer Care)
              </span>
            </div>
          </div>

          {/* Scanner Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md">
            <ProductScanner />
          </div>

          {/* Best Practices Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1B35]">Clear &amp; Direct Lighting</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Avoid harsh reflections on plastic wraps. Ensure batch code, MRP, and dates are sharply focused.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] text-[#059669] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1B35]">Multi-Angle Coverage</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Front, back, and side panels ensure complete coverage of Consumer Care, Manufacturer, and USP rules.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#FFFBEB] text-[#D97706] shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1B35]">Instant Statutory AI</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Automatically extracts values, validates unit math, and produces an inspector-ready audit report.
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
