import Link from 'next/link'
import { ScanLine, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">नेत्र</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              AI-powered packaged commodity compliance checking based on Legal Metrology (Packaged Commodities) Rules, 2011. Helping consumers, businesses and enforcement authorities verify product declarations.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              SIH 2026 — Problem Statement PSC26034
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
            <ul className="space-y-2">
              {[
                { href: '/#how-it-works', label: 'How It Works' },
                { href: '/#features', label: 'Features' },
                { href: '/#compliance', label: 'Compliance Rules' },
                { href: '/scan', label: 'Scan a Product' },
                { href: '/about', label: 'About' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal & Reference</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://legalmetrology.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Legal Metrology Dept.
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-sm text-slate-400">
                  PC Rules 2011
                </span>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2026 नेत्र. Built for SIH 2026 Problem Statement PSC26034.
          </p>
          <p className="text-xs text-slate-500 text-center">
            ⚠ Demo application. Results are indicative only. Always verify with official Legal Metrology requirements.
          </p>
        </div>
      </div>
    </footer>
  )
}
