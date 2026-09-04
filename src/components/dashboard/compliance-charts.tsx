'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const TREND_DATA = [
  { month: 'Apr', score: 76, scans: 18 },
  { month: 'May', score: 81, scans: 24 },
  { month: 'Jun', score: 79, scans: 31 },
  { month: 'Jul', score: 85, scans: 40 },
  { month: 'Aug', score: 88, scans: 52 },
  { month: 'Sep', score: 84, scans: 65 },
]

const CATEGORY_ISSUES_DATA = [
  { category: 'MRP / Taxes', issues: 14, color: '#f59e0b' },
  { category: 'Consumer Care', issues: 22, color: '#ef4444' },
  { category: 'Mfg / Packing Date', issues: 9, color: '#3b82f6' },
  { category: 'Net Quantity', issues: 6, color: '#10b981' },
  { category: 'Address / Details', issues: 12, color: '#8b5cf6' },
]

export function ComplianceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trend Area Chart */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">
            Compliance Score Trend
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Average Legal Metrology compliance rate over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={TREND_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  domain={[50, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Avg Score']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Issues by Category Bar Chart */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">
            Issues Flagged by Declaration Type
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Frequency of non-compliance and review notices across categories
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CATEGORY_ISSUES_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [value, 'Flagged Declarations']}
                />
                <Bar dataKey="issues" radius={[6, 6, 0, 0]}>
                  {CATEGORY_ISSUES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
