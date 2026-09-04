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

export async function POST(request: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured.' },
                { status: 500 }
            )
        }

        const formData = await request.formData()
        const image = formData.get('image')

        if (!(image instanceof File)) {
            return NextResponse.json(
                { error: 'No image file was provided.' },
                { status: 400 }
            )
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ]

        if (!allowedTypes.includes(image.type)) {
            return NextResponse.json(
                { error: 'Only JPG, PNG and WEBP images are supported.' },
                { status: 400 }
            )
        }

        if (image.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Image must be smaller than 10 MB.' },
                { status: 400 }
            )
        }

        const imageBuffer = Buffer.from(await image.arrayBuffer())
        const base64Image = imageBuffer.toString('base64')

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        })

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: [
                {
                    inlineData: {
                        mimeType: image.type,
                        data: base64Image,
                    },
                },
                {
                    text: COMPLIANCE_PROMPT,
                },
            ],
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
        console.error('Gemini analysis error:', error)

        return NextResponse.json(
            {
                error: 'Failed to analyze the product image.',
            },
            { status: 500 }
        )
    }
}