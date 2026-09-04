import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { CTASection } from '@/components/landing/cta-section'

export const metadata = {
  title: 'How It Works',
  description: 'Understand how LabelCheck extracts declarations and audits Legal Metrology compliance.',
}

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
