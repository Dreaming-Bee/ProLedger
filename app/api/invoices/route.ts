import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/invoices — Fetch all invoices with client and item data
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("GET /api/invoices error:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

// POST /api/invoices — Create a new invoice
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { number, date, dueDate, clientId, subtotal, tax, total, items } = body

    const invoice = await prisma.invoice.create({
      data: {
        number,
        date: new Date(date),
        dueDate: new Date(dueDate),
        clientId,
        subtotal,
        tax,
        total,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            qty: item.qty,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("POST /api/invoices error:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
