import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/invoices/[id]/share-token
// Generates a share token for the invoice (idempotent — returns existing token if already set)
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({ where: { id } })
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // If already has a token, return it
    if (invoice.shareToken) {
      return NextResponse.json({ token: invoice.shareToken })
    }

    // Generate a new random token (URL-safe base64-like string)
    const array = new Uint8Array(24)
    crypto.getRandomValues(array)
    const token = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    const updated = await prisma.invoice.update({
      where: { id },
      data: { shareToken: token },
    })

    return NextResponse.json({ token: updated.shareToken })
  } catch (error) {
    console.error("POST /api/invoices/[id]/share-token error:", error)
    return NextResponse.json({ error: "Failed to generate share token" }, { status: 500 })
  }
}

// GET /api/invoices/[id]/share-token — retrieve the existing token (or null)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invoice = await prisma.invoice.findUnique({ where: { id }, select: { shareToken: true } })
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }
    return NextResponse.json({ token: invoice.shareToken ?? null })
  } catch (error) {
    console.error("GET /api/invoices/[id]/share-token error:", error)
    return NextResponse.json({ error: "Failed to fetch share token" }, { status: 500 })
  }
}
