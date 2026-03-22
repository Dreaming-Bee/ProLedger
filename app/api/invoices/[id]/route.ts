import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/invoices/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}
