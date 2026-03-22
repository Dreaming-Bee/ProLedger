import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json()

    if (!image || !mimeType) {
      return NextResponse.json({ error: "No image or mimeType provided" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Analyze this invoice image/PDF and extract the following branding details as a JSON object:
    - businessName: The company or legal name of the sender
    - email: The business email address
    - phone: The business phone number
    - address: The full physical address
    - brandColor: The most dominant accent color used (as a hex code, e.g., #4F46E5)
    
    If any detail is missing, return an empty string for that field. 
    Only return the JSON object, nothing else.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image, // base64
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    // Extract JSON from the text response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not extract JSON from AI response" }, { status: 500 })
    }
    
    const extractedData = JSON.parse(jsonMatch[0])

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error("AI Extraction error:", error)
    return NextResponse.json({ error: "Failed to extract branding info" }, { status: 500 })
  }
}
