'use client'

import Link from 'next/link'
import { ArrowRight, FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Scan } from '@/types'
import { formatDate } from '@/lib/utils'

interface RecentScansTableProps {
  scans: Scan[]
}

export function RecentScansTable({ scans }: RecentScansTableProps) {
  const getStatusBadge = (status: Scan['status']) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge variant="success" className="gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Compliant
          </Badge>
        )
      case 'needs_review':
        return (
          <Badge variant="warning" className="gap-1 font-semibold">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Needs Review
          </Badge>
        )
      case 'non_compliant':
        return (
          <Badge variant="destructive" className="gap-1 font-semibold">
            <XCircle className="w-3 h-3 text-red-600" />
            Non-Compliant
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="border-slate-200/80 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">
            Recent Scans &amp; Inspections
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Latest packaged commodity label analyses
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="text-xs border-slate-200">
          <Link href="/history" className="flex items-center gap-1">
            View All History
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No scans yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Start by uploading your first product label.
            </p>
            <Button size="sm" asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-xs">
              <Link href="/scan">Scan Product</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Product Name</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Compliance Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scans.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-medium text-slate-800 pr-4">
                      {scan.productName}
                    </td>
                    <td className="py-3.5 text-xs text-slate-500 pr-4">
                      {formatDate(scan.createdAt)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-xs ${
                            scan.complianceScore >= 80
                              ? 'text-emerald-600'
                              : scan.complianceScore >= 60
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {scan.complianceScore}%
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              scan.complianceScore >= 80
                                ? 'bg-emerald-500'
                                : scan.complianceScore >= 60
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${scan.complianceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">{getStatusBadge(scan.status)}</td>
                    <td className="py-3.5 text-right">
                      <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Link href={`/reports/${scan.id}`}>View Report</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
