export interface ComplianceRule {
  id: string
  fieldName: string
  displayName: string
  legalReference: string
  description: string
  mandatory: boolean
  category: 'identification' | 'quantity' | 'pricing' | 'safety' | 'manufacturer' | 'date' | 'other'
}

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'product_name',
    fieldName: 'product_name',
    displayName: 'Product Name',
    legalReference: 'Rule 6(1)(a)',
    description: 'The name of the commodity must be declared on the package.',
    mandatory: true,
    category: 'identification',
  },
  {
    id: 'manufacturer_name',
    fieldName: 'manufacturer_name',
    displayName: 'Manufacturer Name',
    legalReference: 'Rule 6(1)(b)',
    description: 'Name and address of the manufacturer/packer/importer must be declared.',
    mandatory: true,
    category: 'manufacturer',
  },
  {
    id: 'manufacturer_address',
    fieldName: 'manufacturer_address',
    displayName: 'Manufacturer Address',
    legalReference: 'Rule 6(1)(b)',
    description: 'Complete address of the manufacturer/packer must be declared.',
    mandatory: true,
    category: 'manufacturer',
  },
  {
    id: 'net_quantity',
    fieldName: 'net_quantity',
    displayName: 'Net Quantity',
    legalReference: 'Rule 6(1)(c)',
    description: 'Net quantity in standard unit of weight, measure or number must be declared.',
    mandatory: true,
    category: 'quantity',
  },
  {
    id: 'mrp',
    fieldName: 'mrp',
    displayName: 'Maximum Retail Price (MRP)',
    legalReference: 'Rule 6(1)(d)',
    description: 'MRP inclusive of all taxes must be declared.',
    mandatory: true,
    category: 'pricing',
  },
  {
    id: 'manufacture_date',
    fieldName: 'manufacture_date',
    displayName: 'Date of Manufacture / Packing',
    legalReference: 'Rule 6(1)(e)',
    description: 'Month and year of manufacture or packing must be declared.',
    mandatory: true,
    category: 'date',
  },
  {
    id: 'consumer_care',
    fieldName: 'consumer_care',
    displayName: 'Consumer Care Details',
    legalReference: 'Rule 6(1)(f)',
    description: 'Name, address and telephone number of consumer care / grievance officer must be declared.',
    mandatory: true,
    category: 'safety',
  },
  {
    id: 'country_of_origin',
    fieldName: 'country_of_origin',
    displayName: 'Country of Origin',
    legalReference: 'Rule 6(1)(g)',
    description: 'Country of origin/manufacture must be declared for imported products.',
    mandatory: false,
    category: 'identification',
  },
  {
    id: 'importer_details',
    fieldName: 'importer_details',
    displayName: 'Importer Details',
    legalReference: 'Rule 6(1)(h)',
    description: 'For imported products, name and address of importer must be declared.',
    mandatory: false,
    category: 'manufacturer',
  },
  {
    id: 'expiry_date',
    fieldName: 'expiry_date',
    displayName: 'Best Before / Expiry Date',
    legalReference: 'Rule 6(1)(e)',
    description: 'Best before or expiry date must be declared for applicable commodities.',
    mandatory: false,
    category: 'date',
  },
]

export const DECLARATION_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'identification', label: 'Identification' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'manufacturer', label: 'Manufacturer' },
  { id: 'date', label: 'Dates' },
  { id: 'safety', label: 'Safety & Care' },
]

export const ANALYSIS_STEPS = [
  { id: 'upload', label: 'Processing image', description: 'Preparing your product image for analysis...', duration: 800 },
  { id: 'ocr', label: 'Reading label', description: 'Extracting text and visual elements from the package...', duration: 1200 },
  { id: 'extract', label: 'Extracting declarations', description: 'Identifying required declaration fields...', duration: 1000 },
  { id: 'verify', label: 'Checking compliance', description: 'Verifying against Legal Metrology requirements...', duration: 1200 },
  { id: 'report', label: 'Generating report', description: 'Compiling your compliance analysis report...', duration: 800 },
]

export { MANDATORY_DECLARATION_RULES } from '@/services/rule-engine'
