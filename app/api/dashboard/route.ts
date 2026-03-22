import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/dashboard — Fetch summary statistics for the dashboard
export async function GET() {
  try {
    const [invoices, totalClients, recentInvoices] = await Promise.all([
      prisma.invoice.findMany(),
      prisma.client.count(),
      prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { client: true },
      }),
    ])

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const pendingAmount = invoices
      .filter((inv) => inv.status !== "Paid")
      .reduce((sum, inv) => sum + inv.total, 0)
    
    // Quick count of statuses
    const paidCount = invoices.filter((inv) => inv.status === "Paid").length
    const sentCount = invoices.filter((inv) => inv.status === "Sent").length
    const overdueCount = invoices.filter((inv) => inv.status === "Overdue").length

    return NextResponse.json({
      stats: {
        totalRevenue,
        pendingAmount,
        activeClients: totalClients,
        totalInvoices: invoices.length,
        breakdown: {
          paid: paidCount,
          sent: sentCount,
          overdue: overdueCount,
        }
      },
      recentInvoices,
    })
  } catch (error) {
    console.error("GET /api/dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
