'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ScanLine,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Scan, ScanStatus } from '@/types'
import { formatDate } from '@/lib/utils'

interface HistoryTableProps {
  initialScans: Scan[]
}

export function HistoryTable({ initialScans }: HistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ScanStatus>('all')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredAndSortedScans = useMemo(() => {
    return initialScans
      .filter((scan) => {
        const matchesSearch = scan.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchesStatus =
          statusFilter === 'all' || scan.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'date') {
          comp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortBy === 'score') {
          comp = b.complianceScore - a.complianceScore
        } else if (sortBy === 'name') {
          comp = a.productName.localeCompare(b.productName)
        }
        return sortOrder === 'desc' ? comp : -comp
      })
  }, [initialScans, searchQuery, statusFilter, sortBy, sortOrder])

  const toggleSort = (field: 'date' | 'score' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getStatusBadge = (status: ScanStatus) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Compliant
          </span>
        )
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Needs Review
          </span>
        )
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-red-50 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Non-Compliant
          </span>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="border-slate-200/80 shadow-2xs">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Audit &amp; Scan History
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Complete log of all scanned packaged commodities
            </CardDescription>
          </div>

          {/* Controls: Search & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              {(['all', 'compliant', 'needs_review', 'non_compliant'] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAndSortedScans.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No scans found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th
                    className="pb-3 font-semibold cursor-pointer hover:text-slate-700"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Product Name
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer hover:text-slate-700"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="pb-3 font-semibold cursor-pointer hover:text-slate-700"
                    onClick={() => toggleSort('score')}
                  >
                    <div className="flex items-center gap-1">
                      Compliance Score
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Issues</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedScans.map((scan) => (
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
                    <td className="py-3.5 pr-4">
                      {scan.issueCount > 0 ? (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {scan.issueCount} Flagged
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          None
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                      >
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
