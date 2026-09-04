import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ComplianceStatus, IssueSeverity, ScanStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusColor(status: ScanStatus): string {
  switch (status) {
    case 'compliant':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    case 'needs_review':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'non_compliant':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200'
  }
}

export function getStatusLabel(status: ScanStatus): string {
  switch (status) {
    case 'compliant':
      return 'Compliant'
    case 'needs_review':
      return 'Needs Review'
    case 'non_compliant':
      return 'Non-Compliant'
    default:
      return 'Unknown'
  }
}

export function getComplianceStatusColor(status: ComplianceStatus): string {
  switch (status) {
    case 'detected':
      return 'text-emerald-600'
    case 'needs_review':
      return 'text-amber-600'
    case 'missing':
      return 'text-red-600'
    default:
      return 'text-slate-600'
  }
}

export function getSeverityColor(severity: IssueSeverity): string {
  switch (severity) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200'
  }
}

export function getSeverityLabel(severity: IssueSeverity): string {
  switch (severity) {
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
    default:
      return severity
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase()
}
