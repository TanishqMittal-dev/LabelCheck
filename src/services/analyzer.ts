/**
 * LabelCheck Analyzer Service
 *
 * This is the primary abstraction layer between the UI and the AI/OCR backend.
 *
 * CURRENT STATE: Returns mock data for demo purposes.
 *
 * TO CONNECT REAL OCR/AI:
 * 1. Replace the `mockAnalyze` function body with an actual API call
 * 2. For Gemini Vision: use @google/genai with gemini-3.7-flash model
 *    - Call `ai.models.generateContent({ model, contents: [{ parts: [imagePart, textPart] }] })`
 *    - Parse the structured JSON response
 * 3. For Google Cloud Vision OCR: call the Vision API then post-process with Gemini
 * 4. The return type `AnalysisResult` must remain unchanged for UI compatibility
 */

import { AnalysisResult, ScanResult, ComplianceIssue } from '@/types'
import { generateId } from '@/lib/utils'

// ─── Mock product datasets ────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
  {
    name: 'Fresh Harvest Basmati Rice',
    results: [
      { fieldName: 'product_name', displayName: 'Product Name', detectedValue: 'Fresh Harvest Basmati Rice (Extra Long Grain)', status: 'detected' as const, confidence: 0.98 },
      { fieldName: 'manufacturer_name', displayName: 'Manufacturer Name', detectedValue: 'Fresh Harvest Foods Pvt. Ltd.', status: 'detected' as const, confidence: 0.95 },
      { fieldName: 'manufacturer_address', displayName: 'Manufacturer Address', detectedValue: 'Plot 45, Industrial Area Phase II, Ludhiana, Punjab – 141003', status: 'detected' as const, confidence: 0.91 },
      { fieldName: 'net_quantity', displayName: 'Net Quantity', detectedValue: '5 Kg', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'mrp', displayName: 'Maximum Retail Price (MRP)', detectedValue: '₹ 349 (Incl. all taxes)', status: 'detected' as const, confidence: 0.97 },
      { fieldName: 'manufacture_date', displayName: 'Date of Manufacture / Packing', detectedValue: 'Mfg: Aug 2026', status: 'detected' as const, confidence: 0.94 },
      { fieldName: 'consumer_care', displayName: 'Consumer Care Details', detectedValue: 'Not clearly detected on visible label area', status: 'needs_review' as const, confidence: 0.42 },
      { fieldName: 'country_of_origin', displayName: 'Country of Origin', detectedValue: 'India', status: 'detected' as const, confidence: 0.96 },
      { fieldName: 'importer_details', displayName: 'Importer Details', detectedValue: 'N/A (Domestic Product)', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'expiry_date', displayName: 'Best Before / Expiry Date', detectedValue: 'Best Before: 18 months from manufacture', status: 'detected' as const, confidence: 0.88 },
    ],
    issues: [
      {
        issueType: 'consumer_care_unclear',
        severity: 'medium' as const,
        description: 'Consumer care information (name, address, and telephone number of grievance officer) could not be clearly identified on the visible label.',
        recommendation: 'Verify the original package for consumer care/grievance contact details as required under Rule 6(1)(f) of Legal Metrology (Packaged Commodities) Rules, 2011.',
        affectedField: 'consumer_care',
      },
    ],
  },
  {
    name: 'SunPure Refined Sunflower Oil',
    results: [
      { fieldName: 'product_name', displayName: 'Product Name', detectedValue: 'SunPure Refined Sunflower Oil', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'manufacturer_name', displayName: 'Manufacturer Name', detectedValue: 'SunPure Agro Industries Ltd.', status: 'detected' as const, confidence: 0.97 },
      { fieldName: 'manufacturer_address', displayName: 'Manufacturer Address', detectedValue: 'Survey No. 102, MIDC Satpur, Nashik, Maharashtra – 422 007', status: 'detected' as const, confidence: 0.93 },
      { fieldName: 'net_quantity', displayName: 'Net Quantity', detectedValue: '1 Litre', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'mrp', displayName: 'Maximum Retail Price (MRP)', detectedValue: '₹ 178 (Incl. all taxes)', status: 'detected' as const, confidence: 0.98 },
      { fieldName: 'manufacture_date', displayName: 'Date of Manufacture / Packing', detectedValue: 'Mfg: Sep 2026', status: 'detected' as const, confidence: 0.96 },
      { fieldName: 'consumer_care', displayName: 'Consumer Care Details', detectedValue: 'Consumer Care: 1800-XXX-XXXX | care@sunpure.in', status: 'detected' as const, confidence: 0.89 },
      { fieldName: 'country_of_origin', displayName: 'Country of Origin', detectedValue: 'India', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'importer_details', displayName: 'Importer Details', detectedValue: 'N/A (Domestic Product)', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'expiry_date', displayName: 'Best Before / Expiry Date', detectedValue: 'Not detected — may be missing', status: 'missing' as const, confidence: 0.15 },
    ],
    issues: [
      {
        issueType: 'expiry_date_missing',
        severity: 'high' as const,
        description: 'Best before or expiry date declaration could not be detected on the label. This is a required declaration for edible oil products.',
        recommendation: 'Verify that the best before date is clearly printed on the package. Ensure compliance with applicable date marking requirements under Legal Metrology rules.',
        affectedField: 'expiry_date',
      },
    ],
  },
  {
    name: 'DailyFresh Whole Wheat Flour',
    results: [
      { fieldName: 'product_name', displayName: 'Product Name', detectedValue: 'DailyFresh Whole Wheat Atta (Chakki Fresh)', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'manufacturer_name', displayName: 'Manufacturer Name', detectedValue: 'DailyFresh Mills Pvt. Ltd.', status: 'detected' as const, confidence: 0.96 },
      { fieldName: 'manufacturer_address', displayName: 'Manufacturer Address', detectedValue: 'Not clearly legible in provided image', status: 'needs_review' as const, confidence: 0.38 },
      { fieldName: 'net_quantity', displayName: 'Net Quantity', detectedValue: '2 Kg', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'mrp', displayName: 'Maximum Retail Price (MRP)', detectedValue: '₹ 85', status: 'needs_review' as const, confidence: 0.61 },
      { fieldName: 'manufacture_date', displayName: 'Date of Manufacture / Packing', detectedValue: 'Mfg: Jul 2026', status: 'detected' as const, confidence: 0.93 },
      { fieldName: 'consumer_care', displayName: 'Consumer Care Details', detectedValue: 'Not detected', status: 'missing' as const, confidence: 0.1 },
      { fieldName: 'country_of_origin', displayName: 'Country of Origin', detectedValue: 'India', status: 'detected' as const, confidence: 0.98 },
      { fieldName: 'importer_details', displayName: 'Importer Details', detectedValue: 'N/A (Domestic Product)', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'expiry_date', displayName: 'Best Before / Expiry Date', detectedValue: 'Best Before: 3 months from packing', status: 'detected' as const, confidence: 0.91 },
    ],
    issues: [
      {
        issueType: 'manufacturer_address_unclear',
        severity: 'high' as const,
        description: 'Manufacturer address could not be clearly extracted from the image. The address text may be too small or partially obscured.',
        recommendation: 'Verify that the complete manufacturer address including city, state and PIN code is clearly printed on the package as required under Rule 6(1)(b).',
        affectedField: 'manufacturer_address',
      },
      {
        issueType: 'mrp_incomplete',
        severity: 'medium' as const,
        description: 'MRP declaration detected but may be missing the mandatory "inclusive of all taxes" suffix.',
        recommendation: 'Ensure MRP is declared as "MRP ₹XX (Incl. of all taxes)" or equivalent as required under Rule 6(1)(d).',
        affectedField: 'mrp',
      },
      {
        issueType: 'consumer_care_missing',
        severity: 'high' as const,
        description: 'Consumer care details (name, address, and contact of grievance officer) were not detected on the label.',
        recommendation: 'Consumer care information is mandatory under Rule 6(1)(f). Ensure it is clearly printed on the package.',
        affectedField: 'consumer_care',
      },
    ],
  },
  {
    name: 'NatureDrop Organic Honey',
    results: [
      { fieldName: 'product_name', displayName: 'Product Name', detectedValue: 'NatureDrop 100% Pure Organic Honey', status: 'detected' as const, confidence: 0.98 },
      { fieldName: 'manufacturer_name', displayName: 'Manufacturer Name', detectedValue: 'NatureDrop Organics Pvt. Ltd.', status: 'detected' as const, confidence: 0.97 },
      { fieldName: 'manufacturer_address', displayName: 'Manufacturer Address', detectedValue: 'Organic Farm Hub, Sector 18, Noida, Uttar Pradesh – 201301', status: 'detected' as const, confidence: 0.92 },
      { fieldName: 'net_quantity', displayName: 'Net Quantity', detectedValue: '500 g', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'mrp', displayName: 'Maximum Retail Price (MRP)', detectedValue: '₹ 299 (Incl. all taxes)', status: 'detected' as const, confidence: 0.98 },
      { fieldName: 'manufacture_date', displayName: 'Date of Manufacture / Packing', detectedValue: 'Mfg: Aug 2026', status: 'detected' as const, confidence: 0.95 },
      { fieldName: 'consumer_care', displayName: 'Consumer Care Details', detectedValue: 'Toll Free: 1800-XXX-0000 | natureddrop.in/care', status: 'detected' as const, confidence: 0.93 },
      { fieldName: 'country_of_origin', displayName: 'Country of Origin', detectedValue: 'India', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'importer_details', displayName: 'Importer Details', detectedValue: 'N/A (Domestic Product)', status: 'detected' as const, confidence: 0.99 },
      { fieldName: 'expiry_date', displayName: 'Best Before / Expiry Date', detectedValue: 'Best Before: 2 years from manufacture', status: 'detected' as const, confidence: 0.97 },
    ],
    issues: [],
  },
]

