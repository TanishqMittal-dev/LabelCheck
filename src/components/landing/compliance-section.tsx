import { CheckCircle2 } from 'lucide-react'

const DECLARATIONS = [
  { rule: 'Rule 6(1)(a)', name: 'Product Name / Generic Name', mandatory: true },
  { rule: 'Rule 6(1)(b)', name: 'Manufacturer / Packer Name & Address', mandatory: true },
  { rule: 'Rule 6(1)(c)', name: 'Net Quantity (weight, volume or number)', mandatory: true },
  { rule: 'Rule 6(1)(d)', name: 'Maximum Retail Price (MRP incl. all taxes)', mandatory: true },
  { rule: 'Rule 6(1)(e)', name: 'Month & Year of Manufacture / Packing', mandatory: true },
  { rule: 'Rule 6(1)(f)', name: 'Consumer Care / Grievance Details', mandatory: true },
  { rule: 'Rule 6(1)(g)', name: 'Country of Origin (for imported goods)', mandatory: false },
  { rule: 'Rule 6(1)(h)', name: 'Importer Name & Address', mandatory: false },
  { rule: 'Applicable rules', name: 'Best Before / Expiry Date', mandatory: false },
  { rule: 'Applicable rules', name: 'Other applicable declarations', mandatory: false },
]

export function ComplianceSection() {
  return (
    <section id="compliance" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Compliance</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              Based on Legal Metrology Rules
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              LabelCheck verifies declarations required under the{' '}
              <strong className="text-slate-700">Legal Metrology (Packaged Commodities) Rules, 2011</strong>
              {' '}— the central legislation governing mandatory declarations on packaged commodities in India.
            </p>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              ⚠ LabelCheck is a compliance assistance tool. Results are indicative and should be verified against the applicable rules and the physical product. This tool does not constitute legal advice.
            </p>
          </div>

          {/* Right checklist */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-5 py-3">
              <p className="text-sm font-semibold text-white">Required Declarations — PC Rules 2011</p>
            </div>
            <div className="divide-y divide-slate-200">
              {DECLARATIONS.map((decl) => (
                <div key={decl.name} className="flex items-start gap-3 px-5 py-3.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 font-medium">{decl.name}</p>
                    <p className="text-xs text-slate-400">{decl.rule}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${decl.mandatory ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    {decl.mandatory ? 'Mandatory' : 'Conditional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
