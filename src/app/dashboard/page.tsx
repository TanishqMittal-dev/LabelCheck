'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ScanLine, ShieldCheck, Download, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ComplianceCharts } from '@/components/dashboard/compliance-charts'
import { RecentScansTable } from '@/components/dashboard/recent-scans-table'
import { createClient } from '@/lib/supabase/client'
import { getScans, getDashboardStats } from '@/services/scans'
import { Scan } from '@/types'

// Demo Fallback Data for rich preview
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

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>(DEMO_SCANS)
  const [stats, setStats] = useState({
    totalScans: 127,
    avgComplianceScore: 84,
    totalIssues: 23,
    totalReports: 42,
  })
  const [userName, setUserName] = useState<string>('Inspector / User')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
          const realScans = await getScans(user.id)
          if (realScans && realScans.length > 0) {
            setScans(realScans)
            const realStats = await getDashboardStats(user.id)
            setStats({
              totalScans: realStats.totalScans,
              avgComplianceScore: realStats.avgComplianceScore,
              totalIssues: realStats.totalIssues,
              totalReports: realStats.totalScans,
            })
          }
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      }
    }
    loadData()
  }, [supabase])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {userName}
                </h1>
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-100">
                  Active
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Legal Metrology compliance monitoring &amp; packaged commodity audit overview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-xs">
                <Link href="/scan" className="flex items-center gap-1.5">
                  <ScanLine className="w-4 h-4" />
                  Scan Product
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Compliance Charts */}
          <ComplianceCharts />

          {/* Recent Scans Table */}
          <RecentScansTable scans={scans} />
        </div>
      </main>
      <Footer />
    </>
  )
}
