import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ComplianceSection } from '@/components/landing/compliance-section'
import { CTASection } from '@/components/landing/cta-section'

export const metadata = {
  title: 'Compliance Rules',
  description: 'Legal Metrology (Packaged Commodities) Rules, 2011 compliance definitions and declarations.',
}

export default function CompliancePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <ComplianceSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
