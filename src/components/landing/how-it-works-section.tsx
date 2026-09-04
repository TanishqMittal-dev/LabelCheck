import { Upload, FileSearch, ShieldCheck, FileText } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload / Scan',
    description: 'Capture the front, back or label of a packaged product. Supports JPG, PNG and WEBP. Works on mobile camera too.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    dotColor: 'bg-blue-600',
  },
  {
    step: '02',
    icon: FileSearch,
    title: 'Extract',
    description: 'OCR and AI identify relevant declarations from the package including text, numbers and structured data fields.',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    dotColor: 'bg-purple-600',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Verify',
    description: 'The extracted information is checked against configurable compliance rules based on Legal Metrology requirements.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    dotColor: 'bg-emerald-600',
  },
  {
    step: '04',
    icon: FileText,
    title: 'Report',
    description: 'Get a clear compliance result with detected declarations, identified issues, and actionable recommendations.',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    dotColor: 'bg-amber-600',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] rounded-full px-3.5 py-1 text-xs font-semibold">
            <span>Inspection Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1B35] tracking-tight">How नेत्र Works</h2>
          <p className="text-base sm:text-lg text-[#475569] max-w-xl mx-auto leading-relaxed">
            Four simple steps from packaged commodity photo to statutory compliance audit certificate.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-[#E2E8F0] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="flex flex-col items-center text-center group">
                  {/* Icon circle */}
                  <div className={`w-16 h-16 rounded-2xl border-2 ${step.color} flex items-center justify-center mb-4 shadow-2xs bg-white relative card-hover`}>
                    <Icon className="w-7 h-7" />
                    <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full ${step.dotColor} flex items-center justify-center shadow-xs`}>
                      <span className="text-white text-[10px] font-bold">{index + 1}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-[#0F1B35] text-lg mb-1.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-xs">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
