# LabelCheck — AI-Powered Packaged Commodity Compliance Checker

**Smart India Hackathon 2026 — Problem Statement: PSC26034**  
*Scan. Verify. Comply.*

LabelCheck is a modern, full-stack compliance checking platform based on India's **Legal Metrology (Packaged Commodities) Rules, 2011**. It allows consumers, manufacturers, brand owners, and enforcement officers to upload or capture product labels and instantly verify whether all mandatory declarations are present, legible, and legally compliant.

---

## 🚀 Features

- **Instant Label Analysis**: Upload or capture product package images (JPG, PNG, WEBP) to scan for declarations.
- **10 Mandatory Declarations Checked**:
  1. Product Name / Generic Description (Rule 6(1)(a))
  2. Manufacturer Name (Rule 6(1)(b))
  3. Manufacturer Address & PIN (Rule 6(1)(b))
  4. Net Quantity in standard units (Rule 6(1)(c))
  5. Maximum Retail Price (MRP incl. of all taxes) (Rule 6(1)(d))
  6. Month & Year of Manufacture / Packing (Rule 6(1)(e))
  7. Consumer Care Helpline & Grievance Contact (Rule 6(1)(f))
  8. Country of Origin for imported goods (Rule 6(1)(g))
  9. Importer details (Rule 6(1)(h))
  10. Best Before / Expiry Date
- **Quantitative Compliance Score**: Clear 0-100% score calculation with Compliant / Needs Review / Non-Compliant status.
- **Actionable Issue Reporting**: Detailed findings showing observation, legal significance, severity, and suggested remediation.
- **Checklist with Dynamic Filters**: Filter declarations by Passed, Needs Review, or Missing.
- **Audit History & Reporting**: Search, sort, filter past scans, and generate print/PDF audit reports.
- **Modern GovTech / RegTech Design**: Clean, trustworthy UI built with Tailwind CSS and Radix UI primitives.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Variables for theming, Lucide Icons
- **Data Visualizations**: Recharts (trend graphs & declaration distribution)
- **State & Notifications**: Sonner (toasts), React Hook Form, Zod
- **Backend & Database**: Supabase (PostgreSQL, Authentication, Storage, Row Level Security)
- **AI Abstraction**: `services/analyzer.ts` (Ready for Gemini 3.7 Flash / Google Vision integration)

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or pnpm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd SIH-PSC26034

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: The application is built with a resilient demo fallback layer. You can test and demonstrate the full scanning, analysis, and reporting flow even before configuring your Supabase project!

### 4. Supabase Database Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase dashboard.
3. Open and run the provided SQL script: `supabase/schema.sql`.
4. In **Storage**, create a public bucket named `product-images`.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Connecting Real OCR / AI (Gemini 3.7 Flash)

The system is designed with a clean abstraction layer in `src/services/analyzer.ts`.

To switch from the demo mock analyzer to live multimodal AI extraction:

1. Install Google GenAI SDK:
   ```bash
   npm install @google/genai
   ```
2. In `src/services/analyzer.ts`, replace the `mockAnalyze` logic with:
   ```typescript
   import { GoogleGenAI } from '@google/genai'
   import { COMPLIANCE_PROMPT } from './analyzer'

   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

   export async function analyzeProduct(imageFile: File | null, imageUrl?: string): Promise<AnalysisResult> {
     // Convert file or imageUrl to base64 inline data
     const base64Data = await fileToBase64(imageFile)

     const response = await ai.models.generateContent({
       model: 'gemini-3.7-flash',
       contents: [
         {
           parts: [
             { inlineData: { mimeType: imageFile.type, data: base64Data } },
             { text: COMPLIANCE_PROMPT }
           ]
         }
       ]
     })

     const parsed = JSON.parse(response.text)
     return formatComplianceResult(parsed)
   }
   ```

---

## 🧭 Application Routes

### Public Pages
- `/` — Landing Page (Hero, How It Works, Features, Compliance, CTA)
- `/how-it-works` — Step-by-step extraction & verification workflow
- `/features` — Core capability highlights
- `/compliance` — Legal Metrology (Packaged Commodities) Rules, 2011 definitions
- `/about` — Hackathon problem statement & legal disclaimer
- `/login` & `/signup` — Authentication with Supabase

### Authenticated & Inspection Pages
- `/dashboard` — Inspection statistics, compliance trends, recent audits
- `/scan` — Drag-and-drop / Camera product label scanner & real-time analysis animation
- `/reports/[id]` — Detailed compliance audit report with printable layout
- `/history` — Audit logs with search, status filters, and sorting
- `/settings` — Inspector profile and rule engine configuration

---

## 📄 License & Disclaimer

Built for Smart India Hackathon 2026 (Problem Statement PSC26034).  
*Disclaimer: LabelCheck is a compliance assistance and pre-audit screening system. Results are indicative and should be verified against physical product packaging and official Legal Metrology regulations.*
