"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/")
    }
  }, [router])

  // Mock data for a single invoice
  const invoice = {
    number: "INV-2024-001",
    status: "Paid",
    statusColor: "text-green-600 bg-green-50",
    statusDot: "bg-green-500",
    date: "April 12, 2024",
    dueDate: "May 12, 2024",
    client: {
      name: "Acme Marketing",
      contact: "John Doe",
      email: "john@acme.com",
      address: "123 Business Ave, San Francisco, CA 94107",
    },
    items: [
      { id: 1, description: "Website Design", qty: 1, price: 3000 },
      { id: 2, description: "SEO Optimization", qty: 10, price: 150 },
    ],
    subtotal: 4500,
    tax: 360,
    total: 4860,
    history: [
      { date: "Apr 12, 2024 10:30 AM", event: "Invoice Created", user: "Admin" },
      { date: "Apr 12, 2024 10:35 AM", event: "Invoice Sent to john@acme.com", user: "System" },
      { date: "Apr 15, 2024 02:20 PM", event: "Payment Received", user: "System" },
    ],
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader 
          title={`Invoice ${invoice.number}`} 
          subtitle="View and manage invoice details"
        />

        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to List
            </button>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                Download PDF
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-opacity">
                <span className="material-symbols-outlined text-lg">send</span>
                Send to Client
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Invoice Card */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Visual Header */}
                <div className="h-2 bg-primary" />
                
                <div className="p-10 space-y-10">
                  {/* Branding & Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary p-2 rounded-lg">
                        <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
                      </div>
                      <h3 className="text-xl font-black tracking-tight">ProLedger</h3>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${invoice.statusColor}`}>
                        <span className={`size-1.5 rounded-full ${invoice.statusDot}`} />
                        {invoice.status.toUpperCase()}
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{invoice.number}</h2>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                      <div className="text-sm">
                        <p className="font-bold text-slate-900 dark:text-slate-100">ProLedger Inc.</p>
                        <p className="text-slate-500 dark:text-slate-400">billing@proledger.com</p>
                        <p className="text-slate-500 dark:text-slate-400">456 Finance Way, New York, NY 10001</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill To</p>
                      <div className="text-sm">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{invoice.client.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{invoice.client.email}</p>
                        <p className="text-slate-500 dark:text-slate-400">{invoice.client.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Issued</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{invoice.dueDate}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-100 dark:border-slate-800">
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Price</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {invoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-5">
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.description}</p>
                            </td>
                            <td className="py-5 text-sm text-slate-600 dark:text-slate-400 text-center font-medium">{item.qty}</td>
                            <td className="py-5 text-sm text-slate-600 dark:text-slate-400 text-right font-medium">${item.price.toFixed(2)}</td>
                            <td className="py-5 text-sm font-bold text-slate-900 dark:text-slate-100 text-right">${(item.qty * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Summary */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-[240px] space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">${invoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Tax (8%)</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">${invoice.tax.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-base font-black text-slate-900 dark:text-slate-100">Total</span>
                        <span className="text-xl font-black text-primary">${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Details & History */}
            <div className="space-y-8">
              {/* Status Section */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 text-xs font-bold bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">Mark Paid</button>
                  <button className="py-2 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity Timeline</h4>
                <div className="space-y-6">
                  {invoice.history.map((h, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i < invoice.history.length - 1 && (
                        <div className="absolute left-[7px] top-4 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-800" />
                      )}
                      <div className="size-4 rounded-full border-2 border-primary bg-white z-10 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{h.event}</p>
                        <p className="text-[10px] text-slate-500">{h.date} • {h.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Link */}
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Public Share Link</h4>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={`https://proledger.io/p/${id}`} 
                    className="flex-1 bg-white dark:bg-slate-900 border border-primary/20 rounded-lg px-3 py-2 text-[10px] font-medium text-slate-600"
                  />
                  <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
                <p className="text-[10px] text-primary/70 font-medium">Clients can view and pay via this link without logging in.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
