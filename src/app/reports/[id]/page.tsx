'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Printer,
  Download,
  ArrowLeft,
  ScanLine,
  ShieldCheck,
  Calendar,
  Package,
  FileCheck,
  Share2,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { ComplianceScoreCard } from '@/components/compliance/compliance-score-card'
import { DeclarationsTable } from '@/components/compliance/declarations-table'
import { ComplianceIssuesList } from '@/components/compliance/compliance-issues-list'
import { ComplianceChecklist } from '@/components/compliance/compliance-checklist'
import { getScanById } from '@/services/scans'
import { Scan, AnalysisResult, ScanResult, ComplianceIssue } from '@/types'
import { toast } from 'sonner'

// Default fallback sample report for demo purposes
const SAMPLE_DEMO_RESULT: AnalysisResult = {
  productName: 'Fresh Harvest Basmati Rice (5 Kg)',
  complianceScore: 84,
  status: 'needs_review',
  totalDeclarations: 10,
  passedDeclarations: 8,
  needsReviewCount: 1,
  missingCount: 1,
  analyzedAt: new Date().toISOString(),
  results: [
    { id: '1', fieldName: 'product_name', displayName: 'Product Name', detectedValue: 'Fresh Harvest Basmati Rice (Extra Long Grain)', status: 'detected', confidence: 0.98 },
    { id: '2', fieldName: 'manufacturer_name', displayName: 'Manufacturer Name', detectedValue: 'Fresh Harvest Foods Pvt. Ltd.', status: 'detected', confidence: 0.95 },
    { id: '3', fieldName: 'manufacturer_address', displayName: 'Manufacturer Address', detectedValue: 'Plot 45, Industrial Area Phase II, Ludhiana, Punjab – 141003', status: 'detected', confidence: 0.91 },
    { id: '4', fieldName: 'net_quantity', displayName: 'Net Quantity', detectedValue: '5 Kg', status: 'detected', confidence: 0.99 },
    { id: '5', fieldName: 'mrp', displayName: 'Maximum Retail Price (MRP)', detectedValue: '₹ 349 (Incl. all taxes)', status: 'detected', confidence: 0.97 },
    { id: '6', fieldName: 'manufacture_date', displayName: 'Date of Manufacture / Packing', detectedValue: 'Mfg: Aug 2026', status: 'detected', confidence: 0.94 },
    { id: '7', fieldName: 'consumer_care', displayName: 'Consumer Care Details', detectedValue: 'Not clearly legible on scanned label', status: 'needs_review', confidence: 0.45 },
    { id: '8', fieldName: 'country_of_origin', displayName: 'Country of Origin', detectedValue: 'India', status: 'detected', confidence: 0.96 },
    { id: '9', fieldName: 'importer_details', displayName: 'Importer Details', detectedValue: 'N/A (Domestic Product)', status: 'detected', confidence: 0.99 },
    { id: '10', fieldName: 'expiry_date', displayName: 'Best Before / Expiry Date', detectedValue: 'Best Before: 18 months from manufacture', status: 'detected', confidence: 0.88 },
  ],
  issues: [
    {
      id: 'iss-1',
      issueType: 'consumer_care_unclear',
      severity: 'medium',
      description: 'Consumer care contact information (name, address, and helpline of grievance officer) could not be identified with high confidence.',
      recommendation: 'Verify the physical packaging for mandatory consumer grievance contact details under Rule 6(1)(f) of the Legal Metrology (Packaged Commodities) Rules, 2011.',
      affectedField: 'consumer_care',
    },
  ],
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalysisResult>(SAMPLE_DEMO_RESULT)
  const [reportId, setReportId] = useState<string>('REP-' + Math.random().toString(36).substring(2, 8).toUpperCase())

  useEffect(() => {
    async function loadReport() {
      setLoading(true)
      try {
        if (id && id !== 'demo') {
          setReportId(`REP-${id.substring(0, 8).toUpperCase()}`)
          const scan = await getScanById(id)
          if (scan) {
            setData({
              productName: scan.productName,
              complianceScore: scan.complianceScore,
              status: scan.status,
              totalDeclarations: scan.totalDeclarations,
              passedDeclarations: scan.passedDeclarations,
              needsReviewCount: scan.results?.filter(r => r.status === 'needs_review').length || 0,
              missingCount: scan.results?.filter(r => r.status === 'missing').length || 0,
              analyzedAt: scan.createdAt,
              results: scan.results || [],
              issues: scan.issues || [],
            })
            setLoading(false)
            return
          }
        }

        // Check sessionStorage for latest scan
        if (typeof window !== 'undefined') {
          const stored = sessionStorage.getItem('labelcheck_result')
          if (stored) {
            const parsed = JSON.parse(stored)
            setData(parsed)
          }
        }
      } catch (err) {
        console.error('Error loading report:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReport()
  }, [id])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Report URL copied to clipboard')
    }
  }

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="min-h-screen pt-20 pb-16 bg-slate-50/60 print:pt-0 print:pb-0 print:bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Bar / Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900 w-fit">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
                <Share2 className="w-3.5 h-3.5 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print / Save PDF
              </Button>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold">
                <Link href="/scan" className="flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5" />
                  Scan Another Product
                </Link>
              </Button>
            </div>
          </div>

          {/* Printable Report Header */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    नेत्र Compliance Audit Report
                  </h1>
                  <p className="text-xs text-slate-400">
                    Legal Metrology (Packaged Commodities) Rules, 2011 Verification
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500">
                <p className="font-mono font-semibold text-slate-800">
                  Report ID: {reportId}
                </p>
                <p className="mt-0.5">
                  Generated: {new Date(data.analyzedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Score & Summary Card */}
            <ComplianceScoreCard
              score={data.complianceScore}
              status={data.status}
              totalDeclarations={data.totalDeclarations}
              passedCount={data.passedDeclarations}
              needsReviewCount={data.needsReviewCount}
              missingCount={data.missingCount}
              productName={data.productName}
              analyzedAt={data.analyzedAt}
            />

            {/* Findings & Issues */}
            <ComplianceIssuesList issues={data.issues} />

            {/* Checklist with Filters */}
            <ComplianceChecklist results={data.results} />

            {/* Declarations Full Breakdown Table */}
            <DeclarationsTable results={data.results} />

            {/* Official Disclaimer Footer in report */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-500 text-[11px] leading-relaxed">
              <p className="font-semibold text-slate-700">Legal Metrology Compliance Note:</p>
              <p className="mt-0.5">
                This verification audit is based on automatic label reading and comparison against the mandatory declaration requirements under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011. Results are intended for compliance readiness, internal auditing, and pre-distribution screening. Official legal verification requires physical examination by an authorized Legal Metrology Inspector.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  )
}
