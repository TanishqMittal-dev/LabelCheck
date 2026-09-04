import { MandatoryDeclarationRule, MandatoryDeclarationCheckResult, ScanResult, ImageCoverageInfo, ScanStatus } from '@/types'

/**
 * Statutory Compliance Rule Definitions
 *
 * Distinct Regulatory Frameworks:
 * 1. Legal Metrology: The Legal Metrology (Packaged Commodities) Rules, 2011 (as amended up to G.S.R. 779(E))
 * 2. FSSAI: Food Safety and Standards (Labelling and Display) Regulations, 2020
 */
export const MANDATORY_DECLARATION_RULES: MandatoryDeclarationRule[] = [
  {
    ruleId: 'LMR-2011-R6-1-A',
    declarationName: 'Product Name / Generic Identity',
    fieldName: 'product_name',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Common or generic name of the commodity must be declared on the principal display panel.',
    legalReference: 'Rule 6(1)(a)',
    ruleVersion: '2011.amended.2017',
    effectiveDate: '2011-11-01',
    validationMethod: 'ocr_presence',
    applicability: 'Mandatory for all pre-packaged commodities.',
    exceptions: ['Exempt only where commodity is clearly identifiable through transparent packaging.'],
    standardPanelLocation: 'principal_display_panel',
  },
  {
    ruleId: 'LMR-2011-R6-1-B',
    declarationName: 'Manufacturer / Packer Name',
    fieldName: 'manufacturer_name',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Name of the manufacturer or packer must be declared on every package.',
    legalReference: 'Rule 6(1)(a) & Rule 10',
    ruleVersion: '2011.amended.2017',
    effectiveDate: '2011-11-01',
    validationMethod: 'multi_field',
    applicability: 'Mandatory for all pre-packaged commodities.',
    exceptions: ['If manufacturer and packer are the same entity, a single declaration suffices.'],
    standardPanelLocation: 'back_or_side_panel',
  },
  {
    ruleId: 'LMR-2011-R6-1-B-ADDR',
    declarationName: 'Manufacturer / Packer Complete Address',
    fieldName: 'manufacturer_address',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Complete postal address with premise, city, state, and PIN code of manufacturer/packer.',
    legalReference: 'Rule 6(1)(a) & Rule 10',
    ruleVersion: '2011.amended.2017',
    effectiveDate: '2011-11-01',
    validationMethod: 'ocr_presence',
    applicability: 'Mandatory for all pre-packaged commodities.',
    standardPanelLocation: 'back_or_side_panel',
  },
  {
    ruleId: 'LMR-2011-R6-1-C',
    declarationName: 'Net Quantity',
    fieldName: 'net_quantity',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Net quantity in standard metric unit of weight (g, kg), volume (ml, L) or number (N).',
    legalReference: 'Rule 6(1)(b) & Rules 11-14',
    ruleVersion: '2011.amended.2021',
    effectiveDate: '2011-11-01',
    validationMethod: 'regex_format',
    applicability: 'Mandatory on the principal display panel.',
    exceptions: ['Packages with net weight <= 10g or volume <= 10ml exempt under Rule 26(a).'],
    standardPanelLocation: 'principal_display_panel',
  },
  {
    ruleId: 'LMR-2011-R6-1-D',
    declarationName: 'Maximum Retail Price (MRP)',
    fieldName: 'mrp',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Maximum Retail Price with mandatory suffix "inclusive of all taxes" or "incl. of all taxes".',
    legalReference: 'Rule 6(1)(e)',
    ruleVersion: '2021.amendment (G.S.R. 779(E))',
    effectiveDate: '2022-12-01',
    validationMethod: 'regex_format',
    applicability: 'Mandatory on all retail packages sold to consumers in India.',
    exceptions: ['Exempt for institutional/industrial consumer packages not intended for retail sale (Rule 3/Rule 26).'],
    standardPanelLocation: 'front_or_any',
  },
  {
    ruleId: 'LMR-2011-R6-11-USP',
    declarationName: 'Unit Sale Price (USP)',
    fieldName: 'unit_sale_price',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Unit Sale Price in Rupees declared per g/kg (for weight), per ml/L (for volume), or per number/piece (for count).',
    legalReference: 'Rule 6(11) & Rule 6(1)(e) Proviso',
    ruleVersion: '2021.amendment (G.S.R. 779(E))',
    effectiveDate: '2022-12-01',
    validationMethod: 'unit_sale_price',
    applicability: 'Mandatory for all pre-packaged commodities containing retail items (w.e.f. 01.12.2022).',
    exceptions: ['Where net quantity is exactly 1 unit (1g, 1kg, 1ml, 1L, or 1N), separate USP declaration is not required if MRP is clear.'],
    standardPanelLocation: 'front_or_any',
  },
  {
    ruleId: 'LMR-2011-R6-1-E',
    declarationName: 'Date of Manufacture / Pre-packing',
    fieldName: 'manufacture_date',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Month and year in which commodity is manufactured, pre-packed, or imported.',
    legalReference: 'Rule 6(1)(d)',
    ruleVersion: '2021.amendment (G.S.R. 779(E))',
    effectiveDate: '2022-12-01',
    validationMethod: 'regex_format',
    applicability: 'Mandatory for all pre-packaged commodities.',
    standardPanelLocation: 'back_or_side_panel',
  },
  {
    ruleId: 'LMR-2011-R6-1-F',
    declarationName: 'Consumer Care / Grievance Details',
    fieldName: 'consumer_care',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Name, address, telephone number, and email address of grievance redressal officer.',
    legalReference: 'Rule 6(1)(g)',
    ruleVersion: '2017.amendment (G.S.R. 629(E))',
    effectiveDate: '2018-01-01',
    validationMethod: 'multi_field',
    applicability: 'Mandatory on all retail consumer pre-packaged goods.',
    standardPanelLocation: 'back_or_side_panel',
  },
  {
    ruleId: 'LMR-2011-R6-1-G',
    declarationName: 'Country of Origin',
    fieldName: 'country_of_origin',
    regulatoryFramework: 'Legal Metrology',
    category: 'all',
    requirement: 'Country of origin or manufacture must be declared on pre-packaged goods.',
    legalReference: 'Rule 6(1)(a) proviso / DCA Advisory',
    ruleVersion: '2020.advisory',
    effectiveDate: '2020-07-01',
    validationMethod: 'contextual',
    applicability: 'Mandatory on imported goods; standard on domestic pre-packaged goods.',
    exceptions: ['Domestic products with complete Indian manufacturing address are compliant with domestic origin norms.'],
    standardPanelLocation: 'front_or_any',
  },
  {
    ruleId: 'LMR-2011-R6-1-H',
    declarationName: 'Importer Name & Address',
    fieldName: 'importer_details',
    regulatoryFramework: 'Legal Metrology',
    category: 'imported_goods',
    requirement: 'Name and complete address of the importer must be declared for imported products.',
    legalReference: 'Rule 6(1)(a)',
    ruleVersion: '2011.principal',
    effectiveDate: '2011-11-01',
    validationMethod: 'ocr_presence',
    applicability: 'Conditional: Mandatory strictly when product is imported into India.',
    exceptions: ['Exempt for domestic goods manufactured and packed in India.'],
    standardPanelLocation: 'back_or_side_panel',
  },
  {
    ruleId: 'FSSAI-FSS-L&D-2020-R5-3',
    declarationName: 'Best Before / Expiry Date',
    fieldName: 'expiry_date',
    regulatoryFramework: 'FSSAI',
    category: 'food_beverages',
    requirement: 'Best before or expiry date declaration required under Food Safety and Standards regulations.',
    legalReference: 'FSS (Labelling and Display) Regulations, 2020 - Reg 5(3)',
    ruleVersion: 'FSSAI 2020',
    effectiveDate: '2020-11-17',
    validationMethod: 'ocr_presence',
    applicability: 'Sector-specific: Mandatory for food, edible oils, beverages, and perishable commodities.',
    exceptions: ['Non-perishable hardware, engineering goods, and durable items are not subject to food expiry rules.'],
    standardPanelLocation: 'back_or_side_panel',
  },
]

