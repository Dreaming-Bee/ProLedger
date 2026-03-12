import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.lineItem.deleteMany({})
  await prisma.invoice.deleteMany({})
  await prisma.client.deleteMany({})

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

  // Seed Invoices
  await prisma.invoice.create({
    data: {
      number: "INV-2024-001",
      status: "Paid",
      statusColor: "text-green-600 bg-green-50",
      statusDot: "bg-green-500",
      dueDate: new Date("2024-05-12"),
      subtotal: 4500,
      tax: 360,
      total: 4860,
      clientId: acme.id,
      items: {
        create: [
          { description: "Website Design", qty: 1, price: 3000, total: 3000 },
          { description: "SEO Optimization", qty: 10, price: 150, total: 1500 },
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
