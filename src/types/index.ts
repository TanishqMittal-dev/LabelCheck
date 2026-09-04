export type ComplianceStatus = 'detected' | 'needs_review' | 'missing'
export type ScanStatus = 'compliant' | 'needs_review' | 'non_compliant'
export type IssueSeverity = 'high' | 'medium' | 'low'
export type MandatoryCheckStatus = 'detected' | 'unable_to_verify' | 'possible_violation'

export interface MandatoryDeclarationRule {
  ruleId: string
  declarationName: string
  fieldName: string
  regulatoryFramework: 'Legal Metrology' | 'FSSAI' | 'E-Commerce / Consumer Protection' | 'Sectoral'
  category: 'all' | 'food_beverages' | 'edible_oils' | 'cosmetics_personal_care' | 'general_packaged' | 'imported_goods'
  requirement: string
  legalReference: string
  ruleVersion: string
  effectiveDate: string
  validationMethod: 'ocr_presence' | 'regex_format' | 'multi_field' | 'contextual' | 'unit_sale_price'
  applicability: string
  exceptions?: string[]
  standardPanelLocation: 'front_or_any' | 'principal_display_panel' | 'back_or_side_panel'
}

export interface MandatoryDeclarationCheckResult {
  ruleId: string
  ruleVersion: string
  declarationName: string
  fieldName: string
  regulatoryFramework: string
  status: MandatoryCheckStatus
  detectedValue: string | null
  confidence: number
  reason: string
  panelNote?: string
  evidenceReference?: string
  legalReference: string
  requirement: string
  applicability: string
}

export interface ImageCoverageInfo {
  imageCount: number
  isMultiView: boolean
  coverageQuality: 'single_panel' | 'multi_panel'
}

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
  productCategory?: string
  complianceScore: number
  status: ScanStatus
  totalDeclarations: number
  passedDeclarations: number
  needsReviewCount: number
  missingCount: number
  results: ScanResult[]
  issues: ComplianceIssue[]
  mandatoryDeclarationChecks?: MandatoryDeclarationCheckResult[]
  imageCoverage?: ImageCoverageInfo
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
