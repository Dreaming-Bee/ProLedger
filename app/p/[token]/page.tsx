"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface LineItem {
  id: string
  description: string
  qty: number
  price: number
  total: number
}

interface Client {
  name: string
  email: string
  address: string
}

interface Invoice {
  number: string
  status: string
  statusColor: string
  statusDot: string
  date: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  client: Client
  items: LineItem[]
}

interface Company {
  businessName: string
  email: string
  phone: string
  address: string
  logoUrl: string | null
  brandColor: string
  taxRate: number
  currency: string
}

export default function PublicInvoicePage() {
  const params = useParams()
  const token = params?.token as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/public/invoice/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invoice not found")
        return res.json()
      })
      .then((data) => {
        setInvoice(data.invoice)
        setCompany(data.company)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Loading your invoice…</p>
        </div>
      </div>
    )
  }

  if (error || !invoice || !company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl text-red-400">error</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">Invoice Not Found</h1>
          <p className="text-slate-500 text-sm">
            This link may be invalid or the invoice has been removed. Please contact the sender.
          </p>
        </div>
      </div>
    )
  }

  const accentColor = company.brandColor || "#4F46E5"

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Brand color accent bar */}
          <div style={{ backgroundColor: accentColor, height: "6px" }} />

          <div className="p-10 space-y-10">
            {/* Header: Branding + Status */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt="Company logo"
                    className="h-12 w-auto object-contain rounded-lg"
                  />
                ) : (
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ color: accentColor }}
                    >
                      account_balance_wallet
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900">
                    {company.businessName}
                  </h1>
                  {company.email && (
                    <p className="text-xs text-slate-400">{company.email}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${invoice.statusColor}`}
                >
                  <span className={`size-1.5 rounded-full ${invoice.statusDot}`} />
                  {invoice.status.toUpperCase()}
                </span>
                <h2 className="text-2xl font-black text-slate-900">{invoice.number}</h2>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-slate-900">{company.businessName}</p>
                  {company.email && <p className="text-slate-500">{company.email}</p>}
                  {company.phone && <p className="text-slate-500">{company.phone}</p>}
                  {company.address && <p className="text-slate-500">{company.address}</p>}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill To</p>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-slate-900">{invoice.client.name}</p>
                  <p className="text-slate-500">{invoice.client.email}</p>
                  <p className="text-slate-500">{invoice.client.address}</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-12 pt-6 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Issued</p>
                <p className="text-sm font-bold text-slate-900">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                <p className="text-sm font-bold text-slate-900">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
                    <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-5">
                        <p className="text-sm font-bold text-slate-900">{item.description}</p>
                      </td>
                      <td className="py-5 text-sm text-slate-600 text-center font-medium">{item.qty}</td>
                      <td className="py-5 text-sm text-slate-600 text-right font-medium">
                        {formatCurrency(item.price, company.currency)}
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-900 text-right">
                        {formatCurrency(item.qty * item.price, company.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-[240px] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900">{formatCurrency(invoice.subtotal, company.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Tax ({company.taxRate}%)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(invoice.tax, company.currency)}</span>
                </div>
                <div className="pt-3 border-t-2 border-slate-100 flex justify-between items-center">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-xl font-black" style={{ color: accentColor }}>
                    {formatCurrency(invoice.total, company.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">
            Powered by{" "}
            <span className="font-black text-slate-500">ProLedger</span>
            {" "}· Secure Invoice Sharing
          </p>
        </div>
      </div>
    </div>
  )
}
