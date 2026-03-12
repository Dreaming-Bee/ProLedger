"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import AppHeader from "@/components/app-header"

export default function ReportsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return null

  const reportCards = [
    { title: "Net Revenue", value: "$42,850.00", trend: "+12.5%", color: "text-green-600", icon: "payments" },
    { title: "Average Invoice", value: "$1,240.00", trend: "+3.2%", color: "text-blue-600", icon: "receipt" },
    { title: "Outstanding", value: "$8,120.00", trend: "-5.4%", color: "text-amber-600", icon: "timer" },
    { title: "Expenses", value: "$12,400.00", trend: "+8.1%", color: "text-red-600", icon: "shopping_cart" },
  ]

  const monthlyData = [
    { month: "Jan", revenue: 45, expenses: 30 },
    { month: "Feb", revenue: 52, expenses: 35 },
    { month: "Mar", revenue: 48, expenses: 32 },
    { month: "Apr", revenue: 61, expenses: 40 },
    { month: "May", revenue: 55, expenses: 38 },
    { month: "Jun", revenue: 67, expenses: 42 },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AppHeader title="Financial Reports" subtitle="Analyze your business performance and growth" />
        
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              {["Last 7 Days", "Last 30 Days", "Year to Date", "All Time"].map((tab) => (
                <button 
                  key={tab}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tab === "Last 30 Days" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Export PDF Report
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportCards.map((card, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full bg-slate-50 dark:bg-slate-800 ${card.color}`}>
                    {card.trend}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart Placeholder */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Revenue Growth</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Expenses</span>
                  </div>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-4 pt-4">
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full flex justify-center gap-1.5 h-full items-end">
                      <div 
                        className="w-1/2 bg-primary rounded-t-lg transition-all group-hover:bg-primary/80 relative"
                        style={{ height: `${data.revenue}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1 px-2 rounded whitespace-nowrap z-10 transition-all">
                          ${data.revenue}k
                        </div>
                      </div>
                      <div 
                        className="w-1/2 bg-slate-100 dark:bg-slate-800 rounded-t-lg transition-all group-hover:bg-slate-200 dark:group-hover:bg-slate-700" 
                        style={{ height: `${data.expenses}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Top Clients</h3>
              <div className="space-y-6">
                {[
                  { name: "Acme Corp", share: 35, color: "bg-blue-500" },
                  { name: "Global Tech", share: 28, color: "bg-indigo-500" },
                  { name: "Starlight Inc", share: 22, color: "bg-purple-500" },
                  { name: "Others", share: 15, color: "bg-slate-300" },
                ].map((client, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-slate-900 dark:text-slate-100">{client.name}</span>
                      <span className="text-slate-500">{client.share}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${client.color}`} style={{ width: `${client.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full py-3 text-xs font-black text-primary hover:underline transition-all">
                  View Full Breakdown
                </button>
              </div>
            </div>
          </div>

          {/* Table section for detailed logs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Recent Activity Log</h3>
              <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                View Full Logs
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { action: "Invoice Created #INV-009", user: "Alex Rivera", date: "2 mins ago", impact: "+$2,500.00", color: "text-green-600" },
                  { action: "Payment Received #INV-001", user: "System", date: "1 hour ago", impact: "+$4,500.00", color: "text-green-600" },
                  { action: "Invoice Overdue #INV-003", user: "System", date: "4 hours ago", impact: "-$8,940.00", color: "text-red-500" },
                  { action: "Settings Updated", user: "Alex Rivera", date: "Yesterday", impact: "Neutral", color: "text-slate-400" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">{row.action}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{row.user}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{row.date}</td>
                    <td className={`px-8 py-4 text-sm font-black text-right ${row.color}`}>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