/**
 * Product Category Detector based on product name and extracted characteristics
 */
export function detectProductCategory(productName: string, declarations: ScanResult[]): string {
  const name = (productName || '').toLowerCase()
  const detectedText = declarations.map(d => (d.detectedValue || '').toLowerCase()).join(' ')

  if (
    /oil|ghee|vanaspati|sunflower|mustard|groundnut|olive oil|coconut oil/i.test(name) ||
    /edible oil|vegetable oil/i.test(detectedText)
  ) {
    return 'Edible Oils & Fats'
  }

  if (
    /rice|atta|flour|wheat|dal|pulse|grain|honey|spice|masala|tea|coffee|sugar|salt|biscuit|snack|cereal|noodle|pasta|juice|beverage|milk|paneer|food/i.test(name) ||
    /fssai|ingredients|nutrition|food/i.test(detectedText)
  ) {
    return 'Food & Agricultural Commodities'
  }

  if (
    /soap|shampoo|lotion|cream|cosmetic|toothpaste|facewash|perfume|deodorant|serum|hair/i.test(name) ||
    /cosmetic|dermatological/i.test(detectedText)
  ) {
    return 'Cosmetics & Personal Care'
  }

  const isImported = declarations.some(
    d => (d.fieldName === 'country_of_origin' && d.detectedValue && !/india/i.test(d.detectedValue)) ||
         (d.fieldName === 'importer_details' && d.detectedValue && !/n\/a|domestic/i.test(d.detectedValue))
  )

  if (isImported) {
    return 'Imported Packaged Commodities'
  }

  return 'General Packaged Commodities'
}

