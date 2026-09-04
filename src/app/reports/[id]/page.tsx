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
import { MandatoryDeclarationCheck } from '@/components/compliance/mandatory-declaration-check'
import { getScanById } from '@/services/scans'
import { detectProductCategory, evaluateMandatoryDeclarations } from '@/services/rule-engine'
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
            <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900 font-semibold w-fit">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="text-xs font-semibold border-slate-300">
                <Share2 className="w-3.5 h-3.5 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-semibold border-slate-300">
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print / Save PDF
              </Button>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-2xs">
                <Link href="/scan" className="flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5" />
                  Scan Another Product
                </Link>
              </Button>
            </div>
          </div>

          {/* Printable Report Header */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      नेत्र Statutory Compliance Audit Report
                    </h1>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                      Official Audit
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Legal Metrology (Packaged Commodities) Rules, 2011 Verification Certificate
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                <p className="font-mono font-bold text-slate-800">
                  Audit ID: {reportId}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
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

            {/* Mandatory Declaration Check (Rule Engine Verification) */}
            <MandatoryDeclarationCheck
              checks={
                data.mandatoryDeclarationChecks && data.mandatoryDeclarationChecks.length > 0
                  ? data.mandatoryDeclarationChecks
                  : evaluateMandatoryDeclarations(
                      data.results || [],
                      data.imageCoverage || { imageCount: 1, isMultiView: false, coverageQuality: 'single_panel' },
                      data.productCategory || detectProductCategory(data.productName, data.results || [])
                    )
              }
              productCategory={data.productCategory || detectProductCategory(data.productName, data.results || [])}
              imageCoverage={data.imageCoverage || { imageCount: 1, isMultiView: false, coverageQuality: 'single_panel' }}
              overallStatus={data.status}
            />

            {/* Findings & Issues */}
            <ComplianceIssuesList issues={data.issues} />

            {/* Checklist with Filters */}
            <ComplianceChecklist results={data.results} />

            {/* Declarations Full Breakdown Table */}
            <DeclarationsTable results={data.results} />

            {/* Official Disclaimer Footer in report */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-1">
              <p className="font-bold text-slate-800">Legal Metrology Compliance Disclaimer:</p>
              <p className="text-[11px] text-slate-500">
                This verification audit is generated by automatic optical analysis comparing extracted label text against mandatory statutory requirements under Rule 6 and Rule 6(11) of the Legal Metrology (Packaged Commodities) Rules, 2011. Results are intended for compliance readiness, manufacturing quality control, and pre-distribution screening. Official legal enforcement determinations require physical packaging examination by an authorized Legal Metrology Inspector.
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
