"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function InvoicesPage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [router])

  const [invoices, setInvoices] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, setRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/settings")
        ])
        if (invRes.ok && setRes.ok) {
          const invData = await invRes.json()
          const setData = await setRes.json()
          setInvoices(invData)
          setSettings(setData)
        }
      } catch (error) {
        console.error("Failed to fetch invoices", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: settings?.currency || "USD" }).format(amount)

  const filteredInvoices = invoices.filter(inv => 
    inv.number.toLowerCase().includes(searchValue.toLowerCase()) || 
    inv.client.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <AppHeader 
          title="Invoices" 
          subtitle="Manage and track your business billing" 
          searchPlaceholder="Search invoices..."
        />
        
        <div className="p-8 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                <button className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-md">All Invoices</button>
                <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Paid</button>
                <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Pending</button>
                <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Overdue</button>
              </div>
            </div>
            
            <button
              onClick={() => router.push("/invoices/create")}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Create New Invoice
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice #</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 w-20 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                    >
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{invoice.number}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                            {invoice.client.initials}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{invoice.client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {new Date(invoice.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-slate-100 text-right">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${invoice.statusColor}`}>
                            <span className={`size-1.5 rounded-full ${invoice.statusDot}`} />
                            {invoice.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State Helper (Search) */}
            {invoices.length === 0 && (
              <div className="p-20 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">search_off</span>
                <p className="text-slate-500 font-medium">No invoices found matching your criteria.</p>
              </div>
            )}

            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">Showing {filteredInvoices.length} of {invoices.length} invoices</p>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 text-xs font-bold bg-primary text-white rounded">1</button>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  )
}
