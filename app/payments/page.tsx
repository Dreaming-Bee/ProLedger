"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function PaymentsPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const payments = [
    { id: 1, invoice: "INV-2024-001", client: "Acme Marketing", date: "Apr 15, 2024", amount: "$4,500.00", method: "Stripe", status: "Success" },
    { id: 2, invoice: "INV-2024-004", client: "Eco Logistics", date: "Apr 16, 2024", amount: "$1,250.00", method: "Bank Transfer", status: "Success" },
    { id: 3, invoice: "INV-2024-002", client: "Global Tech", date: "Apr 18, 2024", amount: "$2,100.00", method: "Stripe", status: "Processing" },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader title="Payments" subtitle="Track and manage all incoming transactions" />
        
        <div className="p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Received</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">$142,500.00</h3>
              <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +12% from last month
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Clearance</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">$12,400.00</h3>
              <p className="text-xs text-slate-500 font-bold mt-2">5 transactions</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Processing</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">$2,100.00</h3>
              <p className="text-xs text-amber-500 font-bold mt-2">1 transaction</p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Recent Transactions</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 font-medium">{p.date}</td>
                      <td className="px-6 py-5 text-sm font-bold text-primary">{p.invoice}</td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-900 dark:text-slate-100">{p.client}</td>
                      <td className="px-6 py-5 text-sm text-slate-500">{p.method}</td>
                      <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-slate-100 text-right">{p.amount}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