// ─── Score calculation ────────────────────────────────────────────────────────

function calculateScore(results: ScanResult[]): number {
  const weights = { detected: 1, needs_review: 0.5, missing: 0 }
  const total = results.length
  if (total === 0) return 0
  const earned = results.reduce((sum, r) => sum + weights[r.status], 0)
  return Math.round((earned / total) * 100)
}

function determineStatus(score: number, issues: ComplianceIssue[]): 'compliant' | 'needs_review' | 'non_compliant' {
  const hasHighSeverity = issues.some(i => i.severity === 'high')
  if (score >= 90 && !hasHighSeverity) return 'compliant'
  if (score >= 65 && !hasHighSeverity) return 'needs_review'
  if (score >= 65) return 'needs_review'
  return 'non_compliant'
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * analyzeProduct
 *
 * Analyzes a product image for Legal Metrology compliance.
 *
 * @param imageFile - The uploaded image file (available for future real OCR integration)
 * @param imageUrl  - Supabase storage URL after upload (can be passed to Vision API)
 * @returns         - Structured AnalysisResult with declarations and issues
 *
 * FUTURE INTEGRATION POINT:
 * Replace the mock logic below with:
 *   const response = await ai.models.generateContent({
 *     model: 'gemini-3.7-flash',
 *     contents: [{ parts: [{ inlineData: { mimeType, data: base64Image } }, { text: COMPLIANCE_PROMPT }] }]
 *   })
 *   return parseGeminiResponse(response.text)
 */
export async function analyzeProduct(
  _imageFile: File | null,
  _imageUrl?: string
): Promise<AnalysisResult> {
  // Simulate network/processing delay
  await new Promise(resolve => setTimeout(resolve, 100))

  // Pick a random mock product
  const mockProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)]

  const results: ScanResult[] = mockProduct.results.map(r => ({
    ...r,
    id: generateId(),
  }))

  const issues: ComplianceIssue[] = mockProduct.issues.map(i => ({
    ...i,
    id: generateId(),
  }))

  const complianceScore = calculateScore(results)
  const status = determineStatus(complianceScore, issues)

  return {
    productName: mockProduct.name,
    complianceScore,
    status,
    totalDeclarations: results.length,
    passedDeclarations: results.filter(r => r.status === 'detected').length,
    needsReviewCount: results.filter(r => r.status === 'needs_review').length,
    missingCount: results.filter(r => r.status === 'missing').length,
    results,
    issues,
    analyzedAt: new Date().toISOString(),
  }
}

