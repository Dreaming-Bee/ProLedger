import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/settings — return company settings (create default if not exists)
export async function GET() {
  try {
    let settings = await prisma.companySettings.findFirst()
    if (!settings) {
      settings = await prisma.companySettings.create({ data: {} })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error("GET /api/settings error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT /api/settings — update company settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { businessName, email, phone, address, logoUrl, brandColor, taxRate, currency } = body

    let settings = await prisma.companySettings.findFirst()

    if (settings) {
      settings = await prisma.companySettings.update({
        where: { id: settings.id },
        data: {
          ...(businessName !== undefined && { businessName }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(brandColor !== undefined && { brandColor }),
          ...(taxRate !== undefined && { taxRate: parseFloat(taxRate) }),
          ...(currency !== undefined && { currency }),
        },
      })
    } else {
      settings = await prisma.companySettings.create({
        data: { businessName, email, phone, address, logoUrl, brandColor, taxRate: parseFloat(taxRate ?? 8), currency },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("PUT /api/settings error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
