import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { FeaturesSection } from '@/components/landing/features-section'
import { CTASection } from '@/components/landing/cta-section'

export const metadata = {
  title: 'Features',
  description: 'AI-driven packaged commodity verification features built for scale and accuracy.',
}

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
