import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'LabelCheck – Scan. Verify. Comply.',
    template: '%s | LabelCheck',
  },
  description:
    'AI-powered packaged commodity compliance checking based on Legal Metrology (Packaged Commodities) Rules, 2011.',
  keywords: ['legal metrology', 'packaged commodities', 'compliance', 'label check', 'MRP', 'consumer protection'],
  authors: [{ name: 'LabelCheck' }],
  openGraph: {
    title: 'LabelCheck – Scan. Verify. Comply.',
    description: 'AI-powered packaged commodity compliance checker.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
