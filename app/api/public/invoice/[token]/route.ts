import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/public/invoice/[token] — no auth required
// Returns full invoice data + company settings for public view
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { shareToken: token },
      include: {
        client: true,
        items: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Fetch company settings for branding
    let company = await prisma.companySettings.findFirst()
    if (!company) {
      company = await prisma.companySettings.create({ data: {} })
    }

    return NextResponse.json({ invoice, company })
  } catch (error) {
    console.error("GET /api/public/invoice/[token] error:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}
