/**
 * Supabase persistence service for scans and results.
 * Provides clean CRUD operations with proper error handling.
 */

import { createClient } from '@/lib/supabase/client'
import { AnalysisResult, Scan } from '@/types'

export async function saveScan(
  analysisResult: AnalysisResult,
  imageUrl: string | null,
  userId: string
): Promise<string | null> {
  const supabase = createClient()

  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .insert({
      user_id: userId,
      product_name: analysisResult.productName,
      image_url: imageUrl,
      compliance_score: analysisResult.complianceScore,
      status: analysisResult.status,
      total_declarations: analysisResult.totalDeclarations,
      passed_declarations: analysisResult.passedDeclarations,
      issue_count: analysisResult.issues.length,
    })
    .select('id')
    .single()

  if (scanError || !scan) {
    console.error('Error saving scan:', scanError)
    return null
  }

  // Save individual results
  if (analysisResult.results.length > 0) {
    await supabase.from('scan_results').insert(
      analysisResult.results.map(r => ({
        scan_id: scan.id,
        field_name: r.fieldName,
        detected_value: r.detectedValue,
        status: r.status,
        confidence: r.confidence,
      }))
    )
  }

  // Save issues
  if (analysisResult.issues.length > 0) {
    await supabase.from('compliance_issues').insert(
      analysisResult.issues.map(i => ({
        scan_id: scan.id,
        issue_type: i.issueType,
        severity: i.severity,
        description: i.description,
        recommendation: i.recommendation,
      }))
    )
  }

  return scan.id
}

export async function getScans(userId: string): Promise<Scan[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching scans:', error)
    return []
  }

  return (data || []).map(row => ({
    id: row.id,
    userId: row.user_id,
    productName: row.product_name,
    imageUrl: row.image_url,
    complianceScore: row.compliance_score,
    status: row.status,
    totalDeclarations: row.total_declarations,
    passedDeclarations: row.passed_declarations,
    issueCount: row.issue_count,
    createdAt: row.created_at,
  }))
}

export async function getScanById(scanId: string): Promise<Scan | null> {
  const supabase = createClient()

  const { data: scanData, error: scanError } = await supabase
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .single()

  if (scanError || !scanData) return null

  const { data: resultsData } = await supabase
    .from('scan_results')
    .select('*')
    .eq('scan_id', scanId)

  const { data: issuesData } = await supabase
    .from('compliance_issues')
    .select('*')
    .eq('scan_id', scanId)

  return {
    id: scanData.id,
    userId: scanData.user_id,
    productName: scanData.product_name,
    imageUrl: scanData.image_url,
    complianceScore: scanData.compliance_score,
    status: scanData.status,
    totalDeclarations: scanData.total_declarations,
    passedDeclarations: scanData.passed_declarations,
    issueCount: scanData.issue_count,
    createdAt: scanData.created_at,
    results: (resultsData || []).map(r => ({
      id: r.id,
      fieldName: r.field_name,
      displayName: r.field_name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      detectedValue: r.detected_value,
      status: r.status,
      confidence: r.confidence,
    })),
    issues: (issuesData || []).map(i => ({
      id: i.id,
      issueType: i.issue_type,
      severity: i.severity,
      description: i.description,
      recommendation: i.recommendation,
    })),
  }
}

export async function getDashboardStats(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('scans')
    .select('compliance_score, issue_count, status')
    .eq('user_id', userId)

  if (error || !data) return { totalScans: 0, avgComplianceScore: 0, totalIssues: 0 }

  const totalScans = data.length
  const avgComplianceScore = totalScans > 0
    ? Math.round(data.reduce((sum, s) => sum + s.compliance_score, 0) / totalScans)
    : 0
  const totalIssues = data.reduce((sum, s) => sum + s.issue_count, 0)

  return { totalScans, avgComplianceScore, totalIssues }
}

export async function uploadImage(file: File, userId: string): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('product-images').upload(path, file)
  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}
