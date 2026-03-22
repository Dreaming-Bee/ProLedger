import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.lineItem.deleteMany({})
  await prisma.invoice.deleteMany({})
  await prisma.client.deleteMany({})
  await prisma.companySettings.deleteMany({})

  // Seed Company Settings
  await prisma.companySettings.create({
    data: {
      businessName: "ProLedger Solutions",
      email: "hello@proledger.io",
      phone: "+1 (555) 000-0000",
      address: "123 Innovation Drive, Silicon Valley, CA",
      taxRate: 12,
      currency: "USD",
      brandColor: "#6366F1"
    }
  })

  // Seed Clients
  const acme = await prisma.client.create({
    data: {
      name: "Acme Corp",
      initials: "AC",
      contact: "John Doe",
      email: "john@acme.com",
      address: "123 Business Ave, San Francisco, CA 94107",
      totalInvoiced: 12450.00,
    }
  })

  const globalTech = await prisma.client.create({
    data: {
      name: "Global Tech",
      initials: "GT",
      contact: "Sarah Smith",
      email: "s.smith@globaltech.io",
      address: "456 Tech Park, Austin, TX 78701",
      totalInvoiced: 8900.00,
    }
  })

  const horizonData = await prisma.client.create({
    data: {
      name: "Horizon Data",
      initials: "HD",
      contact: "Mike Ross",
      email: "mike@horizondata.com",
      address: "789 Insight St, Seattle, WA 98101",
      totalInvoiced: 0,
    }
  })

  // Seed Invoices
  await prisma.invoice.create({
    data: {
      number: "INV-2024-001",
      status: "Paid",
      statusColor: "text-green-600 bg-green-50",
      statusDot: "bg-green-500",
      date: new Date("2024-03-01"),
      dueDate: new Date("2024-03-15"),
      subtotal: 4500,
      tax: 540,
      total: 5040,
      clientId: acme.id,
      items: {
        create: [
          { description: "Website Design", qty: 1, price: 3000, total: 3000 },
          { description: "SEO Optimization", qty: 10, price: 150, total: 1500 },
        ]
      }
    }
  })

  await prisma.invoice.create({
    data: {
      number: "INV-2024-002",
      status: "Sent",
      statusColor: "text-blue-600 bg-blue-50",
      statusDot: "bg-blue-500",
      date: new Date("2024-03-10"),
      dueDate: new Date("2024-03-24"),
      subtotal: 2100,
      tax: 252,
      total: 2352,
      clientId: globalTech.id,
      items: {
        create: [
          { description: "API Integration", qty: 1, price: 2100, total: 2100 },
        ]
      }
    }
  })

  await prisma.invoice.create({
    data: {
      number: "INV-2024-003",
      status: "Overdue",
      statusColor: "text-red-600 bg-red-50",
      statusDot: "bg-red-500",
      date: new Date("2024-02-15"),
      dueDate: new Date("2024-03-01"),
      subtotal: 1200,
      tax: 144,
      total: 1344,
      clientId: acme.id,
      items: {
        create: [
          { description: "Cloud Migration", qty: 1, price: 1200, total: 1200 },
        ]
      }
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
