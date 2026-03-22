import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/clients — Fetch all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error("GET /api/clients error:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

// POST /api/clients — Create a new client
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, initials, contact, email, address } = body

    const client = await prisma.client.create({
      data: {
        name,
        initials,
        contact,
        email,
        address,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error("POST /api/clients error:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