/**
 * Checks for Unit Sale Price (USP) under Rule 6(11)
 */
function evaluateUnitSalePrice(
  results: ScanResult[],
  isMultiPanel: boolean
): { status: 'detected' | 'unable_to_verify' | 'possible_violation'; detectedValue: string | null; confidence: number; reason: string } {
  const mrpResult = results.find(r => r.fieldName === 'mrp')
  const netQtyResult = results.find(r => r.fieldName === 'net_quantity')
  const mrpText = mrpResult?.detectedValue || ''
  const netQtyText = netQtyResult?.detectedValue || ''

  // Look for Unit Sale Price patterns (e.g. ₹ 69.80/kg, Rs. 0.35/g, ₹ 1.78/ml, per g, per kg, per piece)
  const uspPattern = /(?:(?:usp|unit\s*(?:sale\s*)?price|unit\s*cost)[:\s]*[₹Rs.\s]*\d+(?:\.\d{1,2})?\s*\/\s*(?:kg|g|gm|l|ltr|litre|ml|n|unit|piece|pc|item)|[₹Rs.]\s*\d+(?:\.\d{1,2})?\s*\/\s*(?:kg|g|gm|l|ltr|litre|ml|n|unit|piece|pc|item)|per\s*(?:kg|g|gm|l|ltr|litre|ml|n|unit|piece))/i
  const hasUspMatch = uspPattern.test(mrpText)

  if (hasUspMatch) {
    const match = mrpText.match(uspPattern)
    return {
      status: 'detected',
      detectedValue: match ? match[0] : mrpText,
      confidence: mrpResult?.confidence ?? 0.9,
      reason: 'Unit Sale Price declared with standard statutory unit format as per Rule 6(11).',
    }
  }

  // Check if Net Quantity is exactly 1 unit (e.g., 1 Kg, 1 L, 1 N) where separate USP is exempt
  if (/^1\s*(?:kg|l|litre|n|unit|piece|pc)$/i.test(netQtyText.trim())) {
    return {
      status: 'detected',
      detectedValue: `Exempt (Net Quantity is 1 unit: ${netQtyText})`,
      confidence: 0.95,
      reason: 'Separate Unit Sale Price is not mandatory when net quantity is exactly 1 standard unit (1 kg / 1 L / 1 N).',
    }
  }

  // If single panel view and USP not on front label
  if (!isMultiPanel) {
    return {
      status: 'unable_to_verify',
      detectedValue: null,
      confidence: 0.5,
      reason: 'Unit Sale Price not detected on visible label. Additional package panels not provided.',
    }
  }

  // Multi-panel view provided and no USP found for package > 1 unit
  return {
    status: 'possible_violation',
    detectedValue: null,
    confidence: 0.85,
    reason: 'Unit Sale Price is mandatory under Rule 6(11) (effective 01.12.2022) but was not detected alongside MRP.',
  }
}

/**
 * Evaluates mandatory declarations against the Legal Metrology and Sectoral rule engines.
 */
