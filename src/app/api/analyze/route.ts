import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const COMPLIANCE_PROMPT = `
You are a Legal Metrology compliance expert analyzing an Indian packaged commodity label.

Read the product label image carefully and extract the following declarations:

1. Product Name
2. Manufacturer/Packer Name
3. Manufacturer/Packer Address
4. Net Quantity with unit
5. Maximum Retail Price (MRP), including whether it says inclusive of all taxes
6. Month and Year of Manufacture/Packing
7. Consumer Care contact details
8. Country of Origin, if applicable
9. Importer details, if applicable
10. Best Before / Expiry Date, if applicable

Be conservative:
- Only mark something as "detected" when it is clearly readable.
- If text is partially readable or uncertain, use "needs_review".
- If the declaration cannot be found, use "missing".
- Do not invent information.
- Use the exact text from the label whenever possible.

Return ONLY valid JSON in this exact structure:

{
  "productName": "string",
  "declarations": [
    {
      "fieldName": "product_name",
      "displayName": "Product Name",
      "detectedValue": "string or null",
      "status": "detected",
      "confidence": 0.95
    }
  ]
}

The allowed status values are:
"detected", "needs_review", "missing"

Confidence must be a number between 0 and 1.
`

function getSafeGeminiDiagnostic(error: unknown) {
    const candidate = error as {
        message?: unknown
        status?: unknown
        statusCode?: unknown
        code?: unknown
    }
    const apiKey = process.env.GEMINI_API_KEY
    const rawMessage = error instanceof Error
        ? error.message
        : typeof candidate?.message === 'string'
            ? candidate.message
            : 'Unknown Gemini API error.'

    return {
        message: apiKey ? rawMessage.replaceAll(apiKey, '[REDACTED]') : rawMessage,
        status: typeof candidate?.status === 'number'
            ? candidate.status
            : typeof candidate?.statusCode === 'number'
                ? candidate.statusCode
                : null,
        code: typeof candidate?.code === 'string' || typeof candidate?.code === 'number'
            ? candidate.code
            : null,
    }
}

export async function POST(request: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured.' },
                { status: 500 }
            )
        }

        const formData = await request.formData()
        const images = formData.getAll('images')

        if (images.length === 0 || !images.every(image => image instanceof File)) {
            return NextResponse.json(
                { error: 'No image files were provided.' },
                { status: 400 }
            )
        }

        const imageFiles = images as File[]

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ]

        if (imageFiles.some(image => !allowedTypes.includes(image.type))) {
            return NextResponse.json(
                { error: 'Only JPG, PNG and WEBP images are supported.' },
                { status: 400 }
            )
        }

        if (imageFiles.some(image => image.size > 10 * 1024 * 1024)) {
            return NextResponse.json(
                { error: 'Image must be smaller than 10 MB.' },
                { status: 400 }
            )
        }

        const imageParts = await Promise.all(
            imageFiles.map(async image => ({
                inlineData: {
                    mimeType: image.type,
                    data: Buffer.from(await image.arrayBuffer()).toString('base64'),
                },
            }))
        )

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        })

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: [{
                parts: [
                    ...imageParts,
                    {
                        text: `${COMPLIANCE_PROMPT}\n\nThe supplied images are different views of the same product. Combine evidence from all views before producing one result.`,
                    },
                ],
            }],
            config: {
                responseMimeType: 'application/json',
            },
        })

        const text = response.text

        if (!text) {
            throw new Error('Gemini returned an empty response.')
        }

        const cleanedText = text
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim()

        const parsed = JSON.parse(cleanedText)

        return NextResponse.json(parsed)
    } catch (error) {
        const diagnostic = getSafeGeminiDiagnostic(error)
        console.error('Gemini analysis error:', diagnostic)

        return NextResponse.json(
            {
                error: 'Failed to analyze the product image.',
                diagnostic,
            },
            { status: 500 }
        )
    }
}
