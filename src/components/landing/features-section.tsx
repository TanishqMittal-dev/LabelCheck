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
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Features</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Built for Compliance at Scale</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Everything you need to verify packaged commodity labels quickly and accurately.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">{feature.tag}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
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
