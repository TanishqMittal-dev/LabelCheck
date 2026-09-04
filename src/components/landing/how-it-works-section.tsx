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
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Process</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">How नेत्र Works</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Four simple steps from product image to compliance report.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-slate-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className={`w-16 h-16 rounded-2xl border-2 ${step.color} flex items-center justify-center mb-4 shadow-sm bg-white relative`}>
                    <Icon className="w-7 h-7" />
                    <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full ${step.dotColor} flex items-center justify-center`}>
                      <span className="text-white text-[9px] font-bold">{index + 1}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
