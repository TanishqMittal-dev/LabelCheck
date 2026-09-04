import { Zap, ShieldCheck, BarChart3, FileSearch, Globe, Smartphone } from 'lucide-react'

const FEATURES = [
  {
    icon: FileSearch,
    title: 'AI Declaration Extraction',
    description: 'Automatically identifies and extracts all required declarations from product labels using computer vision.',
    tag: 'Core',
  },
  {
    icon: ShieldCheck,
    title: 'Legal Metrology Rules',
    description: 'Checks against all 10 mandatory declarations under the Packaged Commodities Rules, 2011.',
    tag: 'Compliance',
  },
  {
    icon: BarChart3,
    title: 'Compliance Score',
    description: 'Generates a quantitative compliance score with detailed breakdown of detected, review-needed, and missing declarations.',
    tag: 'Reporting',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get compliance results in seconds. No manual checklist, no paperwork.',
    tag: 'Speed',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Scanner',
    description: 'Capture product labels directly with your phone camera. Optimised for on-the-go inspections.',
    tag: 'Mobile',
  },
  {
    icon: Globe,
    title: 'Extensible Architecture',
    description: 'Designed for multilingual OCR, QR/barcode scanning, regional language support, and government dashboard integration.',
    tag: 'Future-ready',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] rounded-full px-3.5 py-1 text-xs font-semibold">
            <span>Capabilities &amp; Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1B35] tracking-tight">
            Built for National-Scale Legal Metrology Auditing
          </h2>
          <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Everything enforcement officers, brand manufacturers, and consumers need to verify packaged commodity compliance rapidly and accurately.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] card-hover group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#EFF6FF] group-hover:bg-[#2563EB] group-hover:text-white rounded-xl flex items-center justify-center shrink-0 transition-colors text-[#2563EB]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#0F1B35] text-base">{feature.title}</h3>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md uppercase">
                        {feature.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