/**
 * COMPLIANCE_PROMPT - Template for future Gemini Vision integration
 *
 * When connecting real AI, send this prompt along with the product image:
 */
export const COMPLIANCE_PROMPT = `
You are a Legal Metrology compliance expert. Analyze this product label image and extract 
the following mandatory declarations as per Legal Metrology (Packaged Commodities) Rules, 2011:

1. Product Name (Rule 6(1)(a))
2. Manufacturer/Packer Name (Rule 6(1)(b))
3. Manufacturer/Packer Address (Rule 6(1)(b))
4. Net Quantity with unit (Rule 6(1)(c))
5. Maximum Retail Price - MRP inclusive of all taxes (Rule 6(1)(d))
6. Month and Year of Manufacture/Packing (Rule 6(1)(e))
7. Consumer Care contact details (Rule 6(1)(f))
8. Country of Origin (if applicable)
9. Importer details (if imported product)
10. Best Before / Expiry Date (if applicable)

Return a JSON object with this structure:
{
  "productName": "detected product name",
  "declarations": [
    {
      "fieldName": "field_id",
      "detectedValue": "extracted text or null",
      "status": "detected|needs_review|missing",
      "confidence": 0.0-1.0
    }
  ]
}

Be conservative — if text is present but unclear, use "needs_review". Only use "detected" when clearly readable.
`