export function evaluateMandatoryDeclarations(
  results: ScanResult[],
  imageCoverage: ImageCoverageInfo,
  productCategory: string
): MandatoryDeclarationCheckResult[] {
  const isMultiPanel = imageCoverage.coverageQuality === 'multi_panel' || imageCoverage.imageCount > 1
  const isFoodCategory = productCategory === 'Food & Agricultural Commodities' || productCategory === 'Edible Oils & Fats'
  
  // Determine if product is confirmed imported vs domestic
  const originResult = results.find(r => r.fieldName === 'country_of_origin')
  const importerResult = results.find(r => r.fieldName === 'importer_details')
  const manufacturerAddr = results.find(r => r.fieldName === 'manufacturer_address')?.detectedValue || ''
  
  const hasIndiaAddress = /india|punjab|maharashtra|uttar pradesh|delhi|gujarat|karnataka|tamil nadu|haryana|mumbai|bengaluru/i.test(manufacturerAddr)
  const isConfirmedImported = (originResult?.detectedValue && !/india/i.test(originResult.detectedValue)) ||
                              (importerResult?.detectedValue && !/n\/a|domestic/i.test(importerResult.detectedValue))

  return MANDATORY_DECLARATION_RULES.filter(rule => {
    // Sector-specific rule filter (e.g. FSSAI best before applies to Food & Edible Oils)
    if (rule.regulatoryFramework === 'FSSAI' && !isFoodCategory) {
      return false
    }

    // Importer details only apply when imported status is indicated
    if (rule.fieldName === 'importer_details' && !isConfirmedImported && hasIndiaAddress) {
      return false
    }

    return true
  }).map(rule => {
    // 1. Special Handling: Unit Sale Price under Rule 6(11)
    if (rule.validationMethod === 'unit_sale_price') {
      const uspEval = evaluateUnitSalePrice(results, isMultiPanel)
      return {
        ruleId: rule.ruleId,
        ruleVersion: rule.ruleVersion,
        declarationName: rule.declarationName,
        fieldName: rule.fieldName,
        regulatoryFramework: rule.regulatoryFramework,
        status: uspEval.status,
        detectedValue: uspEval.detectedValue,
        confidence: uspEval.confidence,
        reason: uspEval.reason,
        panelNote: 'Adjacent to MRP declaration',
        legalReference: rule.legalReference,
        requirement: rule.requirement,
        applicability: rule.applicability,
      }
    }

    // 2. Special Handling: Country of Origin (Conditional / Non-punitive for Domestic)
    if (rule.fieldName === 'country_of_origin') {
      const scanResult = results.find(r => r.fieldName === 'country_of_origin')
      const detectedValue = scanResult?.detectedValue || null
      const confidence = scanResult?.confidence ?? 0

      if (scanResult?.status === 'detected' && detectedValue) {
        return {
          ruleId: rule.ruleId,
          ruleVersion: rule.ruleVersion,
          declarationName: rule.declarationName,
          fieldName: rule.fieldName,
          regulatoryFramework: rule.regulatoryFramework,
          status: 'detected',
          detectedValue,
          confidence,
          reason: `Country of Origin declared as "${detectedValue}".`,
          panelNote: 'Package Panel',
          legalReference: rule.legalReference,
          requirement: rule.requirement,
          applicability: rule.applicability,
        }
      }

      if (hasIndiaAddress) {
        return {
          ruleId: rule.ruleId,
          ruleVersion: rule.ruleVersion,
          declarationName: rule.declarationName,
          fieldName: rule.fieldName,
          regulatoryFramework: rule.regulatoryFramework,
          status: 'detected',
          detectedValue: 'India (Inferred from domestic manufacturer address)',
          confidence: 0.88,
          reason: 'Domestic Indian manufacturing origin verified from manufacturer registration address.',
          panelNote: 'Inferred from Rule 10 address',
          legalReference: rule.legalReference,
          requirement: rule.requirement,
          applicability: rule.applicability,
        }
      }

      if (!isMultiPanel) {
        return {
          ruleId: rule.ruleId,
          ruleVersion: rule.ruleVersion,
          declarationName: rule.declarationName,
          fieldName: rule.fieldName,
          regulatoryFramework: rule.regulatoryFramework,
          status: 'unable_to_verify',
          detectedValue: null,
          confidence: 0.4,
          reason: 'Country of origin not clearly detected in provided single view. Domestic/Import origin requires full verification.',
          panelNote: 'Additional panel needed',
          legalReference: rule.legalReference,
          requirement: rule.requirement,
          applicability: rule.applicability,
        }
      }

      return {
        ruleId: rule.ruleId,
        ruleVersion: rule.ruleVersion,
        declarationName: rule.declarationName,
        fieldName: rule.fieldName,
        regulatoryFramework: rule.regulatoryFramework,
        status: isConfirmedImported ? 'possible_violation' : 'unable_to_verify',
        detectedValue: null,
        confidence: 0.7,
        reason: isConfirmedImported
          ? 'Mandatory country of origin declaration was not detected on imported commodity.'
          : 'Country of origin text not explicitly stated on package.',
        panelNote: 'Checked across provided views',
        legalReference: rule.legalReference,
        requirement: rule.requirement,
        applicability: rule.applicability,
      }
    }

    // Standard Declaration Evaluation
    const scanResult = results.find(r => r.fieldName === rule.fieldName)
    const detectedValue = scanResult?.detectedValue || null
    const confidence = scanResult?.confidence ?? 0
    const status = scanResult?.status || 'missing'

    // Status 1: DETECTED
    if (status === 'detected' && detectedValue && detectedValue.trim() !== '') {
      return {
        ruleId: rule.ruleId,
        ruleVersion: rule.ruleVersion,
        declarationName: rule.declarationName,
        fieldName: rule.fieldName,
        regulatoryFramework: rule.regulatoryFramework,
        status: 'detected',
        detectedValue,
        confidence,
        reason: `Statutory declaration extracted with ${(confidence * 100).toFixed(0)}% confidence under ${rule.regulatoryFramework}.`,
        panelNote: rule.standardPanelLocation === 'principal_display_panel' ? 'Principal Display Panel' : 'Package Panel',
        legalReference: rule.legalReference,
        requirement: rule.requirement,
        applicability: rule.applicability,
      }
    }

    // Status 2: UNABLE TO VERIFY
    if (status === 'needs_review') {
      return {
        ruleId: rule.ruleId,
        ruleVersion: rule.ruleVersion,
        declarationName: rule.declarationName,
        fieldName: rule.fieldName,
        regulatoryFramework: rule.regulatoryFramework,
        status: 'unable_to_verify',
        detectedValue,
        confidence,
        reason: `${rule.declarationName} detected partially or requires visual verification on original packaging.`,
        panelNote: 'Requires visual check',
        legalReference: rule.legalReference,
        requirement: rule.requirement,
        applicability: rule.applicability,
      }
    }

    if (!isMultiPanel && rule.standardPanelLocation === 'back_or_side_panel') {
      return {
        ruleId: rule.ruleId,
        ruleVersion: rule.ruleVersion,
        declarationName: rule.declarationName,
        fieldName: rule.fieldName,
        regulatoryFramework: rule.regulatoryFramework,
        status: 'unable_to_verify',
        detectedValue: null,
        confidence,
        reason: `${rule.declarationName} was not detected in provided single-view image. Additional package panels (e.g. back or side panel) not provided.`,
        panelNote: 'Back/side panel photo required',
        legalReference: rule.legalReference,
        requirement: rule.requirement,
        applicability: rule.applicability,
      }
    }

    // Status 3: POSSIBLE VIOLATION
    return {
      ruleId: rule.ruleId,
      ruleVersion: rule.ruleVersion,
      declarationName: rule.declarationName,
      fieldName: rule.fieldName,
      regulatoryFramework: rule.regulatoryFramework,
      status: 'possible_violation',
      detectedValue: null,
      confidence,
      reason: isMultiPanel
        ? `Mandatory declaration under ${rule.legalReference} (${rule.regulatoryFramework}) was not detected despite multi-panel coverage.`
        : `Mandatory declaration under ${rule.legalReference} (${rule.regulatoryFramework}) was not detected on visible principal packaging display.`,
      panelNote: isMultiPanel ? 'Checked across all provided views' : 'Principal display checked',
      legalReference: rule.legalReference,
      requirement: rule.requirement,
      applicability: rule.applicability,
    }
  })
}

/**
 * Derives overall scan status from mandatory declaration evaluations
 */
export function deriveOverallStatus(
  checks: MandatoryDeclarationCheckResult[],
  currentStatus: ScanStatus
): ScanStatus {
  const hasPossibleViolation = checks.some(c => c.status === 'possible_violation')
  const hasUnableToVerify = checks.some(c => c.status === 'unable_to_verify')

  if (hasPossibleViolation) return 'non_compliant'
  if (hasUnableToVerify) return 'needs_review'
  return currentStatus
}
