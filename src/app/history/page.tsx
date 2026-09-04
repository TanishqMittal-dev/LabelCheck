'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ScanLine, History as HistoryIcon, Download } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { HistoryTable } from '@/components/history/history-table'
import { createClient } from '@/lib/supabase/client'
import { getScans } from '@/services/scans'
import { Scan } from '@/types'

const DEMO_SCANS: Scan[] = [
  {
    id: 'demo-1',
    userId: 'demo-user',
    productName: 'Fresh Harvest Basmati Rice',
    imageUrl: null,
    complianceScore: 84,
    status: 'needs_review',
    totalDeclarations: 10,
    passedDeclarations: 8,
    issueCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'demo-2',
    userId: 'demo-user',
    productName: 'NatureDrop Organic Honey',
    imageUrl: null,
    complianceScore: 98,
    status: 'compliant',
    totalDeclarations: 10,
    passedDeclarations: 10,
    issueCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'demo-3',
    userId: 'demo-user',
    productName: 'SunPure Refined Sunflower Oil',
    imageUrl: null,
    complianceScore: 78,
    status: 'needs_review',
    totalDeclarations: 10,
    passedDeclarations: 7,
    issueCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'demo-4',
    userId: 'demo-user',
    productName: 'DailyFresh Whole Wheat Flour',
    imageUrl: null,
    complianceScore: 62,
    status: 'non_compliant',
    totalDeclarations: 10,
    passedDeclarations: 5,
    issueCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>(DEMO_SCANS)
  const supabase = createClient()

  useEffect(() => {
    async function loadScans() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const userScans = await getScans(user.id)
          if (userScans && userScans.length > 0) {
            setScans(userScans)
          }
        }
      } catch (err) {
        console.error('Error fetching scan history:', err)
      }
    }
    loadScans()
  }, [supabase])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HistoryIcon className="w-5 h-5 text-blue-600" />
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Scan History
                </h1>
              </div>
              <p className="text-slate-500 text-sm">
                Review and download previous Legal Metrology compliance verification records.
              </p>
            </div>

            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 font-semibold">
              <Link href="/scan" className="flex items-center gap-1.5">
                <ScanLine className="w-4 h-4" />
                New Scan
              </Link>
            </Button>
          </div>

          {/* History Table */}
          <HistoryTable initialScans={scans} />
        </div>
      </main>
      <Footer />
    </>
  )
}
