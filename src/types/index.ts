export type ComplianceStatus = 'detected' | 'needs_review' | 'missing'
export type ScanStatus = 'compliant' | 'needs_review' | 'non_compliant'
export type IssueSeverity = 'high' | 'medium' | 'low'

export interface ScanResult {
  id: string
  fieldName: string
  displayName: string
  detectedValue: string | null
  status: ComplianceStatus
  confidence: number
  notes?: string
}

export interface ComplianceIssue {
  id: string
  issueType: string
  severity: IssueSeverity
  description: string
  recommendation: string
  affectedField?: string
}

export interface AnalysisResult {
  productName: string
  complianceScore: number
  status: ScanStatus
  totalDeclarations: number
  passedDeclarations: number
  needsReviewCount: number
  missingCount: number
  results: ScanResult[]
  issues: ComplianceIssue[]
  analyzedAt: string
}

export interface Scan {
  id: string
  userId: string
  productName: string
  imageUrl: string | null
  complianceScore: number
  status: ScanStatus
  totalDeclarations: number
  passedDeclarations: number
  issueCount: number
  createdAt: string
  results?: ScanResult[]
  issues?: ComplianceIssue[]
}

export interface Profile {
  id: string
  fullName: string | null
  email: string
  avatarUrl: string | null
  createdAt: string
}

export interface DashboardStats {
  totalScans: number
  avgComplianceScore: number
  totalIssues: number
  totalReports: number
}

export interface AnalysisStep {
  id: string
  label: string
  description: string
  duration: number
}
