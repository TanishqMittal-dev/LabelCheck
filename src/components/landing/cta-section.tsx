import Link from 'next/link'
import { ScanLine, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/40 text-blue-100 rounded-full px-4 py-1.5 text-sm font-medium">
            <ScanLine className="w-4 h-4" />
            Ready to check your products?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Start Verifying Labels Today
          </h2>
          <p className="text-lg text-blue-100">
            Upload a product image and get a detailed compliance analysis in seconds. No setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg font-semibold">
              <Link href="/scan">
                <ScanLine className="w-5 h-5" />
                Scan a Product
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-blue-400 text-white hover:bg-blue-500">
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
